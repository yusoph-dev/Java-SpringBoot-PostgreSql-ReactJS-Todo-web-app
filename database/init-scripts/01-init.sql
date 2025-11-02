-- Database initialization script
-- This script runs automatically when the PostgreSQL container starts for the first time

-- Ensure the database exists (though it should be created via POSTGRES_DB)
SELECT 'CREATE DATABASE todoapp'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'todoapp')\gexec

-- Connect to the todoapp database
\c todoapp;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for better performance (optional - Hibernate will create the table)
-- These will be created after Hibernate initializes the schema