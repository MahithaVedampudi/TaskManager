'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TaskCard from './TaskCard';
import CreateTaskDialog from './CreateTaskDialog';

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
  taskLogs?: any[];
}

interface TaskListProps {
  tasks: Task[];
  user: User;
  onTasksUpdate: () => void;
}

export default function TaskList({ tasks, user, onTasksUpdate }: TaskListProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <>
      <div className="space-y-6">
        {tasks.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="pt-12">
              <div className="text-center">
                <p className="text-muted-foreground">No tasks found</p>
                {user.role === 'ADMIN' && (
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Create Task
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>
            {user.role === 'ADMIN' && (
              <div className="mb-4">
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Create New Task
                </Button>
              </div>
            )}
            <div className="space-y-4">
              {tasks.map(task => (
                <TaskCard 
                  key={task.id}
                  task={task}
                  user={user}
                  onTaskUpdated={onTasksUpdate}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateTaskDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onTaskCreated={() => {
          setShowCreateDialog(false);
          onTasksUpdate();
        }}
      />
    </>
  );
}

