'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { testSupabaseConnection } from './supabase-actions';

export function SupabaseTestCard() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  async function handleTest() {
    setStatus('loading');
    setMessage('');
    const result = await testSupabaseConnection();
    if (result.ok) {
      setStatus('success');
      setMessage(`Connected. Inserted row id: ${result.id}`);
    } else {
      setStatus('error');
      setMessage(result.error);
    }
  }

  return (
    <Card className="border-dashed border-muted-foreground/30">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Test Supabase connection</CardTitle>
        <CardDescription>
          Supabase — verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local. See
          src/docs/INTEGRATIONS.md
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button size="sm" variant="outline" onClick={handleTest} disabled={status === 'loading'}>
          {status === 'loading' ? 'Testing…' : 'Test Supabase'}
        </Button>
        {status === 'success' && (
          <p className="text-sm text-green-600 dark:text-green-400" role="status">
            {message}
          </p>
        )}
        {status === 'error' && (
          <p className="text-sm text-destructive" role="alert">
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
