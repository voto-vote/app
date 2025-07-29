export function abbreviateName(fullName: string): string {
  const parts = fullName.trim().split(" ");

  if (parts.length <= 1) {
    return fullName; // Return as is if there's no last name
  }

  const firstName = parts[0];
  const lastNames = parts.slice(1).join(" ");

  return `${firstName.charAt(0).toUpperCase()}. ${lastNames}`;
}
