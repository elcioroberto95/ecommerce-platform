/**
 * `?redirect=` comes from the URL, so it is attacker-controlled: only allow
 * internal paths. `//evil.com` is a protocol-relative URL, not a local path.
 */
export function safeRedirect(value: string | null, fallback = '/'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback
  }

  return value
}
