export function generatePassword(length: number): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charsetLength = charset.length;
  const randomBytes = new Uint8Array(length);

  // Generate cryptographically secure random values
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(randomBytes);
  } else {
    throw new Error("Browser does not support crypto.getRandomValues().");
  }

  let password = "";
  for (let i = 0; i < randomBytes.length; i++) {
    const randomIndex = randomBytes[i] % charsetLength;
    password += charset[randomIndex];
  }

  return password;
}
