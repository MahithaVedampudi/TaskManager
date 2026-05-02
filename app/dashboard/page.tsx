'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TaskList from '@/components/dashboard/TaskList';
import ProjectSelector from '@/components/dashboard/ProjectSelector';
import { getCurrentUser } from '@/lib/auth';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface Project {
  id: number;
  name: string;
  description?: string;
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
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check authentication
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          router.push('/login');
          return;
        }
        const userData = await userResponse.json();
        setUser(userData.user);

        // Fetch projects
        const projectsResponse = await fetch('/api/projects');
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.projects);
          if (projectsData.projects.length > 0) {
            setSelectedProject(projectsData.projects[0].id);
          }
        }
      } catch (err) {
        console.error('[Task Manager] Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (!selectedProject) return;

    const fetchTasks = async () => {
      try {
        const params = new URLSearchParams();
        params.append('projectId', selectedProject.toString());
        if (selectedStatus) {
          params.append('status', selectedStatus);
        }

        const response = await fetch(`/api/tasks?${params}`);
        if (response.ok) {
          const data = await response.json();
          setTasks(data.tasks);
        }
      } catch (err) {
        console.error('[Task Manager] Error fetching tasks:', err);
      }
    };

    fetchTasks();
  }, [selectedProject, selectedStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const statuses = ['UNASSIGNED', 'PENDING', 'IN_PROGRESS', 'COMPLETED'];
  const tasksByStatus = statuses.map(status => ({
    status,
    count: tasks.filter(t => t.status === status).length
  }));

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-destructive/10 text-destructive px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {tasksByStatus.map(({ status, count }) => (
            <Card 
              key={status}
              className="border border-border cursor-pointer hover:bg-card/50 transition-colors"
              onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
            >
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{count}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {status.replace('_', ' ')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProjectSelector 
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
              user={user}
            />
          </div>

          <div className="lg:col-span-3">
            <TaskList 
              tasks={tasks}
              user={user}
              onTasksUpdate={() => {
                // Refetch tasks
                if (selectedProject) {
                  const params = new URLSearchParams();
                  params.append('projectId', selectedProject.toString());
                  if (selectedStatus) {
                    params.append('status', selectedStatus);
                  }
                  fetch(`/api/tasks?${params}`)
                    .then(res => res.json())
                    .then(data => setTasks(data.tasks));
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

