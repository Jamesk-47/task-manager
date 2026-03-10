// app/components/TaskForm.tsx
'use client';

import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [suggestedDate, setSuggestedDate] = useState('');
  const [suggestedTime, setSuggestedTime] = useState('');
  const { addTask } = useTasks();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !suggestedDate || !suggestedTime) return;
    const suggestedCompletionAt = new Date(`${suggestedDate}T${suggestedTime}`).toISOString();
    addTask({
      title: title.trim(),
      description: description.trim(),
      suggestedCompletionAt,
      userId: user?.id ?? 'local-user',
      status: 'pending',
    });
    setTitle('');
    setDescription('');
    setSuggestedDate('');
    setSuggestedTime('');
  };

  return (
    <div className="w-full max-w-lg mx-auto px-2">
      <div className="mb-3">
        <h2 className="text-sm font-medium text-foreground">Add New Task</h2>
      </div>
      <div className="card py-4 px-4 sm:px-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-foreground/80 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="w-full px-2.5 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-foreground/80 mb-1">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={2}
                className="w-full px-2.5 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-foreground/80 mb-1">Suggested completion day</label>
              <input
                type="date"
                value={suggestedDate}
                onChange={(e) => setSuggestedDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-foreground/80 mb-1">Suggested completion time</label>
              <input
                type="time"
                value={suggestedTime}
                onChange={(e) => setSuggestedTime(e.target.value)}
                className="w-full px-2.5 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}