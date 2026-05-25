import { promotions as mockPromotions } from '@/src/services/mockData';
import { Promotion } from '@/src/types';

export const getPromotions = async (): Promise<Promotion[]> => {
  // Placeholder for backend fetch; using mock data for now.
  return mockPromotions;
};
