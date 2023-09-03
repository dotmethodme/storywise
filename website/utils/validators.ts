export function isAppNameValid(text: string): boolean {
  const blacklist = [
    "admin",
    "api",
    "app",
    "auth",
    "auth0",
    "backend",
    "beta",
    "blog",
    "cdn",
    "cms",
    "community",
    "contact",
    "dashboard",
    "prisma",
    "supreme",
  ];
  const maxLength = 15;
  const minLength = 3;

  const allowedCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

  if (text.length < minLength) {
    return false;
  }

  if (text.length > maxLength) {
    return false;
  }

  if (blacklist.includes(text)) {
    return false;
  }

  for (let i = 0; i < text.length; i++) {
    if (!allowedCharacters.includes(text[i])) {
      return false;
    }
  }

  return true;
}

export function isUsernameValid(text: string) {
  const maxLength = 15;
  const minLength = 3;

  const allowedCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

  if (text.length < minLength) {
    return false;
  }

  if (text.length > maxLength) {
    return false;
  }

  for (let i = 0; i < text.length; i++) {
    if (!allowedCharacters.includes(text[i])) {
      return false;
    }
  }

  return true;
}
