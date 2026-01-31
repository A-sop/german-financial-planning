"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text"
import { BorderBeam } from "@/components/magicui/border-beam"
import { DotPattern } from "@/components/magicui/dot-pattern"
import { cn } from "@/lib/utils"

export default function Home() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Add backend integration
    console.log("Form submitted")
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-background px-4 py-20">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
          )}
        />
        
        <div className="relative z-10 flex max-w-4xl flex-col items-center space-y-8 text-center">
          <Badge variant="secondary" className="mb-4">
            Coming Soon
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <AnimatedGradientText className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              Delegate the Chaos. Keep the Control.
            </AnimatedGradientText>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            An executive concierge and operational assistant that turns voice, messages, and documents into structured cases and workflows—with a human approval layer so nothing goes out without your say.
          </p>
        </div>
      </section>

      <Separator />

      {/* Problem & Audience Section */}
      <section className="bg-muted/30 py-20 px-4">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The Challenge
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Executives and concierge operators juggle voice instructions, forwarded messages, and documents across clients and cases—without a single place to structure it or a safe way to delegate outbound communication.
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Built for Executives & Concierge Operators</h3>
              <CardDescription className="text-base">
                CRM, task manager, and document intelligence in one system—with one human assistant approval layer so you delegate operational complexity without losing control.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Voice, email, and message intake</p>
                <p>• Structured cases and tasks</p>
                <p>• Document ingestion and extraction</p>
                <p>• Approval-gated communications and updates</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Solution Section */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One system to capture, structure, and act—with a human approval layer so outbound communication and sensitive updates only go out when you or your assistant approve.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold leading-none tracking-tight">Capture Everywhere</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Voice instructions, forwarded emails, and documents feed into structured cases and tasks—one place for clients, obligations, and timelines.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold leading-none tracking-tight">Document Intelligence</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ingest PDFs, DOCX, spreadsheets, and images; extract text and structured data; review and approve updates before they touch the case.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold leading-none tracking-tight">Approval Before Send</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The system drafts communications and letters; you or your assistant approve before anything is sent. No autonomous outbound—you stay in control.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Call to Action Section */}
      <section className="bg-muted/30 py-20 px-4">
        <div className="mx-auto max-w-2xl">
          <Card className="relative overflow-hidden border-2">
            <BorderBeam duration={8} size={100} />
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">
                Get Early Access
              </CardTitle>
              <CardDescription className="text-base">
                Be among the first to delegate operational complexity with an executive concierge that keeps you in control.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full"
                    aria-label="Email address for early access"
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Notify Me When Available
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
