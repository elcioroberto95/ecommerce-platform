# AWS Deployment Runbook

Runbook for deploying this project to Ubuntu EC2 with Docker Compose, Nginx,
AWS Systems Manager, GitHub Actions and CloudWatch.

## 1. Architecture

- **EC2:** virtual machine that runs the application.
- **Docker Compose:** backend, frontend, PostgreSQL and Redis services.
- **Nginx:** public reverse proxy.
- **SSM:** administrative access and remote commands.
- **GitHub Actions:** CI/CD pipeline.
- **CloudWatch Agent:** memory, disk and swap metrics.

Public request flow:

```text
Browser -> Nginx :80/:443 -> frontend :3001
                         -> backend :3000 through /api/
```

The production instance used in this project is in `us-east-2`.

Never put real passwords, tokens, private keys, account IDs or public IPs in
this document.

## 2. EC2 and initial access

1. Create an Ubuntu EC2 instance.
2. Choose enough memory for the Docker build and database.
3. Allocate and associate an Elastic IP.
4. Create a Security Group.
5. Connect with SSH:

```bash
chmod 400 main-key.pem
ssh -i main-key.pem ubuntu@ELASTIC_IP
```

Install and enable Docker:

```bash
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu
```

Reconnect after adding the user to the Docker group.

## 3. Security Group

Recommended inbound rules:

```text
HTTP   TCP 80   0.0.0.0/0
HTTPS  TCP 443  0.0.0.0/0
SSH    TCP 22   YOUR_CURRENT_PUBLIC_IP/32
```

Do not expose SSH to `0.0.0.0/0`. If the local public IP changes, update the
SSH rule. SSM is the fallback administrative access method.

## 4. Clone and configure the project

```bash
cd ~
git clone https://github.com/OWNER/REPOSITORY.git ecommerce-platform
cd /home/ubuntu/ecommerce-platform
```

The deploy workflow expects this exact path:

```text
/home/ubuntu/ecommerce-platform
```

Create the real environment file only on the server:

```bash
cp deploy.env.example deploy.env
nano deploy.env
```

Example structure:

```env
PUBLIC_APP_URL=http://ELASTIC_IP
PUBLIC_API_URL=http://ELASTIC_IP/api/v1

POSTGRES_USER=ecommerce
POSTGRES_PASSWORD=LONG_RANDOM_DATABASE_PASSWORD
POSTGRES_DB=ecommerce
DATABASE_URL=postgresql://ecommerce:LONG_RANDOM_DATABASE_PASSWORD@postgres:5432/ecommerce

JWT_SECRET=LONG_RANDOM_JWT_SECRET
LOG_LEVEL=info
```

Important:

- `deploy.env` must never be committed.
- `deploy.env.example` contains placeholders only.
- The PostgreSQL password must match in `POSTGRES_PASSWORD` and
  `DATABASE_URL`.
- The hostname `postgres` works inside Compose. It is not the EC2 IP.
- Public URLs use Nginx ports, not the internal container ports.

## 5. Start the production stack

```bash
cd /home/ubuntu/ecommerce-platform
docker compose --env-file deploy.env -f docker-compose.prod.yml build
docker compose --env-file deploy.env -f docker-compose.prod.yml up -d
docker compose --env-file deploy.env -f docker-compose.prod.yml ps
```

Diagnostics:

```bash
docker compose --env-file deploy.env -f docker-compose.prod.yml logs backend
docker compose --env-file deploy.env -f docker-compose.prod.yml logs postgres
```

Health checks:

```bash
curl http://localhost/api/v1/health
curl http://localhost/api/v1/health/ready
```

## 6. Database schema and seed

Synchronize the Prisma schema when the database is new:

```bash
docker compose --env-file deploy.env -f docker-compose.prod.yml exec backend pnpm prisma db push
```

`prisma db push` synchronizes the schema directly. It does not create a
migration history and does not seed data.

The default seed creates too much data for a small EC2 instance. Use small
values in production demonstrations:

```bash
docker compose --env-file deploy.env -f docker-compose.prod.yml exec \
  -e SEED_PRODUCTS=20 \
  -e SEED_USERS=3 \
  -e SEED_ORDERS=5 \
  backend pnpm run seed
```

Check resources after seeding:

```bash
free -h
df -h
docker stats --no-stream
```

## 7. Nginx reverse proxy

Nginx exposes the public HTTP entry point and forwards traffic to the
containers.

Example `/etc/nginx/sites-available/ecommerce`:

