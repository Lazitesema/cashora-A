import { NextResponse } from "next/server"

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

function findBestMatch(userInput: string): string {
  const userInputLower = userInput.toLowerCase()
  let bestMatch = ""
  let highestSimilarity = 0

  for (const question in cashoraData) {
    const similarity = calculateSimilarity(userInputLower, question.toLowerCase())
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

function calculateSimilarity(str1: string, str2: string): number {
  const set1 = new Set(str1.split(" "))
  const set2 = new Set(str2.split(" "))
  const intersection = new Set([...set1].filter((x) => set2.has(x)))
  return intersection.size / Math.max(set1.size, set2.size)
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    const reply = findBestMatch(message)
    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 })
  }
}

