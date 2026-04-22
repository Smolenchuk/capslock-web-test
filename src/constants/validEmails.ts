export const validEmails: string[] = [
  "user@example.com", // Standard email
  "john.doe@example.com", // Email with dot in local part
  "user+tag@example.com", // Email with plus sign
  "test_email@example.co.uk", // Email with underscore and multi-level domain
  "contact@subdomain.example.com", // Email with subdomain
  "info123@company.org", // Email with numbers
  "a@example.com", // Single character local part
  "user@example-domain.com", // Domain with hyphen
  "first.last@example.info", // Multiple dots in local part
  "support@example.museum", // Less common TLD
];
