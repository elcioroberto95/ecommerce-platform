# Documento de Requisitos

## Objetivo

Desenvolver uma plataforma de e-commerce moderna com foco em aprendizado de arquitetura de software, boas práticas de desenvolvimento, observabilidade, testes, escalabilidade e sistemas distribuídos.

---

# Requisitos Funcionais

## Autenticação

- [x] O usuário poderá criar uma conta.
- [x] O usuário poderá realizar login.
- [x] O usuário poderá atualizar seus dados cadastrais.
- [x] O usuário poderá visualizar seus dados.

## Produtos

- [x] O usuário poderá visualizar a lista de produtos.
- [x] O usuário poderá pesquisar produtos.
- [x] O usuário poderá visualizar os detalhes de um produto.

## Carrinho

- [x] O usuário poderá adicionar produtos ao carrinho.
- [x] O usuário poderá alterar a quantidade de um produto.
- [x] O usuário poderá remover produtos do carrinho.
- [x] O usuário poderá visualizar o valor total da compra.

## Pedido

- [x] O usuário poderá finalizar um pedido.
- [x] O sistema deverá calcular o valor do frete.
- [x] O pedido deverá possuir um status (Pendente, Processando, Finalizado, Cancelado).
- [x] O usuário poderá consultar seus pedidos.

## Administração

- [x] O administrador poderá cadastrar produtos.
- [x] O administrador poderá editar produtos.
- [x] O administrador poderá remover produtos.
- O administrador poderá configurar o valor padrão do frete.
- [x] O administrador poderá visualizar todos os pedidos.
- [x] O administrador poderá alterar o status dos pedidos.

---

# Requisitos Não Funcionais

## Performance

- A listagem de produtos deverá utilizar cache.
- As consultas ao banco deverão utilizar índices quando necessário.
- O sistema deverá minimizar consultas repetidas ao banco.

## Escalabilidade

- O processamento dos pedidos deverá ocorrer de forma assíncrona.
- O sistema deverá suportar a execução de múltiplos workers para processamento de filas.

## Confiabilidade

- O processamento de pedidos deverá ser idempotente.
- Nenhum pedido poderá ser perdido durante falhas temporárias.
- O sistema deverá garantir consistência dos dados durante operações críticas.

## Segurança

- [x] Senhas deverão ser armazenadas utilizando hash.
- [x] As APIs deverão utilizar autenticação JWT.
- [x] Apenas administradores poderão acessar funcionalidades administrativas.
- [x] As entradas deverão ser validadas.

## Observabilidade

- [x] Todas as requisições deverão possuir logs estruturados.
- O sistema deverá possuir métricas de utilização.
- O sistema deverá permitir rastreamento completo das requisições (Tracing).

## Qualidade

- [x] O projeto deverá possuir testes unitários.
- O projeto deverá possuir testes de integração.
- O projeto deverá seguir padrões de Clean Code.
- [x] O projeto deverá utilizar TypeScript.

## DevOps

- [x] O projeto deverá possuir pipeline de CI/CD.
- [x] O ambiente deverá ser executado utilizando Docker.
- [x] O ambiente deverá permitir execução local através do Docker Compose.
- [x] O deploy deverá ser automatizado.

## Operação em produção

- [x] Aplicação publicada em uma instância AWS EC2.
- [x] Elastic IP associado à instância.
- [x] Nginx configurado como reverse proxy.
- [x] Acesso administrativo configurado via AWS Systems Manager.
- [x] IAM configurado para a EC2 e para o GitHub Actions via OIDC.
- [x] Monitoramento de memória, disco e swap configurado no CloudWatch.
- [x] SSH restrito ao IP de administração.
- [ ] HTTPS configurado com domínio e certificado TLS.
- [ ] Backup externo do PostgreSQL automatizado.

---

# Restrições Técnicas

- Backend desenvolvido em Node.js.
- Frontend desenvolvido em React.
- Utilização de TypeScript.
- Banco de dados PostgreSQL.
- Redis para cache.
- Sistema de filas.
- Arquitetura composta por Frontend, BFF e Backend.
- API REST.
- Autenticação JWT.

!image.png
