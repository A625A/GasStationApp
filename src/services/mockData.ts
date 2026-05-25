import { Coupon, Promotion } from '@/src/types';

export const promotions: Promotion[] = [
  {
    id: 'promo-1',
    title: 'V-Power boost',
    description: 'Double points when you fill up with Shell V-Power this week.',
    pointsRequired: 0,
    expiration: '2025-03-12',
  },
  {
    id: 'promo-2',
    title: 'Car wash combo',
    description: '20% off premium wash when redeemed with your Shell code.',
    pointsRequired: 300,
    expiration: '2025-04-05',
  },
  {
    id: 'promo-3',
    title: 'Snacks for the road',
    description: 'Redeem for a snack pack and drink bundle.',
    pointsRequired: 450,
    expiration: '2025-03-28',
  },
  {
    id: 'promo-4',
    title: 'Family trip',
    description: 'Save on your next fuel stop when traveling with family.',
    pointsRequired: 900,
    expiration: '2025-05-02',
  },
];

export const coupons: Coupon[] = [
  {
    id: 'coupon-1',
    title: 'Fresh coffee',
    description: 'A hot coffee of your choice.',
    pointsRequired: 150,
  },
  {
    id: 'coupon-2',
    title: 'Premium car wash',
    description: 'Keep your car spotless with our deluxe wash.',
    pointsRequired: 600,
  },
  {
    id: 'coupon-3',
    title: 'Fuel discount',
    description: '$5 off your next fuel purchase.',
    pointsRequired: 900,
  },
  {
    id: 'coupon-4',
    title: 'Road trip snacks',
    description: 'Redeem for snacks and drinks bundle.',
    pointsRequired: 400,
  },
];
