/*
  # Add default accounts

  1. Changes
    - Add default accounts for new users when they register
    - Create a trigger function to automatically create default accounts
    - Add trigger to users table

  2. Default Accounts
    - Asset: Cash (현금)
    - Liability: Credit Card (신용카드)
    - Equity: Initial Capital (기초자본)
    - Revenue: Salary (급여)
    - Expense: Utilities (공과금)
*/

-- Create function to add default accounts
CREATE OR REPLACE FUNCTION add_default_accounts()
RETURNS TRIGGER AS $$
BEGIN
  -- Asset: Cash
  INSERT INTO accounts (id, user_id, name, type, balance, currency)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    CASE WHEN current_setting('request.headers')::json->>'accept-language' LIKE 'ko%'
      THEN '현금'
      ELSE 'Cash'
    END,
    'asset',
    0,
    'USD'
  );

  -- Liability: Credit Card
  INSERT INTO accounts (id, user_id, name, type, balance, currency)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    CASE WHEN current_setting('request.headers')::json->>'accept-language' LIKE 'ko%'
      THEN '신용카드'
      ELSE 'Credit Card'
    END,
    'liability',
    0,
    'USD'
  );

  -- Equity: Initial Capital
  INSERT INTO accounts (id, user_id, name, type, balance, currency)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    CASE WHEN current_setting('request.headers')::json->>'accept-language' LIKE 'ko%'
      THEN '기초자본'
      ELSE 'Initial Capital'
    END,
    'equity',
    0,
    'USD'
  );

  -- Revenue: Salary
  INSERT INTO accounts (id, user_id, name, type, balance, currency)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    CASE WHEN current_setting('request.headers')::json->>'accept-language' LIKE 'ko%'
      THEN '급여'
      ELSE 'Salary'
    END,
    'revenue',
    0,
    'USD'
  );

  -- Expense: Utilities
  INSERT INTO accounts (id, user_id, name, type, balance, currency)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    CASE WHEN current_setting('request.headers')::json->>'accept-language' LIKE 'ko%'
      THEN '공과금'
      ELSE 'Utilities'
    END,
    'expense',
    0,
    'USD'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on users table
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_user_created_add_default_accounts'
  ) THEN
    CREATE TRIGGER on_user_created_add_default_accounts
      AFTER INSERT ON users
      FOR EACH ROW
      EXECUTE FUNCTION add_default_accounts();
  END IF;
END $$;