-- Add priority column to complaints table
USE students;

-- Add priority column if it doesn't exist
ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS priority ENUM('low', 'medium', 'high') DEFAULT 'medium' 
AFTER category;

-- Update existing records to have default priority
UPDATE complaints SET priority = 'medium' WHERE priority IS NULL;
