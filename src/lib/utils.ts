
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function scrollToElement(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Animation utility for staggered animations
export function getStaggeredAnimation(index: number, base = 0.1) {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        delay: base + (index * 0.1)
      }
    }
  };
}

/**
 * Generates a random password based on specified criteria
 * @param length Password length
 * @param includeUppercase Include uppercase letters
 * @param includeLowercase Include lowercase letters
 * @param includeNumbers Include numbers
 * @param includeSymbols Include special symbols
 * @returns A randomly generated password string
 */
export function generateRandomPassword(
  length: number = 12,
  includeUppercase: boolean = true,
  includeLowercase: boolean = true,
  includeNumbers: boolean = true,
  includeSymbols: boolean = true
): string {
  let charset = "";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  if (includeLowercase) charset += lowercase;
  if (includeUppercase) charset += uppercase;
  if (includeNumbers) charset += numbers;
  if (includeSymbols) charset += symbols;

  // Default to lowercase if nothing is selected
  if (charset === "") charset = lowercase;

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}