```nginx
server {
    listen 80 default_server;
    server_name _;

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and validate:

```bash
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/ecommerce
sudo nginx -t
sudo systemctl enable --now nginx
sudo systemctl reload nginx
```

## 8. SSM access

Attach this policy to the IAM role associated with the EC2 instance:

```text
AmazonSSMManagedInstanceCore
```

Install and enable the agent on Ubuntu when necessary:

```bash
sudo snap install amazon-ssm-agent --classic
sudo snap start --enable amazon-ssm-agent
sudo snap services amazon-ssm-agent
```

The instance must appear as an **Online** managed node in Systems Manager in
`us-east-2`.

Use **Systems Manager -> Session Manager** for a browser terminal or
**Run Command** for remote commands.

## 9. GitHub Actions with OIDC and SSM

Create an IAM OIDC provider:

```text
Provider URL: https://token.actions.githubusercontent.com
Audience: sts.amazonaws.com
```

Create a GitHub deployment role and restrict its trust policy to the expected
repository and branch. Grant it only:

```text
ssm:SendCommand
ssm:GetCommandInvocation
```

Use `us-east-2` in all relevant resource ARNs.

Create these GitHub repository secrets:

```text
AWS_DEPLOY_ROLE_ARN=ARN of the GitHub deployment role
EC2_INSTANCE_ID=i-xxxxxxxxxxxxxxxxx
```

The deploy workflow runs after the `CI` workflow succeeds on `master`. It
authenticates through OIDC, sends an SSM command and waits for its result.

SSM commands run as `root`, so `~` points to `/root`. Always use:

```bash
cd /home/ubuntu/ecommerce-platform
git -c safe.directory=/home/ubuntu/ecommerce-platform checkout master
git -c safe.directory=/home/ubuntu/ecommerce-platform pull --ff-only origin master
```

Avoid `git config --global` in SSM commands because `$HOME` may not be set.

The workflow region must match the EC2 region:

```yaml
env:
  AWS_REGION: us-east-2
```

## 10. CloudWatch monitoring

The EC2 IAM role needs:

```text
CloudWatchAgentServerPolicy
```

Install the agent through Systems Manager Run Command:

```text
Document: AWS-ConfigureAWSPackage
Action: Install
Name: AmazonCloudWatchAgent
Version: latest
```

Create `/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json`
with memory, disk and swap metrics. Start it with:

```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
  -s
```

Verify:

```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a status
```

Expected values are `running` and `configured`.

## 11. Backups

The database seed can be large. Do not schedule local dumps automatically on
a small volume without checking capacity:

```bash
df -h
du -sh /home/ubuntu/backups
```

A backup on the same EC2 disk does not protect against total instance or
volume loss. Before automating backups, choose external storage or a managed
backup strategy, define retention and test restoration.

## 12. Verification checklist

After a deployment:

```bash
docker compose --env-file deploy.env -f docker-compose.prod.yml ps
curl http://localhost/api/v1/health
curl http://localhost/api/v1/health/ready
sudo systemctl is-active nginx
df -h
free -h
```

From a browser:

```text
http://ELASTIC_IP
```

## 13. Troubleshooting

### Invalid `APP_URL`

Use a complete URL:

```env
PUBLIC_APP_URL=http://ELASTIC_IP
```

### Database authentication failure

Confirm the password in `POSTGRES_PASSWORD` matches the password in
`DATABASE_URL`. An existing PostgreSQL volume does not automatically adopt a
new password.

### Missing database table

Run `prisma db push` before the seed.

### SSM node is missing

Check the IAM role, region, agent and outbound HTTPS:

```bash
sudo snap services amazon-ssm-agent
sudo snap logs amazon-ssm-agent -n 50
```

### SSM cannot run Git

Use the absolute path and `git -c safe.directory=...` commands from section 9.

### Compose file not found

`docker-compose.prod.yml` must exist in `origin/master`. If it only exists
on a feature branch, merge the production Compose configuration into `master`.

### SSH stops working

The Security Group allows SSH only from one public IP. Update that rule when
the IP changes or use Session Manager.

## 14. Learning path

To reproduce the environment independently:

1. Create an EC2 instance and connect with SSH.
2. Install Docker and run Compose.
3. Configure Nginx and verify the reverse proxy.
4. Attach IAM roles and register the instance in SSM.
5. Use Session Manager and Run Command.
6. Configure GitHub OIDC and deploy through SSM.
7. Install CloudWatch Agent and create alarms.
8. Rebuild the environment from this runbook on a test instance.
9. Automate the infrastructure with Terraform or AWS CDK.

The best test is to follow this document on a clean test instance and update
it whenever a step is unclear.


