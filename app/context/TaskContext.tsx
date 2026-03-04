// app/context/TaskContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  userId: string;
  createdAt: string;
  completedAt?: string;
  suggestedCompletionAt: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status' | 'completedAt'> & { status?: 'pending' | 'completed' }) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: string) => void;
  filter: 'all' | 'pending' | 'completed';
  setFilter: (filter: 'all' | 'pending' | 'completed') => void;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load tasks from database when user changes
  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${user.id}`,
        },
      });
      if (response.ok) {
        const tasksData = await response.json();
        // Convert database tasks to our interface format
        const formattedTasks = tasksData.map((task: any) => ({
          id: task.id.toString(),
          title: task.title,
          description: task.description || '',
          status: task.status as 'pending' | 'completed',
          userId: task.user_id.toString(),
          createdAt: task.created_at,
          completedAt: task.status === 'completed' ? task.updated_at : undefined,
          suggestedCompletionAt: task.suggested_completion_at,
        }));
        setTasks(formattedTasks);
      } else {
        console.error('Failed to load tasks:', response.status);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask: TaskContextType['addTask'] = async (task) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: task.status || 'pending',
          priority: 'medium', // Default priority
          suggestedCompletionAt: task.suggestedCompletionAt,
        }),
      });

      if (response.ok) {
        await loadTasks(); // Reload tasks from database
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask: TaskContextType['updateTask'] = async (id, updates) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          title: updates.title !== undefined ? updates.title : undefined,
          description: updates.description !== undefined ? updates.description : undefined,
          status: updates.status !== undefined ? updates.status : undefined,
          priority: 'medium',
          suggestedCompletionAt: updates.suggestedCompletionAt !== undefined ? updates.suggestedCompletionAt : undefined,
        }),
      });

      if (response.ok) {
        await loadTasks(); // Reload tasks from database
      } else {
        const error = await response.json();
        console.error('Update failed:', error);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.id}`,
        },
      });

      if (response.ok) {
        await loadTasks(); // Reload tasks from database
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: tasks.filter(task => 
          filter === 'all' ? true : task.status === filter
        ),
        addTask,
        updateTask,
        deleteTask,
        filter,
        setFilter,
        isLoading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};