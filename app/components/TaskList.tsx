'use client';

import { useState } from 'react';
import { useTasks } from '../context/TaskContext';

export default function TaskList() {
  const { tasks, updateTask, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ 
    title: '', 
    description: '',
    suggestedDate: '',
    suggestedTime: ''
  });

  if (!tasks || !Array.isArray(tasks)) {
    return (
      <div className="text-center py-8">          
        <h3 className="text-base font-medium text-foreground">No tasks available</h3>
      </div>
    );
  }

  const handleEdit = (task: any) => {
    // Extract date and time from the suggestedCompletionAt timestamp
    let dateStr = '';
    let timeStr = '';
    
    if (task.suggestedCompletionAt) {
      const completionDate = new Date(task.suggestedCompletionAt);
      // Get local date string in YYYY-MM-DD format
      dateStr = completionDate.getFullYear() + '-' + 
                String(completionDate.getMonth() + 1).padStart(2, '0') + '-' + 
                String(completionDate.getDate()).padStart(2, '0');
      // Get local time string in HH:MM format
      timeStr = String(completionDate.getHours()).padStart(2, '0') + ':' + 
                String(completionDate.getMinutes()).padStart(2, '0');
    }
    
    setEditingTask(task.id);
    setEditForm({
      title: task.title,
      description: task.description || '',
      suggestedDate: dateStr,
      suggestedTime: timeStr
    });
  };

  const handleSave = async (taskId: string) => {
    // Combine date and time to create the timestamp
    let suggestedCompletionAt;
    if (editForm.suggestedDate && editForm.suggestedTime) {
      const localDate = new Date(`${editForm.suggestedDate}T${editForm.suggestedTime}`);
      suggestedCompletionAt = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
    }

    await updateTask(taskId, {
      title: editForm.title,
      description: editForm.description,
      suggestedCompletionAt
    });
    setEditingTask(null);
    setEditForm({ title: '', description: '', suggestedDate: '', suggestedTime: '' });
  };

  const handleCancel = () => {
    setEditingTask(null);
    setEditForm({ title: '', description: '', suggestedDate: '', suggestedTime: '' });
  };

  return (
    <div className="space-y-2">
      {tasks.length === 0 ? (
        <div className="text-center py-8">          
          <h3 className="text-base font-medium text-foreground">No tasks found</h3>
          <p className="text-muted-foreground text-xs mt-1">
            Add new task to get started
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="group">
              <div className="card px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600/50 hover:border-gray-200 dark:hover:border-gray-500 rounded-lg transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 pt-0.5">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={(e) =>
                        updateTask(task.id, {
                          status: e.target.checked ? 'completed' : 'pending'
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingTask === task.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Task title"
                        />
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Task description"
                          rows={2}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Completion Date
                            </label>
                            <input
                              type="date"
                              value={editForm.suggestedDate}
                              onChange={(e) => setEditForm({ ...editForm, suggestedDate: e.target.value })}
                              className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Completion Time
                            </label>
                            <input
                              type="time"
                              value={editForm.suggestedTime}
                              onChange={(e) => setEditForm({ ...editForm, suggestedTime: e.target.value })}
                              className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(task.id)}
                            className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-2 py-1 text-xs font-medium bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-medium ${
                              task.status === 'completed'
                                ? 'text-gray-400 dark:text-gray-500 line-through'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(task)}
                              className="px-2 py-0.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                              title="Edit task"
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="px-2 py-0.5 text-xs font-medium text-white rounded transition-colors"
                              style={{ backgroundColor: '#dc2626' }}
                              title="Delete task"
                            >
                              DELETE
                            </button>
                          </div>
                        </div>
                        {task.description && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div
                          className="mt-1 text-xs font-semibold"
                          style={{ color: 'rgba(177, 6, 6, 0.78)' }}
                        >
                          To be completed by: {task.suggestedCompletionAt ? new Date(task.suggestedCompletionAt).toLocaleString() : 'Not set'}
                        </div>
                        <div className="mt-1 text-xs text-gray-400 flex flex-col gap-0.5">
                          <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
                          {task.completedAt && (
                            <span>
                              Completed: {new Date(task.completedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}