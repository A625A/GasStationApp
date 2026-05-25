export type Language = 'en' | 'es';

export interface User {
  id: string;
  username: string;
  email: string;
  language: Language;
  points: number;
  code: string;
  password?: string;
  profilePicture?: string;
  token?: string | null;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  expiration: string;
}

export interface Coupon {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
}
