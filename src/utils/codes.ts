import { User } from '@/src/types';

export const generateUniqueUserCode = (existingUsers: User[]): string => {
  let code = '';
  const existingCodes = new Set(existingUsers.map((u) => u.code));
  do {
    code = Math.floor(10000000 + Math.random() * 90000000).toString();
  } while (existingCodes.has(code));
  return code;
};

export const generateCouponCode = () => {
  const alpha = Math.random().toString(36).slice(2, 6).toUpperCase();
  const numeric = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `SH-${alpha}-${numeric}`;
};
