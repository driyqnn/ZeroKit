
import CryptoJS from 'crypto-js';

/**
 * Encrypts text content using AES encryption
 * 
 * @param content - Content to encrypt
 * @param password - Password to use for encryption
 * @returns Encrypted string
 */
export const encrypt = async (content: string, password: string): Promise<string> => {
  return CryptoJS.AES.encrypt(content, password).toString();
};

/**
 * Decrypts encrypted content using AES decryption
 * 
 * @param encryptedContent - Encrypted content to decrypt
 * @param password - Password used for decryption
 * @returns Decrypted string or null if decryption fails
 */
export const decrypt = async (encryptedContent: string, password: string): Promise<string | null> => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, password);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    
    // If decryption results in empty string, it likely failed
    if (!decryptedText) {
      return null;
    }
    
    return decryptedText;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};
