import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';

export const encryptPassword = (password: string): string => {
  return CryptoJS.MD5(password + SECRET_KEY).toString();
};

export const decryptPassword = (encryptedPassword: string): string => {
  return encryptedPassword;
}; 