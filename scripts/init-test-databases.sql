-- ============================================
-- UnifiedHealth Platform - Test Database Initialization
-- Creates multiple databases for service-level integration tests
-- ============================================

-- Create additional test databases for each service
CREATE DATABASE auth_test;
CREATE DATABASE notification_test;
CREATE DATABASE pharmacy_test;
CREATE DATABASE imaging_test;
CREATE DATABASE telehealth_test;
CREATE DATABASE chronic_care_test;
CREATE DATABASE mental_health_test;
CREATE DATABASE laboratory_test;

-- Grant permissions to test user
GRANT ALL PRIVILEGES ON DATABASE auth_test TO test_user;
GRANT ALL PRIVILEGES ON DATABASE notification_test TO test_user;
GRANT ALL PRIVILEGES ON DATABASE pharmacy_test TO test_user;
GRANT ALL PRIVILEGES ON DATABASE imaging_test TO test_user;
GRANT ALL PRIVILEGES ON DATABASE telehealth_test TO test_user;
GRANT ALL PRIVILEGES ON DATABASE chronic_care_test TO test_user;
GRANT ALL PRIVILEGES ON DATABASE mental_health_test TO test_user;
GRANT ALL PRIVILEGES ON DATABASE laboratory_test TO test_user;

-- Create extensions in each database
\c unified_health_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c auth_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\c notification_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c pharmacy_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c imaging_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c telehealth_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c chronic_care_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c mental_health_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c laboratory_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
