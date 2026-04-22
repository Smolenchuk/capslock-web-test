export const invalidZips: string[] = [
  "0", // Too short (1 digit)
  "12", // Too short (2 digits)
  "123", // Too short (3 digits)
  "1234", // Too short (4 digits)
  "123456", // Too long (6 digits)
  "1234567", // Too long (7 digits)
  "ABCDE", // All letters
  "ABC12", // Mix of letters and numbers
  "12 34", // Space in ZIP
  " 12345", // Leading space
  "12345 ", // Trailing space
  "!@#$%", // Special characters only
  "!@#$%^&*()|:<>`?]|", // Mixed special characters
  "12345!", // Number with special character
  "-1234", // Negative number
  "+1234", // Plus sign
  "00000", // All zeros
  "", // Empty string
  "   ", // Only spaces
  "123.45", // Decimal format
  "12,345", // Comma separator
  "12-345", // Hyphen separator
  "\t12345", // Tab character
  "NULL", // SQL keyword
  "undefined", // JavaScript keyword
];
