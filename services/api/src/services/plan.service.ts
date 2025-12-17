// Static plans data - in production, fetch from database
const plans = [
  {
    id: 'basic-health-access',
    name: 'Basic Health Access',
    description: 'Virtual GP visits, digital records, scheduling, symptom checker',
    price: 19,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Virtual GP consultations',
      'Digital health records',
      'Appointment scheduling',
      'Symptom checker',
    ],
  },
  {
    id: 'preventive-wellness',
    name: 'Preventive & Wellness',
    description: 'Wellness coaching, wearable integration, health risk assessments',
    price: 29,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'All Basic features',
      'Wellness coaching',
      'Wearable integration',
      'Health risk assessments',
      'Personalized wellness plans',
    ],
  },
  {
    id: 'mental-health-therapy',
    name: 'Mental Health & Therapy',
    description: 'Licensed therapy, psychiatry, crisis support, mindfulness',
    price: 39,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Licensed therapy sessions',
      'Psychiatry consultations',
      '24/7 crisis support',
      'Mindfulness programs',
      'CBT modules',
    ],
  },
  {
    id: 'chronic-care-management',
    name: 'Chronic Care Management',
    description: 'Condition monitoring, RPM devices, care coordination',
    price: 49,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Remote patient monitoring',
      'Care coordinator',
      'Medication adherence tools',
      'Device integration',
      'Personalized care plans',
    ],
  },
  {
    id: 'premium-concierge',
    name: 'Premium Concierge',
    description: 'Unlimited access, 24/7 VIP support, dedicated health concierge',
    price: 199,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'All platform features',
      'Unlimited consultations',
      '24/7 VIP support',
      'Dedicated health concierge',
      'Priority scheduling',
      'Second opinion services',
    ],
  },
];

// Currency conversion rates (simplified)
const currencyRates: Record<string, number> = {
  USD: 1,
  GBP: 0.79,
  EUR: 0.92,
  NGN: 1550,
  KES: 155,
  ZAR: 18.5,
};

export const planService = {
  /**
   * List all available plans
   */
  async listPlans(options: { region?: string; currency?: string }): Promise<any[]> {
    const currency = options.currency || 'USD';
    const rate = currencyRates[currency] || 1;

    return plans.map(plan => ({
      ...plan,
      price: Math.round(plan.price * rate * 100) / 100,
      currency,
    }));
  },
};
