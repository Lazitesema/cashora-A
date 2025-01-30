-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  date_of_birth DATE,
  address TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  balance DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'send')),
  amount DECIMAL(12, 2) NOT NULL,
  fee DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'failed')),
  recipient TEXT, -- Can be an email or account number
  bank_name TEXT,
  account_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ
);

-- Create banks table
CREATE TABLE IF NOT EXISTS banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_banks table
CREATE TABLE IF NOT EXISTS user_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bank_id UUID REFERENCES banks(id) ON DELETE CASCADE,
  account_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, bank_id, account_number)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_banks_user_id ON user_banks(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users policies
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view banks" ON banks FOR SELECT USING (true);

CREATE POLICY "Users can view their own bank accounts" ON user_banks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bank accounts" ON user_banks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can manage users" ON users USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage transactions" ON transactions USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage banks" ON banks USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage user_banks" ON user_banks USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage notifications" ON notifications USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage emails" ON emails USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage audit_logs" ON audit_logs USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Application can insert notifications
CREATE POLICY "Application can insert notifications" ON notifications FOR INSERT WITH CHECK (true);
-- Seed initial data

-- Insert initial banks
INSERT INTO banks (name, code) VALUES
('Commercial Bank of Ethiopia', 'CBE'),
('Awash Bank', 'AWB'),
('Dashen Bank', 'DSB'),
('Bank of Abyssinia', 'BOA')
ON CONFLICT (code) DO NOTHING;

-- Insert email template
INSERT INTO emails (name, subject, body) VALUES (
    'Welcome Email',
    'Welcome to Cashora!',
    'Dear {{user_name}},<br><br>Welcome to Cashora! We are excited to have you on board.<br><br>Best,<br>The Cashora Team'
);

-- Insert test user (John Doe)
INSERT INTO users (first_name, last_name, email, phone_number, date_of_birth, address, balance, role, status)
VALUES ('John', 'Doe', 'john.doe@example.com', '+251911234567', '1990-01-01', 'Addis Ababa, Ethiopia', 1000.00, 'user', 'approved')
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Insert test admin user
INSERT INTO users (first_name, last_name, email, phone_number, date_of_birth, address, role, status)
VALUES ('Admin', 'User', 'admin@example.com', '+251911000000', '1985-01-01', 'Addis Ababa, Ethiopia', 'admin', 'approved')
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Insert sample transactions for John Doe
WITH user_id AS (SELECT id FROM users WHERE email = 'john.doe@example.com' LIMIT 1)
INSERT INTO transactions (user_id, type, amount, fee, status, recipient)
SELECT
    user_id.id,
    unnest(ARRAY['deposit', 'withdrawal', 'send']) AS type,
    unnest(ARRAY[500.00, -200.00, -100.00]) AS amount,
    unnest(ARRAY[0, 4.00, 2.00]) AS fee,
    'completed' AS status,
    CASE WHEN unnest(ARRAY['deposit', 'withdrawal', 'send']) = 'send' THEN 'jane.doe@example.com' ELSE NULL END AS recipient
FROM user_id;

-- Insert a sample user bank account
WITH user_id AS (SELECT id FROM users WHERE email = 'john.doe@example.com' LIMIT 1),
     bank_id AS (SELECT id FROM banks WHERE code = 'CBE' LIMIT 1)
INSERT INTO user_banks (user_id, bank_id, account_number)
SELECT user_id.id, bank_id.id, '1234567890'
FROM user_id, bank_id
ON CONFLICT DO NOTHING;

-- Insert a sample notification
WITH user_id AS (SELECT id FROM users WHERE email = 'john.doe@example.com' LIMIT 1)
INSERT INTO notifications (user_id, message)
SELECT user_id.id, 'Welcome to Cashora! Your account has been created successfully.'
FROM user_id;