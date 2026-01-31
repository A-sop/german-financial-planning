import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ApiTestCard } from "./api-test-card"
import { testOpenAI } from "./actions"

vi.mock("./actions")

describe("ApiTestCard", () => {
  beforeEach(() => {
    vi.mocked(testOpenAI).mockReset()
  })

  it("renders test button and description", () => {
    render(<ApiTestCard />)
    expect(screen.getByRole("button", { name: /test openai/i })).toBeInTheDocument()
    expect(screen.getByText("Test API connection")).toBeInTheDocument()
  })

  it("shows loading state when button clicked", async () => {
    vi.mocked(testOpenAI).mockImplementation(
      () => new Promise((r) => setTimeout(() => r({ ok: true, text: "OK" }), 200))
    )
    const user = userEvent.setup()
    render(<ApiTestCard />)

    await user.click(screen.getByRole("button", { name: /test openai/i }))

    expect(screen.getByRole("button", { name: /testing/i })).toBeInTheDocument()
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("shows success message when API returns ok", async () => {
    vi.mocked(testOpenAI).mockResolvedValue({
      ok: true,
      text: "Connected. Executive Concierge is ready.",
    })
    const user = userEvent.setup()
    render(<ApiTestCard />)

    await user.click(screen.getByRole("button", { name: /test openai/i }))

    await waitFor(() => {
      expect(screen.getByText(/connected\. executive concierge is ready\./i)).toBeInTheDocument()
    })
  })

  it("shows error message when API returns error", async () => {
    vi.mocked(testOpenAI).mockResolvedValue({
      ok: false,
      error: "OPENAI_API_KEY not set in .env.local",
    })
    const user = userEvent.setup()
    render(<ApiTestCard />)

    await user.click(screen.getByRole("button", { name: /test openai/i }))

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/OPENAI_API_KEY/)
    })
  })
})
