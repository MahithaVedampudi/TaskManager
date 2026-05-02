'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, <span className="font-semibold text-foreground">{user.name}</span>
            <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
              {user.role}
            </span>
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={handleLogout}
          className="border-border text-foreground hover:bg-secondary"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}

