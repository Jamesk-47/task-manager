-- Add suggested_completion_at column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS suggested_completion_at TIMESTAMP;

-- Update existing tasks to use updated_at as suggested_completion_at for backward compatibility
UPDATE tasks SET suggested_completion_at = updated_at WHERE suggested_completion_at IS NULL;

-- Show the updated table structure
\d tasks;
