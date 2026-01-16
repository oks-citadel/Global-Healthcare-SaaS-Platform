-- Database Initialization Script
-- Global SaaS Marketing Platform

-- Create databases for each service
CREATE DATABASE IF NOT EXISTS seo_service;
CREATE DATABASE IF NOT EXISTS content_service;
CREATE DATABASE IF NOT EXISTS analytics_service;
CREATE DATABASE IF NOT EXISTS personalization_service;
CREATE DATABASE IF NOT EXISTS lifecycle_service;
CREATE DATABASE IF NOT EXISTS growth_service;
CREATE DATABASE IF NOT EXISTS commerce_service;
CREATE DATABASE IF NOT EXISTS reputation_service;
CREATE DATABASE IF NOT EXISTS localization_service;
CREATE DATABASE IF NOT EXISTS ai_service;
CREATE DATABASE IF NOT EXISTS community_service;

-- Grant privileges to postgres user
GRANT ALL PRIVILEGES ON DATABASE seo_service TO postgres;
GRANT ALL PRIVILEGES ON DATABASE content_service TO postgres;
GRANT ALL PRIVILEGES ON DATABASE analytics_service TO postgres;
GRANT ALL PRIVILEGES ON DATABASE personalization_service TO postgres;
GRANT ALL PRIVILEGES ON DATABASE lifecycle_service TO postgres;
GRANT ALL PRIVILEGES ON DATABASE growth_service TO postgres;
GRANT ALL PRIVILEGES ON DATABASE commerce_service TO postgres;
GRANT ALL PRIVILEGES ON DATABASE reputation_service TO postgres;
GRANT ALL PRIVILEGES ON DATABASE localization_service TO postgres;
GRANT ALL PRIVILEGES ON DATABASE ai_service TO postgres;
GRANT ALL PRIVILEGES ON DATABASE community_service TO postgres;

-- Enable required extensions in main database
\c marketing;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Log initialization complete
DO $$
BEGIN
  RAISE NOTICE 'Database initialization complete for Global SaaS Marketing Platform';
END $$;
