import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailTemplateConfig {
  subject: string;
  content: (data: any) => string;
}

interface SendEmailOptions {
  to: string;
  type: EmailType;
  data?: any;
}

export type EmailType =
  | "withdrawal_request"
  | "deposit_request"
  | "send_request"
  | "account_approval"
  | "account_rejection"
  | "signup"
  | "admin_created_account";

const emailTemplates: Record<EmailType, EmailTemplateConfig> = {
  withdrawal_request: {
    subject: "Withdrawal Request Received",
    content: ({ amount, user }) => `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <img src="https://cashora.vercel.app/placeholder-logo.png" alt="Cashora Logo" style="max-width: 150px; margin-bottom: 20px;">
        <h2 style="color: #333333;">Withdrawal Request Confirmation</h2>
        <p>Dear ${user.name},</p>
        <p>We have received your request to withdraw <strong>$${amount}</strong>. Our team is currently reviewing your request and will process it as soon as possible.</p>
        <p style="margin-bottom: 20px;">Thank you for using Cashora!</p>
        <a href="https://cashora.vercel.app" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Cashora</a>
      </div>
    </div>
    `,
  },
  deposit_request: {
    subject: "Deposit Request Received",
    content: ({ amount, user }) => `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <img src="https://cashora.vercel.app/placeholder-logo.png" alt="Cashora Logo" style="max-width: 150px; margin-bottom: 20px;">
          <h2 style="color: #333333;">Deposit Request Confirmation</h2>
          <p>Dear ${user.name},</p>
          <p>We have received your request to deposit <strong>$${amount}</strong>. Our team is currently reviewing your request and will process it as soon as possible.</p>
          <p style="margin-bottom: 20px;">Thank you for using Cashora!</p>
          <a href="https://cashora.vercel.app" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Cashora</a>
        </div>
      </div>
    `,
  },
  send_request: {
    subject: "Send Money Request Received",
    content: ({ amount, sender, receiver }) => `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <img src="https://cashora.vercel.app/placeholder-logo.png" alt="Cashora Logo" style="max-width: 150px; margin-bottom: 20px;">
          <h2 style="color: #333333;">Send Money Request Confirmation</h2>
          <p>Dear ${sender.name},</p>
          <p>You have sent <strong>$${amount}</strong> to ${receiver.name} We will notify you when the operation is successful.</p>
          <p style="margin-bottom: 20px;">Thank you for using Cashora!</p>
          <a href="https://cashora.vercel.app" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Cashora</a>
        </div>
      </div>
    `,
  },
  account_approval: {
    subject: "Account Approved",
    content: ({ user }) => `<p>Dear ${user.name}, your account has been approved.</p>`,
  },
  account_rejection: {
    subject: "Account Rejected",
    content: ({ user, reason }) => `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <img src="https://cashora.vercel.app/placeholder-logo.png" alt="Cashora Logo" style="max-width: 150px; margin-bottom: 20px;">
        <h2 style="color: #333333;">Account Rejection Notice</h2>
        <p>Dear ${user.name},</p>
        <p>We regret to inform you that your account application with Cashora has been rejected.</p>
        <p><strong>Reason for Rejection:</strong> ${reason || "No reason provided."}</p>
        <p style="margin-bottom: 20px;">If you believe this to be a mistake or need further clarification, please contact our support team.</p>
        <a href="https://cashora.vercel.app" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Cashora</a>
      </div>
    </div>
    `,
  },
  signup: {
    subject: "Welcome to Cashora",
    content: ({ user }) => `<p>Dear ${user.name}, welcome to Cashora!</p>`,
  },
  admin_created_account: {
    subject: "Cashora Account Created",
    content: ({ user }) => `<p>Dear ${user.name}, an account has been created for you on Cashora.</p>`,
  },
};

export async function sendEmail({ to, type, data }: SendEmailOptions) {
  const template = emailTemplates[type];

  if (!template) {
    console.error(`Email template not found for type: ${type}`);
    return { success: false, error: "Email template not found" };
  }

  try {
    const resendResponse = await resend.emails.send({
      from: "Cashora <noreply@cashora.com>",
      to,
      subject: template.subject,
      html: template.content(data),
    });

    console.log("Email sent successfully:", resendResponse);
    return { success: true, data: resendResponse };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
