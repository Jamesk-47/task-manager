import pool from './db';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  user_id: number;
  created_at: Date;
  updated_at: Date;
  suggested_completion_at?: Date;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  suggestedCompletionAt?: string;
  user_id: number;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  suggestedCompletionAt?: string;
}

export class TaskService {
  static async createTask(data: CreateTaskData): Promise<Task> {
    const query = `
      INSERT INTO tasks (title, description, status, priority, suggested_completion_at, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      data.title,
      data.description || null,
      data.status || 'pending',
      data.priority || 'medium',
      data.suggestedCompletionAt || null,
      data.user_id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getTasksByUserId(userId: number): Promise<Task[]> {
    const query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getTaskById(id: number, userId: number): Promise<Task | null> {
    const query = 'SELECT * FROM tasks WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return result.rows[0] || null;
  }

  static async updateTask(id: number, userId: number, data: UpdateTaskData): Promise<Task | null> {
    console.log('Updating task:', { id, userId, data });
    
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }
    if (data.priority !== undefined) {
      fields.push(`priority = $${paramIndex++}`);
      values.push(data.priority);
    }
    if (data.suggestedCompletionAt !== undefined) {
      fields.push(`suggested_completion_at = $${paramIndex++}`);
      values.push(data.suggestedCompletionAt);
    }
    
    // Always update the modified timestamp
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add id and userId to values array - ensure they are numbers
    values.push(Number(id), Number(userId));
    
    // Calculate the final parameter indices
    const idParam = paramIndex;
    const userIdParam = paramIndex + 1;

    const query = `
      UPDATE tasks 
      SET ${fields.join(', ')}
      WHERE id = $${idParam} AND user_id = $${userIdParam}
      RETURNING *
    `;

    console.log('Query:', query);
    console.log('Values:', values);

    try {
      const result = await pool.query(query, values);
      console.log('Result:', result.rows[0]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  static async deleteTask(id: number, userId: number): Promise<boolean> {
    const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return (result.rowCount || 0) > 0;
  }
}
