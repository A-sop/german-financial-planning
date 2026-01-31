"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EarlyAccessForm } from "@/components/early-access-form"
import { useLocale } from "@/components/providers/locale-provider"

export default function Home() {
  const { t } = useLocale()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-20">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)) 50%, hsl(var(--background)) 100%)",
          }}
        />
        
        <div className="relative z-10 flex max-w-4xl flex-col items-center space-y-8 text-center">
          <Badge variant="secondary" className="mb-4">
            {t("comingSoon")}
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {t("heroTitle")}
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {t("heroSubtitle")}
          </p>

          <Link href="/workspace">
            <Button size="lg" className="mt-4">
              {t("openWorkspace")}
            </Button>
          </Link>
        </div>
      </section>

      <Separator />

      {/* Problem & Audience Section */}
      <section className="bg-muted/30 py-20 px-4">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("theChallenge")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("challengeText")}
            </p>
          </div>

          <Card className="border border-border">
            <CardHeader>
              <h3 className="text-2xl font-semibold leading-none tracking-tight">{t("builtFor")}</h3>
              <CardDescription className="text-base">
                {t("builtForDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• {t("voiceIntake")}</p>
                <p>• {t("structuredCases")}</p>
                <p>• {t("docIntelligence")}</p>
                <p>• {t("approvalGated")}</p>
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
              {t("howItWorks")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("howItWorksText")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold leading-none tracking-tight">{t("captureEverywhere")}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("captureEverywhereDesc")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold leading-none tracking-tight">{t("documentIntelligence")}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("documentIntelligenceDesc")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold leading-none tracking-tight">{t("approvalBeforeSend")}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("approvalBeforeSendDesc")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Call to Action Section */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-2xl">
          <Card className="overflow-hidden border border-border shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">
                {t("getEarlyAccess")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("earlyAccessDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EarlyAccessForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
