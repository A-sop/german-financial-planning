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
              Stay Reliable, Compliant, and in Control
            </AnimatedGradientText>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            An assistive task-orchestration system that transforms your messages, documents, and requests into clear, trackable actions—helping you stay on top of everything without constant assistance.
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
              Independent professionals struggle with missed or fragmented obligations because tasks arrive through many channels and depend too much on memory or informal processes.
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Designed for You</h3>
              <CardDescription className="text-base">
                Built specifically for visually impaired independent professionals managing high volumes of incoming work.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• High-volume task management</p>
                <p>• Multiple communication channels</p>
                <p>• Need for reliable follow-through</p>
                <p>• Compliance and accountability requirements</p>
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
              How We Help
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our system turns chaos into clarity, giving you the tools to manage your obligations with confidence.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold leading-none tracking-tight">Clear Actions</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Transform messages, documents, and requests into clear, trackable actions you can manage.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold leading-none tracking-tight">Reduced Load</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Reduce cognitive load by centralizing task management and eliminating reliance on memory.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold leading-none tracking-tight">Better Follow-Through</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Improve follow-through with systematic tracking that helps you stay reliable and compliant.
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
                Be among the first to experience a better way to manage your professional obligations.
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
