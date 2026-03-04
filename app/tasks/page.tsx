// app/tasks/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import TaskList from '../components/TaskList';
import { useState, useEffect } from 'react';

export default function TasksPage() {
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();

  const { filter, setFilter, addTask } = useTasks();
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [suggestedDate, setSuggestedDate] = useState('');
  const [suggestedTime, setSuggestedTime] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && suggestedDate && suggestedTime) {
      const localDate = new Date(`${suggestedDate}T${suggestedTime}`);
      const suggestedCompletionAt = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
      addTask({
        title: title.trim(),
        description: description.trim(),
        suggestedCompletionAt,
        userId: user.id,
        status: 'pending',
      });
      setTitle('');
      setDescription('');
      setSuggestedDate('');
      setSuggestedTime('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="!w-32 !h-8 !min-h-0 !px-4 !py-1.5 !text-sm !leading-snug !font-medium !rounded-md !bg-blue-600 !text-white hover:!bg-blue-700 !transition-colors !border-0 !shadow-sm"
          >
            Add New Task
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
            className="!w-28 !h-8 !text-sm !px-3 !py-1 !rounded-md !border !border-slate-200 dark:!border-slate-700 !bg-white dark:!bg-slate-800 !text-slate-900 dark:!text-white focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 max-w-2xl">
            <h3 className="text-base font-medium mb-3">Add New Task</h3>
            <div className="card py-4 px-5 max-w-sm mx-auto">
              <form onSubmit={handleAddTask} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="w-full sm:w-32 px-2.5 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                    rows={2}
                    className="w-full sm:w-32 px-2.5 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Completion day
                    </label>
                    <input
                      type="date"
                      value={suggestedDate}
                      onChange={(e) => setSuggestedDate(e.target.value)}
                      className="w-full sm:w-32 px-2.5 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Completion time
                    </label>
                    <input
                      type="time"
                      value={suggestedTime}
                      onChange={(e) => setSuggestedTime(e.target.value)}
                      className="w-full sm:w-32 px-2.5 py-1.5 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-1.5 py-0.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-1.5 py-0.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <TaskList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}