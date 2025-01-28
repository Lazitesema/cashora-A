import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="space-y-6 text-gray-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Cashora service, you agree to be bound by these Terms of Service and all
            applicable laws and regulations. If you do not agree with any part of these terms, you may not use our
            service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
          <p>
            Cashora provides a platform for international money transfers and multi-currency management. We reserve the
            right to modify or discontinue, temporarily or permanently, the service with or without notice.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p>
            You must create an account to use our service. You are responsible for maintaining the confidentiality of
            your account and password and for restricting access to your account. You agree to accept responsibility for
            all activities that occur under your account.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Obligations</h2>
          <p>
            You agree to use the service for lawful purposes only and in compliance with all applicable laws and
            regulations. You shall not use the service to conduct any illegal activities, including but not limited to
            money laundering or financing terrorism.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Fees and Charges</h2>
          <p>
            Fees for using Cashora services will be clearly communicated before each transaction. We reserve the right
            to change our fee structure at any time with prior notice.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
          <p>
            Cashora shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any
            loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or
            other intangible losses.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
          <p>
            We reserve the right to update or change these Terms of Service at any time. Your continued use of the
            service after we post any modifications to the Terms of Service on this page will constitute your
            acknowledgment of the modifications and your consent to abide and be bound by the modified Terms of Service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without
            regard to its conflict of law provisions.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p className="mt-2">
            Email: legal@cashora.com
            <br />
            Address: 123 Finance Street, Money City, MC 12345
          </p>
        </div>

        <div className="mt-12">
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

