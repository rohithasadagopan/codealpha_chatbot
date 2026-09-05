export type Faq = {
  id: string;
  topic: string;
  question: string;
  answer: string;
  /** Extra phrasings that should also match this entry (intent matching). */
  variants?: string[];
};

export const FAQS: Faq[] = [
  // --- Orders & shopping ---
  {
    id: "order-track",
    topic: "Orders",
    question: "How do I track my order?",
    answer:
      "Open **My Orders**, pick the order, and tap *Track shipment*. You'll see live courier scans plus the estimated delivery date. A tracking link is also emailed the moment your parcel leaves our warehouse.",
    variants: ["where is my package", "order status", "when will my parcel arrive"],
  },
  {
    id: "order-cancel",
    topic: "Orders",
    question: "Can I cancel or change an order after placing it?",
    answer:
      "Yes, as long as the order hasn't shipped. Go to **My Orders → Cancel order**. Once it shows *Packed*, cancellation isn't possible, but you can refuse delivery or start a free return.",
    variants: ["cancel my order", "change delivery address", "modify order"],
  },
  {
    id: "order-return",
    topic: "Orders",
    question: "What is the return and refund policy?",
    answer:
      "Returns are accepted within **30 days** of delivery for unused items in original packaging. Refunds land back on the original payment method 5-7 business days after we receive the item.",
    variants: ["return item", "refund money back", "exchange product"],
  },
  {
    id: "order-shipping-cost",
    topic: "Orders",
    question: "How much does shipping cost and how long does it take?",
    answer:
      "Standard shipping is **free over $50**, otherwise $4.99, and takes 3-5 business days. Express delivery is $9.99 and arrives in 1-2 business days.",
    variants: ["delivery charges", "shipping time", "free delivery"],
  },

  // --- Payments ---
  {
    id: "pay-methods",
    topic: "Payments",
    question: "Which payment methods do you accept?",
    answer:
      "We accept Visa, Mastercard, American Express, UPI, net banking, Apple Pay, Google Pay, and PayPal. Cash on delivery is available in selected regions.",
    variants: ["can I pay with paypal", "do you take upi", "credit card accepted"],
  },
  {
    id: "pay-failed",
    topic: "Payments",
    question: "My payment failed but money was deducted. What now?",
    answer:
      "Failed transactions are auto-reversed by your bank within **5-7 business days**. If it doesn't reflect by then, share the transaction reference with support and we'll chase it for you.",
    variants: ["money deducted no order", "payment declined", "double charged"],
  },
  {
    id: "pay-invoice",
    topic: "Payments",
    question: "How do I get an invoice or GST bill?",
    answer:
      "Every order has a downloadable PDF invoice under **My Orders → Invoice**. To add GST or company details, enter them at checkout before paying.",
    variants: ["download bill", "tax invoice", "receipt"],
  },

  // --- Account ---
  {
    id: "acct-reset",
    topic: "Account",
    question: "How do I reset my password?",
    answer:
      "On the sign-in screen choose **Forgot password**, enter your email, and follow the reset link. The link expires in 30 minutes; request a new one if it times out.",
    variants: ["forgot password", "can't log in", "change my password"],
  },
  {
    id: "acct-delete",
    topic: "Account",
    question: "How can I delete my account?",
    answer:
      "Go to **Settings → Privacy → Delete account**. Deletion is permanent after a 14-day grace period, during which signing back in cancels the request.",
    variants: ["close my account", "remove my data", "deactivate profile"],
  },
  {
    id: "acct-email",
    topic: "Account",
    question: "Can I change the email address on my account?",
    answer:
      "Yes. Open **Settings → Account → Email**, enter the new address, and confirm the verification link we send there. Your order history stays intact.",
    variants: ["update email", "wrong email address"],
  },

  // --- Privacy & security ---
  {
    id: "sec-data",
    topic: "Privacy",
    question: "How is my personal data protected?",
    answer:
      "Data is encrypted in transit (TLS 1.3) and at rest (AES-256). We never sell personal data, and card numbers are held by our PCI-DSS certified payment partner, not by us.",
    variants: ["is my data safe", "do you sell my data", "security"],
  },
  {
    id: "sec-2fa",
    topic: "Privacy",
    question: "Do you support two-factor authentication?",
    answer:
      "Yes. Enable it under **Settings → Security → Two-factor authentication** using an authenticator app or SMS code. Backup codes are shown once, so store them safely.",
    variants: ["2fa", "otp login", "extra security on login"],
  },

  // --- Subscription ---
  {
    id: "sub-plans",
    topic: "Subscription",
    question: "What subscription plans are available?",
    answer:
      "Free (core features), **Plus** at $9/month (unlimited history and priority support), and **Team** at $29/month for up to 10 members with shared workspaces.",
    variants: ["pricing", "how much does it cost", "plan comparison"],
  },
  {
    id: "sub-cancel",
    topic: "Subscription",
    question: "How do I cancel my subscription?",
    answer:
      "Open **Settings → Billing → Cancel plan**. You keep paid features until the end of the current billing period, and no further charges are made.",
    variants: ["stop billing", "end membership", "unsubscribe"],
  },
  {
    id: "sub-trial",
    topic: "Subscription",
    question: "Is there a free trial?",
    answer:
      "Yes, a **14-day free trial** of Plus with no card required. If you don't upgrade, the account simply reverts to the Free plan when the trial ends.",
    variants: ["trial period", "try before buying"],
  },

  // --- Support ---
  {
    id: "sup-contact",
    topic: "Support",
    question: "How do I contact customer support?",
    answer:
      "Email **support@example.com**, use in-app live chat (9am-9pm, all week), or call 1-800-555-0134. Typical first reply time is under 4 hours.",
    variants: ["talk to a human", "phone number", "customer care"],
  },
  {
    id: "sup-hours",
    topic: "Support",
    question: "What are your working hours?",
    answer:
      "Live chat and phone support run **9:00am to 9:00pm local time, seven days a week**. Email is monitored around the clock for urgent issues.",
    variants: ["when are you open", "support timings"],
  },
  {
    id: "sup-bug",
    topic: "Support",
    question: "How do I report a bug or give feedback?",
    answer:
      "Use **Help → Report a problem** in the app; it attaches diagnostics automatically. Feature ideas are welcome at feedback@example.com and are reviewed every sprint.",
    variants: ["something is broken", "app crash", "suggestion"],
  },

  // --- App / technical ---
  {
    id: "app-offline",
    topic: "App",
    question: "Does the app work offline?",
    answer:
      "Recently viewed content is cached for offline reading. Actions taken offline queue up and sync automatically the next time you're connected.",
    variants: ["no internet", "offline mode"],
  },
  {
    id: "app-devices",
    topic: "App",
    question: "Which devices and browsers are supported?",
    answer:
      "The web app supports the latest Chrome, Edge, Firefox, and Safari. Mobile apps require iOS 15+ or Android 9+.",
    variants: ["system requirements", "supported browsers", "ios android"],
  },
];

export const TOPICS = Array.from(new Set(FAQS.map((f) => f.topic)));
