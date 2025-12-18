export interface ServiceConfig {
  name: string;
  url: string;
  healthCheck: string;
}

export const services: Record<string, ServiceConfig> = {
  telehealth: {
    name: 'Telehealth Service',
    url: process.env.TELEHEALTH_SERVICE_URL || 'http://localhost:3001',
    healthCheck: '/health',
  },
  mentalHealth: {
    name: 'Mental Health Service',
    url: process.env.MENTAL_HEALTH_SERVICE_URL || 'http://localhost:3002',
    healthCheck: '/health',
  },
  chronicCare: {
    name: 'Chronic Care Service',
    url: process.env.CHRONIC_CARE_SERVICE_URL || 'http://localhost:3003',
    healthCheck: '/health',
  },
  pharmacy: {
    name: 'Pharmacy Service',
    url: process.env.PHARMACY_SERVICE_URL || 'http://localhost:3004',
    healthCheck: '/health',
  },
  laboratory: {
    name: 'Laboratory Service',
    url: process.env.LABORATORY_SERVICE_URL || 'http://localhost:3005',
    healthCheck: '/health',
  },
};

export const getServiceUrl = (serviceName: keyof typeof services): string => {
  const service = services[serviceName];
  if (!service) {
    throw new Error(`Service ${serviceName} not found`);
  }
  return service.url;
};
