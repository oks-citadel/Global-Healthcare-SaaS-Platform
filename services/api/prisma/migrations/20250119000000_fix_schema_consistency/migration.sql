-- Migration: Fix Schema Consistency Issues
-- Date: 2025-01-19
-- Description: Adds super_admin role and renames password to passwordHash for consistency

-- Add super_admin to Role enum
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'super_admin';

-- Rename password column to passwordHash for consistency with auth-service
-- This aligns with the Prisma schema which uses passwordHash
ALTER TABLE "User" RENAME COLUMN "password" TO "passwordHash";

-- Add comment for documentation
COMMENT ON COLUMN "User"."passwordHash" IS 'Bcrypt hashed password - never store plaintext';
