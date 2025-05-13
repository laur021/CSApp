export function generateTransactionId(type: "email" | "phone"): string {
  const prefix = type === "email" ? "JXFE" : "JXFP";
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
  const day = String(now.getDate()).padStart(2, "0"); // Ensure 2 digits

  const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase(); // Random 3-letter string
  const randomNum = Math.floor(10 + Math.random() * 90); // Random 2-digit number

  return `${prefix}${year}${day}${month}${randomStr}${randomNum}`;
}
