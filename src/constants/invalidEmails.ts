export const invalidEmails: string[] = [
  "notanemail", // No @ symbol
  "user@", // Missing domain
  "@example.com", // Missing local part
  "user@@example.com", // Double @
  "user@example", // Missing TLD
  "user@.com", // Missing domain name
  "user @example.com", // Space in local part
  "user@exam ple.com", // Space in domain
  "user..name@example.com", // Consecutive dots
  ".user@example.com", // Starting with dot
  "user.@example.com", // Ending with dot in local part
  "user@example..com", // Consecutive dots in domain
  "plainaddress", // No domain separator
  "user@", // Incomplete
  "user@localhost", // No TLD (depending on validator)
];
