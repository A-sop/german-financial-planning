"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { testOpenAI } from "./actions"

export function ApiTestCard() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")

  async function handleTest() {
    setStatus("loading")
    setMessage("")
    const result = await testOpenAI()
    if (result.ok) {
      setStatus("success")
      setMessage(result.text)
    } else {
      setStatus("error")
      setMessage(result.error)
    }
  }

  return (
    <Card className="border-dashed border-muted-foreground/30">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Test API connection</CardTitle>
        <CardDescription>
          OpenAI — verify OPENAI_API_KEY in .env.local. See src/docs/INTEGRATIONS.md
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          size="sm"
          variant="outline"
          onClick={handleTest}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Testing…" : "Test OpenAI"}
        </Button>
        {status === "success" && (
          <p className="text-sm text-green-600 dark:text-green-400" role="status">
            {message}
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-destructive" role="alert">
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
