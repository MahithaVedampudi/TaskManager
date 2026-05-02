'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  projectId: number;
  assignedTo?: number;
  assignee?: any;
  estimatedHours: number;
  actualHours: number;
  dueDate?: string;
  createdAt: string;
  description?: string;
}

interface EditTaskDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
  isAdmin: boolean;
}

export default function EditTaskDialog({
  task,
  isOpen,
  onClose,
  onTaskUpdated,
  isAdmin,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [estimatedHours, setEstimatedHours] = useState(task.estimatedHours.toString());
  const [actualHours, setActualHours] = useState(task.actualHours.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const updates: any = {};
      
      if (isAdmin) {
        updates.title = title;
        updates.description = description;
        updates.status = status;
        updates.priority = priority;
        updates.estimatedHours = estimatedHours ? parseFloat(estimatedHours) : 0;
      } else {
        // Members can only update status and actualHours
        updates.status = status;
      }

      if (actualHours !== task.actualHours.toString()) {
        updates.actualHours = actualHours ? parseFloat(actualHours) : 0;
      }

      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update task');
        return;
      }

      onTaskUpdated();
    } catch (err) {
      setError('An error occurred');
      console.error('[Task Manager] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-card border border-border">
        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Edit Task</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            {isAdmin && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    className="bg-secondary border border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    rows={3}
                    className="w-full bg-secondary border border-border text-foreground rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={loading}
                    className="w-full bg-secondary border border-border text-foreground rounded-md px-3 py-2"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Estimated Hours</label>
                  <Input
                    type="number"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    step="0.5"
                    min="0"
                    disabled={loading}
                    className="bg-secondary border border-border text-foreground"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={loading}
                className="w-full bg-secondary border border-border text-foreground rounded-md px-3 py-2"
              >
                <option value="UNASSIGNED">Unassigned</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {!isAdmin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Hours Logged</label>
                <Input
                  type="number"
                  value={actualHours}
                  onChange={(e) => setActualHours(e.target.value)}
                  step="0.5"
                  min="0"
                  disabled={loading}
                  className="bg-secondary border border-border text-foreground"
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 border-border text-foreground hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

