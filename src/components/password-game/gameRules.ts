
import { Rule } from "./types";
import { 
  Hash, 
  ArrowUpToLine, 
  Star, 
  Keyboard, 
  AlignCenter,
  AlignVerticalJustifyCenter,
  AtSign,
  Type,
  CircleDollarSign,
  CircleUser,
  Smile,
  Zap,
  Calculator,
  Medal,
  Clock,
  Languages,
  Dices,
  Music,
  Snowflake,
  HeartPulse,
  Infinity,
  Crown,
  PenTool,
  Feather,
  Bird,
  Key,
  MessageSquare,
  BookOpen,
  FlaskConical,
  X,
  BarChart
} from "lucide-react";

export const gameRules: Rule[] = [
  {
    id: 1,
    title: "Password must be at least 12 characters long",
    description: "Your password needs a minimum of 12 characters to be secure",
    validator: (password) => password.length >= 12,
    isActive: true,
    isCompleted: false,
    icon: Hash,
    score: 50
  },
  {
    id: 2,
    title: "Password must include at least one uppercase letter",
    description: "Add at least one uppercase letter for added security",
    validator: (password) => /[A-Z]/.test(password),
    isActive: false,
    isCompleted: false,
    icon: ArrowUpToLine,
    score: 50
  },
  {
    id: 3,
    title: "Password must include at least one lowercase letter",
    description: "Include at least one lowercase letter in your password",
    validator: (password) => /[a-z]/.test(password),
    isActive: false,
    isCompleted: false,
    icon: AlignCenter,
    score: 50
  },
  {
    id: 4,
    title: "Password must include a number",
    description: "Add at least one number to strengthen your password",
    validator: (password) => /\d/.test(password),
    isActive: false,
    isCompleted: false,
    icon: CircleDollarSign,
    score: 50
  },
  {
    id: 5,
    title: "Password must include a special character",
    description: "Add at least one special character like !@#$%^&*",
    validator: (password) => /[^a-zA-Z0-9\s]/.test(password),
    isActive: false,
    isCompleted: false,
    icon: Star,
    score: 50
  },
  {
    id: 6,
    title: "Password cannot start or end with a number",
    description: "Don't use numbers at the beginning or end of your password",
    validator: (password) => !(/^\d/.test(password) || /\d$/.test(password)),
    isActive: false,
    isCompleted: false,
    icon: X,
    score: 50
  },
  {
    id: 7,
    title: "Password cannot use the same letter twice in a row",
    description: "Avoid repeating the same character consecutively",
    validator: (password) => !/(.)\1/.test(password),
    isActive: false,
    isCompleted: false,
    icon: Keyboard,
    score: 50
  },
  {
    id: 8,
    title: "Password must contain exactly 3 vowels",
    description: "Include exactly three vowels (a, e, i, o, u) in your password",
    validator: (password) => {
      const vowelsCount = (password.match(/[aeiou]/gi) || []).length;
      return vowelsCount === 3;
    },
    isActive: false,
    isCompleted: false,
    icon: AlignVerticalJustifyCenter,
    score: 75
  },
  {
    id: 9,
    title: "Password must include at least one emoji",
    description: "Add at least one emoji character to your password",
    validator: (password) => /[\p{Emoji}]/u.test(password),
    isActive: false,
    isCompleted: false,
    icon: Smile,
    score: 75
  },
  {
    id: 10,
    title: "Must contain at least one number and a special character",
    description: "Combine a number with a special character for better security",
    validator: (password) => /\d/.test(password) && /[^a-zA-Z0-9\s]/.test(password),
    isActive: false,
    isCompleted: false,
    icon: CircleUser,
    score: 50
  },
  {
    id: 11,
    title: "Every third character must be a prime number or a prime letter",
    description: "Every 3rd character should be prime (A=1, B=2, C=3, etc.) or a prime number",
    validator: (password) => {
      const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
      const primeIndexes = [1, 2, 4, 6, 10, 12, 16, 18, 22, 28, 30, 36, 40, 42, 46, 52]; // A=1, B=2, etc. for letters
      
      for (let i = 2; i < password.length; i += 3) {
        const char = password[i];
        if (/[0-9]/.test(char)) {
          const num = parseInt(char, 10);
          if (!primeNumbers.includes(num)) return false;
        } else if (/[a-zA-Z]/.test(char)) {
          const letterValue = char.toLowerCase().charCodeAt(0) - 96;
          if (!primeIndexes.includes(letterValue)) return false;
        } else {
          return false;
        }
      }
      return password.length >= 3; // At least 1 character at position 3
    },
    isActive: false,
    isCompleted: false,
    icon: Calculator,
    score: 100
  },
  {
    id: 12,
    title: "Must include an uppercase and a lowercase letter",
    description: "Mix uppercase and lowercase letters in your password",
    validator: (password) => /[A-Z]/.test(password) && /[a-z]/.test(password),
    isActive: false,
    isCompleted: false,
    icon: Type,
    score: 50
  },
  {
    id: 13,
    title: "No consecutive characters from the same keyboard row",
    description: "Characters should alternate between different keyboard rows",
    validator: (password) => {
      const topRow = new Set("qwertyuiop".split(''));
      const middleRow = new Set("asdfghjkl".split(''));
      const bottomRow = new Set("zxcvbnm".split(''));
      
      for (let i = 1; i < password.length; i++) {
        const prev = password[i-1].toLowerCase();
        const curr = password[i].toLowerCase();
        
        if ((topRow.has(prev) && topRow.has(curr)) || 
            (middleRow.has(prev) && middleRow.has(curr)) || 
            (bottomRow.has(prev) && bottomRow.has(curr))) {
          return false;
        }
      }
      return password.length >= 2;
    },
    isActive: false,
    isCompleted: false,
    icon: Keyboard,
    score: 100
  },
  {
    id: 14,
    title: "Must contain an anagram of 'game'",
    description: "Include all letters of the word 'game' in any order",
    validator: (password) => {
      const lowerPassword = password.toLowerCase();
      return lowerPassword.includes('g') && 
             lowerPassword.includes('a') && 
             lowerPassword.includes('m') && 
             lowerPassword.includes('e');
    },
    isActive: false,
    isCompleted: false,
    icon: Dices,
    score: 75
  },
  {
    id: 15,
    title: "First half must have higher ASCII sum than second half",
    description: "The sum of ASCII values in first half must exceed the second half",
    validator: (password) => {
      if (password.length < 2) return false;
      
      const midpoint = Math.floor(password.length / 2);
      const firstHalf = password.substring(0, midpoint);
      const secondHalf = password.substring(midpoint);
      
      const sumAscii = (str: string) => {
        let sum = 0;
        for (let i = 0; i < str.length; i++) {
          sum += str.charCodeAt(i);
        }
        return sum;
      };
      
      return sumAscii(firstHalf) > sumAscii(secondHalf);
    },
    isActive: false,
    isCompleted: false,
    icon: BarChart,
    score: 100
  },
  {
    id: 16,
    title: "Must include a Roman numeral divisible by 5",
    description: "Include Roman numerals V (5), X (10), XV (15), etc.",
    validator: (password) => {
      return /\bV\b|\bX\b|\bXV\b|\bXX\b|\bXXV\b|\bXXX\b|\bXXXV\b|\bXXXX\b|\bXXXXV\b|\bL\b|\bLV\b|\bLX\b|\bLXV\b|\bLXX\b|\bLXXV\b|\bLXXX\b|\bLXXXV\b|\bXC\b|\bXCV\b|\bC\b/i.test(password);
    },
    isActive: false,
    isCompleted: false,
    icon: Medal,
    score: 75
  },
  {
    id: 17,
    title: "Must include a noble gas chemical symbol",
    description: "Include He (helium), Ne (neon), Ar (argon), Kr (krypton), Xe (xenon), or Rn (radon)",
    validator: (password) => {
      return /He|Ne|Ar|Kr|Xe|Rn/i.test(password);
    },
    isActive: false,
    isCompleted: false,
    icon: FlaskConical,
    score: 75
  },
  {
    id: 18,
    title: "Must include a 3-letter English word, backwards",
    description: "Include a 3-letter word spelled in reverse (e.g., cat → tac)",
    validator: (password) => {
      const commonThreeLetterWords = ['cat', 'dog', 'sun', 'hat', 'pen', 'cup', 'run', 'sit', 'leg', 'arm', 'ear', 'eye', 'car', 'bus', 'map'];
      return commonThreeLetterWords.some(word => {
        const reversed = word.split('').reverse().join('');
        return password.toLowerCase().includes(reversed);
      });
    },
    isActive: false,
    isCompleted: false,
    icon: BookOpen,
    score: 75
  },
  {
    id: 19,
    title: "Must include at least one Fibonacci number",
    description: "Include one of these numbers: 1, 2, 3, 5, 8, 13, 21, 34, 55, 89",
    validator: (password) => {
      const fibNumbers = ["1", "2", "3", "5", "8", "13", "21", "34", "55", "89"];
      return fibNumbers.some(num => password.includes(num));
    },
    isActive: false,
    isCompleted: false,
    icon: Infinity,
    score: 75
  },
  {
    id: 20,
    title: "Must include a vowel and a consonant",
    description: "Include both vowels and consonants for added complexity",
    validator: (password) => /[aeiouAEIOU]/.test(password) && /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/.test(password),
    isActive: false,
    isCompleted: false,
    icon: AtSign,
    score: 50
  },
  {
    id: 21,
    title: "Must include a mathematical operator in a valid equation",
    description: "Include a simple equation like 2+2=4 or 9-3=6",
    validator: (password) => {
      return /\d+[\+\-\*\/]\d+=\d+/.test(password);
    },
    isActive: false,
    isCompleted: false,
    icon: Calculator,
    score: 100
  },
  {
    id: 22,
    title: "Must include a hex color code",
    description: "Include a valid hex color code like #FF5733",
    validator: (password) => {
      return /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/.test(password);
    },
    isActive: false,
    isCompleted: false,
    icon: PenTool,
    score: 75
  },
  {
    id: 23,
    title: "Must include a binary string that converts to a vowel",
    description: "Include binary that translates to a vowel (e.g., 01100001 = 'a')",
    validator: (password) => {
      const binaryVowels = ['01100001', '01100101', '01101001', '01101111', '01110101'];
      return binaryVowels.some(bin => password.includes(bin));
    },
    isActive: false,
    isCompleted: false,
    icon: Languages,
    score: 100
  },
  {
    id: 24,
    title: "Must include the word 'password' scrambled",
    description: "Include the letters p,a,s,s,w,o,r,d in any order",
    validator: (password) => {
      const lowerPassword = password.toLowerCase();
      const required = ['p', 'a', 's', 'w', 'o', 'r', 'd'];
      return required.every(letter => lowerPassword.includes(letter));
    },
    isActive: false,
    isCompleted: false,
    icon: Key,
    score: 75
  },
  {
    id: 25,
    title: "Must contain a chemical equation",
    description: "Include a simple chemical formula like H2O or CO2",
    validator: (password) => {
      return /H2O|CO2|NaCl|O2|N2|CH4|NH3|C6H12O6|H2SO4|HCl/i.test(password);
    },
    isActive: false,
    isCompleted: false,
    icon: FlaskConical,
    score: 75
  }
];
