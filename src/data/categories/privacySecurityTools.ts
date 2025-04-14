
import { 
  Shield, 
  FileX, 
  Lock, 
  Hash, 
  Key, 
  FileText, 
  Binary, 
  Fingerprint,
  Code,
  FileCode
} from "lucide-react";

export const privacySecurityTools = {
  title: "Privacy & Security",
  tools: [
    {
      icon: Lock,
      title: "Encryption Playground",
      description: "Encrypt, decrypt text, generate passwords and keys.",
      slug: "encryption-playground"
    },
    {
      icon: Key,
      title: "Password Security Suite",
      description: "Generate, test, and analyze the strength of passwords.",
      slug: "password-security"
    },
    {
      icon: Key,
      title: "Password Game",
      description: "A fun game to test your password creation skills.",
      slug: "password-game"
    },
    {
      icon: FileX,
      title: "Metadata Viewer & Remover",
      description: "View and strip sensitive metadata from files.",
      slug: "metadata-remover"
    },
    {
      icon: Hash,
      title: "Hash Generator",
      description: "Generate cryptographic hashes from text or files.",
      slug: "hash-generator"
    },
    {
      icon: FileText,
      title: "Private Notes",
      description: "Write and store encrypted notes in your browser.",
      slug: "private-notes"
    },
    {
      icon: Binary,
      title: "JWT Decoder",
      description: "Decode and inspect JSON Web Tokens.",
      slug: "jwt-decoder"
    },
    {
      icon: Fingerprint,
      title: "UUID Generator",
      description: "Generate random UUIDs (Universally Unique Identifiers).",
      slug: "uuid-generator"
    },
    {
      icon: FileCode,
      title: "Code Obfuscator",
      description: "Obfuscate your code to make it harder to read and understand.",
      slug: "code-obfuscator",
      isNew: true
    }
  ],
};
