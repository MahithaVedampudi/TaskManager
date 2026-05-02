'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EditTaskDialog from './EditTaskDialog';
import LogHoursDialog from './LogHoursDialog';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  projectId: number;
  assignedTo?: number;
  assignee?: User;
  estimatedHours: number;
  actualHours: number;
  dueDate?: string;
  createdAt: string;
  description?: string;
}

interface TaskCardProps {
  task: Task;
  user: User;
  onTaskUpdated: () => void;
}

const statusColors: Record<string, string> = {
  UNASSIGNED: 'bg-yellow-500/20 text-yellow-400',
  PENDING: 'bg-blue-500/20 text-blue-400',
  IN_PROGRESS: 'bg-cyan-500/20 text-cyan-400',
  COMPLETED: 'bg-green-500/20 text-green-400',
};

const priorityColors: Record<string, string> = {
  LOW: 'border-green-500/50',
  MEDIUM: 'border-yellow-500/50',
  HIGH: 'border-red-500/50',
};

export default function TaskCard({ task, user, onTaskUpdated }: TaskCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showLogHoursDialog, setShowLogHoursDialog] = useState(false);

  const isAssignedToUser = task.assignedTo === user.id;
  const isAdmin = user.role === 'ADMIN';
  const canEdit = isAdmin || isAssignedToUser;

  const handleDeleteTask = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onTaskUpdated();
      } else {
        alert('Failed to delete task');
      }
    } catch (err) {
      console.error('[Task Manager] Error deleting task:', err);
      alert('Error deleting task');
    }
  };

  return (
    <>
      <Card className={`border-l-4 border border-border ${priorityColors[task.priority]}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg text-foreground">{task.title}</CardTitle>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusColors[task.status]}`}>
              {task.status.replace('_', ' ')}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Assigned to</p>
              <p className="text-foreground font-medium">
                {task.assignee?.name || 'Unassigned'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Hours</p>
              <p className="text-foreground font-medium">
                {task.actualHours.toFixed(1)} / {task.estimatedHours.toFixed(1)}
              </p>
            </div>
          </div>

          {task.dueDate && (
            <div className="text-sm">
              <p className="text-muted-foreground">Due Date</p>
              <p className="text-foreground font-medium">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {canEdit && (
              <>
                <Button
                  size="sm"
                  onClick={() => setShowEditDialog(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
                >
                  Edit
                </Button>
                {task.assignedTo === user.id && task.status !== 'COMPLETED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowLogHoursDialog(true)}
                    className="border-border text-foreground hover:bg-secondary flex-1"
                  >
                    Log Hours
                  </Button>
                )}
              </>
            )}
            {isAdmin && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeleteTask}
                className="bg-red-500/80 hover:bg-red-500 text-white"
              >
                Delete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <EditTaskDialog
        task={task}
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onTaskUpdated={() => {
          setShowEditDialog(false);
          onTaskUpdated();
        }}
        isAdmin={isAdmin}
      />

      <LogHoursDialog
        taskId={task.id}
        isOpen={showLogHoursDialog}
        onClose={() => setShowLogHoursDialog(false)}
        onHoursLogged={() => {
          setShowLogHoursDialog(false);
          onTaskUpdated();
        }}
      />
    </>
  );
}

