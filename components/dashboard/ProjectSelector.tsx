'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import CreateProjectDialog from './CreateProjectDialog';

interface Project {
  id: number;
  name: string;
  description?: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: number | null;
  onSelectProject: (projectId: number) => void;
  user: User;
}

export default function ProjectSelector({
  projects,
  selectedProject,
  onSelectProject,
  user,
}: ProjectSelectorProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <>
      <Card className="border border-border sticky top-24">
        <CardHeader>
          <CardTitle className="text-lg">Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects yet</p>
          ) : (
            <div className="space-y-2">
              {projects.map(project => (
                <button
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                    selectedProject === project.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {project.name}
                </button>
              ))}
            </div>
          )}

          {user.role === 'ADMIN' && (
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              New Project
            </Button>
          )}
        </CardContent>
      </Card>

      <CreateProjectDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onProjectCreated={() => {
          setShowCreateDialog(false);
          // Refetch projects - in a real app, we'd use a state management solution
          window.location.reload();
        }}
      />
    </>
  );
}

