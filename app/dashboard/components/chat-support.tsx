"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
}

const cashoraData = {
  "What is Cashora?":
    "Cashora is a financial management platform designed for the African market. It offers services such as money transfers, multi-currency accounts, and virtual cards.",
  "How do I send money?":
    "To send money, log into your Cashora account, go to the 'Send Money' section, enter the recipient's details and the amount, then confirm the transaction.",
  "What are the fees for transactions?":
    "Cashora's fees vary depending on the type of transaction and your account level. Generally, we charge a small percentage for transfers and currency exchanges. Check our fee schedule for detailed information.",
  "Is Cashora safe to use?":
    "Yes, Cashora employs state-of-the-art security measures to protect your financial information and transactions. We use encryption, two-factor authentication, and regular security audits to ensure the safety of your funds and data.",
  "How can I deposit money into my Cashora account?":
    "You can deposit money into your Cashora account through bank transfers, mobile money services, or by linking your debit card. The exact methods available may depend on your location.",
  "What currencies does Cashora support?":
    "Cashora supports a wide range of African and international currencies. Some of the major currencies include USD, EUR, GBP, NGN, KES, and ZAR. Check our currency list for a full overview.",
  "How long do transfers take?":
    "Most Cashora to Cashora transfers are instant. Transfers to external bank accounts typically take 1-3 business days, depending on the destination bank and country.",
  "Can I use Cashora for business transactions?":
    "Yes, Cashora offers business accounts with features tailored for companies, including multi-user access, bulk payments, and detailed transaction reporting.",
  "What should I do if I forget my password?":
    "If you forget your password, click on the 'Forgot Password' link on the login page. We'll send you instructions to reset your password to your registered email address.",
  "Is there a mobile app for Cashora?":
    "Yes, Cashora has mobile apps available for both iOS and Android devices. You can download them from the App Store or Google Play Store.",
}

export function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you today?",
      sender: "bot",
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesEndRef]) //Corrected dependency

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Generate bot response based on custom Cashora data
    const botResponse = generateBotResponse(input)
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: "bot",
    }

    setMessages((prev) => [...prev, botMessage])
  }

  const generateBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    let bestMatch = ""
    let highestSimilarity = 0

    for (const question in cashoraData) {
      const similarity = calculateSimilarity(lowerInput, question.toLowerCase())
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity
        bestMatch = question
      }
    }

    if (highestSimilarity > 0.6) {
      return cashoraData[bestMatch as keyof typeof cashoraData]
    } else {
      return "I'm sorry, I don't have specific information about that. Can you please rephrase your question or ask about our services, fees, or how to use Cashora?"
    }
  }

  const calculateSimilarity = (str1: string, str2: string): number => {
    const set1 = new Set(str1.split(" "))
    const set2 = new Set(str2.split(" "))
    const intersection = new Set([...set1].filter((x) => set2.has(x)))
    return intersection.size / Math.max(set1.size, set2.size)
  }

  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 z-50 transition-all duration-300 ease-in-out">
          <Card className="shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">Cashora Support</CardTitle>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[300px] pr-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>
              <form onSubmit={handleSend} className="flex gap-2 mt-4">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

