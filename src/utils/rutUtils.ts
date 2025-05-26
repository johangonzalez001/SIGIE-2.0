// Utility functions for Chilean RUT handling
export const calculateVerificationDigit = (rut: string): string => {
  const cleanRut = rut.replace(/\D/g, '');
  if (cleanRut.length === 0) return '';
  
  const rutDigits = cleanRut.split('').map(Number).reverse();
  let sum = 0;
  let multiplier = 2;
  
  for (const digit of rutDigits) {
    sum += digit * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const verificationDigit = 11 - remainder;
  
  if (verificationDigit === 11) return '0';
  if (verificationDigit === 10) return 'K';
  return verificationDigit.toString();
};

export const formatRut = (rut: string): string => {
  let cleanRut = rut.replace(/[^\dkK]/g, '').toUpperCase();
  if (cleanRut.length <= 1) return cleanRut;
  
  // Separate verification digit
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);
  
  // Add thousands separators
  let formatted = '';
  for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) formatted = '.' + formatted;
    formatted = body[i] + formatted;
  }
  
  return `${formatted}-${dv}`;
};

export const validateRut = (rut: string): boolean => {
  const cleanRut = rut.replace(/[^\dkK]/g, '').toUpperCase();
  if (!/^\d{7,8}[0-9K]$/i.test(cleanRut)) return false;
  
  const digits = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);
  const calculated = calculateVerificationDigit(digits);
  
  return dv === calculated;
};

export const cleanRutInput = (rut: string): string => {
  return rut.replace(/[^\dkK]/g, '').toUpperCase();
};