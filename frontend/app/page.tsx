"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"

type Sentiment = "positive" | "negative" | "neutral" | null

export default function SentimentAnalyzer() {
  const [text, setText] = useState("")
  const [sentiment, setSentiment] = useState<Sentiment>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeSentiment = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze")
      return
    }

    setLoading(true)
    setError(null)
    setSentiment(null)

    try {
      // Replace with your actual FastAPI backend URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

      const response = await fetch(`${apiUrl}/sentiment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze sentiment")
      }

      const data = await response.json()
      setSentiment(data.sentiment)
    } catch (err) {
      setError("Failed to connect to the API. Please make sure the backend is running.")
      console.error("[v0] Error analyzing sentiment:", err)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
      case "negative":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
      case "neutral":
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800"
      default:
        return ""
    }
  }

  const getSentimentEmoji = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "positive":
        return "😊"
      case "negative":
        return "😔"
      case "neutral":
        return "😐"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Sentiment Analyzer</h1>
            </div>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Discover the emotional tone of any text using AI-powered analysis. Enter your text below and instantly see
              whether it's positive, negative, or neutral.
            </p>
          </div>

          {/* Main Card */}
          <Card className="p-6 md:p-8 shadow-xl">
            <div className="space-y-6">
              {/* Text Input */}
              <div className="space-y-2">
                <label htmlFor="text-input" className="text-sm font-medium text-foreground">
                  Enter your text
                </label>
                <Textarea
                  id="text-input"
                  placeholder="Type or paste your text here... For example: 'I love this product!' or 'This is terrible.'"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value)
                    setError(null)
                  }}
                  className="min-h-[150px] text-base resize-none"
                  disabled={loading}
                />
              </div>

              {/* Action Button */}
              <Button
                onClick={analyzeSentiment}
                disabled={loading || !text.trim()}
                className="w-full text-base py-6"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Analyze Sentiment
                  </>
                )}
              </Button>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                </div>
              )}

              {/* Result Display */}
              {sentiment && !error && (
                <div
                  className={`p-6 rounded-lg border-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${getSentimentColor(
                    sentiment,
                  )}`}
                >
                  <div className="text-center space-y-2">
                    <div className="text-5xl mb-2">{getSentimentEmoji(sentiment)}</div>
                    <p className="text-sm font-medium uppercase tracking-wide opacity-70">Sentiment Result</p>
                    <p className="text-3xl font-bold capitalize">{sentiment}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Info Section */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Powered by FastAPI • Analyzing text for emotional sentiment in real-time</p>
          </div>
        </div>
      </div>
    </div>
  )
}
