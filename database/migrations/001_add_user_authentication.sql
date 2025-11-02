-- Migration script for adding user authentication
-- Run this script if you have existing data

-- Step 1: Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT true,
    account_non_expired BOOLEAN NOT NULL DEFAULT true,
    account_non_locked BOOLEAN NOT NULL DEFAULT true,
    credentials_non_expired BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Create a default user (password is 'password123' - bcrypt encoded)
-- Please change this password after first login!
INSERT INTO users (username, email, password, first_name, last_name, role) 
VALUES (
    'admin',
    'admin@todoapp.com',
    '$2a$10$XptfskLsT1l/bRTLRiiCgejHqOpgXFreUnNUa35gJdCr2v2QbVFzu',
    'Admin',
    'User',
    'ADMIN'
) ON CONFLICT (username) DO NOTHING;

-- Step 3: Add user_id column to todos table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='todos' AND column_name='user_id'
    ) THEN
        -- Add user_id column as nullable first
        ALTER TABLE todos ADD COLUMN user_id BIGINT;
        
        -- Set all existing todos to belong to the admin user
        UPDATE todos SET user_id = (SELECT id FROM users WHERE username = 'admin' LIMIT 1);
        
        -- Now make it NOT NULL
        ALTER TABLE todos ALTER COLUMN user_id SET NOT NULL;
        
        -- Add foreign key constraint
        ALTER TABLE todos ADD CONSTRAINT fk_todos_user 
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        
        -- Add index for better query performance
        CREATE INDEX idx_todos_user_id ON todos(user_id);
    END IF;
END $$;

-- Step 4: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_todos_user_completed ON todos(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_todos_user_priority ON todos(user_id, priority);

-- Step 5: Add updated_at trigger for users table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Migration complete!
-- You can now use the authentication endpoints:
-- - POST /api/auth/register - Register new user
-- - POST /api/auth/login - Login (username: admin, password: password123)
-- - GET /api/auth/me - Get current user
-- - PUT /api/auth/me - Update user profile
-- - DELETE /api/auth/me - Delete account
