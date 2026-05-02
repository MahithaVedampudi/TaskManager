'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface LogHoursDialogProps {
  taskId: number;
  isOpen: boolean;
  onClose: () => void;
  onHoursLogged: () => void;
}

export default function LogHoursDialog({
  taskId,
  isOpen,
  onClose,
  onHoursLogged,
}: LogHoursDialogProps) {
  const [hoursWorked, setHoursWorked] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/task-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          hoursWorked: parseFloat(hoursWorked),
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to log hours');
        return;
      }

      onHoursLogged();
      setHoursWorked('');
      setNotes('');
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
          <h2 className="text-xl font-bold text-foreground mb-4">Log Hours</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Hours Worked *</label>
              <Input
                type="number"
                placeholder="0"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                required
                step="0.5"
                min="0"
                disabled={loading}
                className="bg-secondary border border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Notes</label>
              <textarea
                placeholder="What did you work on?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading}
                rows={3}
                className="w-full bg-secondary border border-border text-foreground rounded-md px-3 py-2 text-sm"
              />
            </div>

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
                {loading ? 'Logging...' : 'Log Hours'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

