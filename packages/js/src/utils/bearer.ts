export function normalizeBearerToken(token: string) {
  const trimmedToken = token.trim()
  if (trimmedToken.startsWith('Bearer')) {
    return trimmedToken
  }

  if (trimmedToken.startsWith('bearer')) {
    return trimmedToken
  }

  return `Bearer ${trimmedToken}`
}
