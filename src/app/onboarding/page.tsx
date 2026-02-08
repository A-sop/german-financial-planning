'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { completeOnboarding } from './actions';

const APP_NAME = 'My App';

const screens = [
  {
    title: `Welcome to ${APP_NAME}`,
    subheading:
      'Track your actions and stay on top of what matters most. Simple, focused, and built for clarity.',
    progress: 1,
  },
  {
    title: 'Stay in control with the approval layer',
    subheading:
      'Review and approve before things move forward. No surprises, full visibility.',
    progress: 2,
  },
  {
    title: 'Ready to get started?',
    subheading: "You're all set. Jump in and start tracking your progress.",
    progress: 3,
  },
] as const;

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { getToken } = useAuth();

  const screen = screens[step];
  const isLastStep = step === screens.length - 1;

  const handleComplete = async () => {
    setIsCompleting(true);
    setError(null);
    const result = await completeOnboarding();

    if ('error' in result) {
      setError(result.error);
      setIsCompleting(false);
      return;
    }

    // Refresh JWT so middleware sees onboardingComplete on next request
    await getToken({ skipCache: true });
    // Give Clerk time to persist updated session cookie before we navigate
    await new Promise((resolve) => setTimeout(resolve, 800));
    router.refresh();
    // Use ?onboarding=done so middleware allows through if JWT is still stale (avoids loop)
    router.push('/workspace?onboarding=done');
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Step {screen.progress} of 3
          </p>
          <h1 className="text-2xl font-semibold text-foreground mb-3">
            {screen.title}
          </h1>
          <p className="text-muted-foreground">{screen.subheading}</p>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-md px-4 py-2">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          {step > 0 && (
            <Button variant="outline" onClick={handleBack} disabled={isCompleting}>
              Back
            </Button>
          )}
          <Button onClick={handleNext} disabled={isCompleting}>
            {isLastStep ? 'Get Started' : 'Next'}
          </Button>
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isCompleting}
            className="text-muted-foreground"
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}
