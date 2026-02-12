import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/pricing(.*)']);
const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);
const isAuthExemptAfterLoginRoute = createRouteMatcher(['/onboarding(.*)', '/pricing(.*)']);
const isWorkspaceRoute = createRouteMatcher(['/workspace(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Server Action requests must reach the handler so they return RSC, not a redirect
  if (req.headers.get('next-action')) return NextResponse.next();

  const { isAuthenticated, sessionClaims, redirectToSignIn, has } = await auth();

  // Allow unauthenticated users to access public routes
  if (!isAuthenticated) {
    if (isPublicRoute(req)) return NextResponse.next();
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Authenticated user on onboarding or pricing — let them through even if onboarding isn't complete
  if (isAuthExemptAfterLoginRoute(req)) return NextResponse.next();

  // Authenticated but hasn't completed onboarding — redirect to /onboarding
  const metadata = sessionClaims?.metadata as { onboardingComplete?: boolean } | undefined;
  if (!metadata?.onboardingComplete) {
    const url = new URL(req.url);
    const onboardingCookie = req.cookies.get('onboarding_just_done')?.value;

    // One-time bypass: after "Get Started", JWT can be stale. Allow through with ?onboarding=done
    // or with short-lived cookie (so router.replace('/workspace') doesn't send user back)
    if (url.pathname === '/workspace') {
      if (url.searchParams.get('onboarding') === 'done') {
        const res = NextResponse.next();
        res.cookies.set('onboarding_just_done', '1', {
          path: '/',
          maxAge: 120,
          httpOnly: true,
          sameSite: 'lax',
        });
        return res;
      }
      if (onboardingCookie === '1') {
        // Allow through; don't delete cookie — router.refresh() after add-task etc.
        // would otherwise hit us without cookie before JWT has onboardingComplete.
        return NextResponse.next();
      }
    }
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // Workspace requires cm_operator plan — redirect to pricing if not subscribed
  if (isWorkspaceRoute(req)) {
    const hasCmOperator = has?.({ plan: 'cm_operator' }) ?? false;
    if (!hasCmOperator) {
      const pricingUrl = new URL('/pricing', req.url);
      pricingUrl.searchParams.set('reason', 'workspace');
      return NextResponse.redirect(pricingUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
