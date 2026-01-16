/**
 * Demo Store - In-memory data store for demo/testing mode
 *
 * This allows the application to run without a database for demonstration purposes.
 * DO NOT USE IN PRODUCTION
 */

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Check if demo mode is enabled
export const isDemoMode = process.env.DEMO_MODE === 'true';

// Demo user interface
interface DemoUser {
  id: string;
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  role: string;
  phone: string | null;
  status: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DemoRefreshToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
}

// In-memory stores
const users: Map<string, DemoUser> = new Map();
const refreshTokens: Map<string, DemoRefreshToken> = new Map();

// Initialize demo users with test credentials
async function initializeDemoUsers() {
  const hashedPassword = await bcrypt.hash('Test123!', 12);

  // Demo Patient
  const patient: DemoUser = {
    id: 'demo-patient-001',
    email: 'patient@demo.com',
    password: hashedPassword,
    firstName: 'John',
    lastName: 'Patient',
    role: 'patient',
    phone: '+1234567890',
    status: 'active',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  users.set(patient.email, patient);

  // Demo Doctor
  const doctor: DemoUser = {
    id: 'demo-doctor-001',
    email: 'doctor@demo.com',
    password: hashedPassword,
    firstName: 'Sarah',
    lastName: 'Doctor',
    role: 'doctor',
    phone: '+1234567891',
    status: 'active',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  users.set(doctor.email, doctor);

  // Demo Admin
  const admin: DemoUser = {
    id: 'demo-admin-001',
    email: 'admin@demo.com',
    password: hashedPassword,
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: '+1234567892',
    status: 'active',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  users.set(admin.email, admin);
}

// Initialize on load
if (isDemoMode) {
  initializeDemoUsers();
}

// Demo store operations
export const demoStore = {
  // User operations
  users: {
    findByEmail: (email: string): DemoUser | undefined => {
      return users.get(email);
    },
    findById: (id: string): DemoUser | undefined => {
      for (const user of users.values()) {
        if (user.id === id) return user;
      }
      return undefined;
    },
    create: async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
      role?: string;
    }): Promise<DemoUser> => {
      const hashedPassword = await bcrypt.hash(data.password, 12);
      const user: DemoUser = {
        id: uuidv4(),
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'patient',
        phone: data.phone || null,
        status: 'active',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.set(user.email, user);
      return user;
    },
    update: (id: string, data: Partial<DemoUser>): DemoUser | undefined => {
      for (const [email, user] of users.entries()) {
        if (user.id === id) {
          const updated = { ...user, ...data, updatedAt: new Date() };
          users.set(email, updated);
          return updated;
        }
      }
      return undefined;
    },
  },

  // Refresh token operations
  refreshTokens: {
    create: (data: { token: string; userId: string; expiresAt: Date }): DemoRefreshToken => {
      const tokenRecord: DemoRefreshToken = {
        id: uuidv4(),
        ...data,
      };
      refreshTokens.set(data.token, tokenRecord);
      return tokenRecord;
    },
    findByToken: (token: string): (DemoRefreshToken & { user?: DemoUser }) | undefined => {
      const tokenRecord = refreshTokens.get(token);
      if (!tokenRecord) return undefined;
      const user = demoStore.users.findById(tokenRecord.userId);
      return { ...tokenRecord, user };
    },
    delete: (token: string): void => {
      refreshTokens.delete(token);
    },
    deleteByUserId: (userId: string): void => {
      for (const [token, record] of refreshTokens.entries()) {
        if (record.userId === userId) {
          refreshTokens.delete(token);
        }
      }
    },
  },
};

// Export demo credentials for documentation
export const demoCredentials = {
  patient: {
    email: 'patient@demo.com',
    password: 'Test123!',
    role: 'patient',
  },
  doctor: {
    email: 'doctor@demo.com',
    password: 'Test123!',
    role: 'doctor',
  },
  admin: {
    email: 'admin@demo.com',
    password: 'Test123!',
    role: 'admin',
  },
};
