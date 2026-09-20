export interface InputField {
  key: string
  label: string
  type: 'input' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  priceMonthly: 29,
  priceYearly: 290,
  name: "SocialProof Widget",
  slug: "social-proof-widget",
  productId: "PROD_5j5QE1AT3PpYkKKLXWw0JV",
  yearlyProductId: "PROD_5C3veIjGLuKsyTpdjQ2IVI",
  checkoutUrl: "",
  tagline: "Social proof copy and widgets that make landing pages convert",
  description: "Generate credible, ready-to-paste testimonial snippets, rating bars, and usage counters for your landing page in seconds \u2014 no designer or copywriter needed.",
  toolTitle: "Generate your social proof",
  resultLabel: "Your snippets",
  ctaLabel: "Generate proof",
  features: [
  "Testimonial, rating, logo & counter styles",
  "Copy that sounds real, not fake",
  "One-click export to HTML embed",
  "A/B variant suggestions"
],
  inputs: [
  {
    "key": "product",
    "label": "Product or business",
    "type": "input",
    "placeholder": "e.g. A scheduling app for solo consultants"
  },
  {
    "key": "audience",
    "label": "Target audience",
    "type": "input",
    "placeholder": "e.g. busy freelance consultants"
  },
  {
    "key": "proofType",
    "label": "Proof style",
    "type": "select",
    "options": [
      "Testimonial",
      "Star rating",
      "Logo bar",
      "Usage counter"
    ]
  },
  {
    "key": "tone",
    "label": "Tone",
    "type": "select",
    "options": [
      "Confident",
      "Friendly",
      "Professional",
      "Bold"
    ]
  }
] as InputField[],
  definitionLead: "SocialProof Widget — Social proof copy and widgets that make landing pages convert Use it as decision-support: demo mode works without a live key; live runs require configuration. No fabricated metrics, and no claims for SSO/CSV/Slack unless that surface is actually shipped.",
  geoFaq: [
    { q: "What is SocialProof Widget?", a: "Social proof copy and widgets that make landing pages convert" },
    { q: "Who should use SocialProof Widget?", a: "Operators and builders who need a fast first draft or checklist from SocialProof Widget." },
    { q: "Does it work without an API key?", a: "Yes in explicit Demo mode. Live AI requires a configured key." },
    { q: "Does it guarantee outcomes?", a: "No. Outputs are decision-support; you still review before publishing or acting." },
    { q: "Does it include SSO, Slack, or bulk CSV?", a: "Only if those features are implemented in this product build — do not assume them from marketing copy." },
    { q: "Where does data go?", a: "Runs may be stored locally under the product's .data/ boundary; treat demos as ephemeral." },
  ],
  systemPrompt: "You are an expert conversion copywriter. Based on the product and audience, write 3 ready-to-use social proof snippets in the requested style. Keep each under 25 words, be specific and credible \u2014 never invent fake numbers or quotes. Output only the snippets, separated by blank lines.",
  pricing: [
  {
    "tier": "Free",
    "price": "$0",
    "desc": "3 snippets/day, testimonial style"
  },
  {
    "tier": "Starter",
    "price": "$19/mo",
    "desc": "Unlimited snippets, all proof styles, HTML embed export"
  },
  {
    "tier": "Pro",
    "price": "$49/mo",
    "desc": "Unlimited + A/B variants, logo bars, API access"
  }
],
  mock: (inputs: Record<string, string>): string => {
  const p = inputs['product'] || 'your product'
  const a = inputs['audience'] || 'your customers'
  const s = inputs['proofType'] || 'Testimonial'
  const t = inputs['tone'] || 'Confident'
  return `Proof style: ${s}  |  Tone: ${t}

1. "${p} is the only tool ${a} actually stick with — setup took 5 minutes and we saw results the same week."

2. "We replaced three apps with ${p}. Our ${a} notice the difference immediately."

3. "Honestly? ${p} paid for itself before the trial ended. ${a} keep asking how we did it."

---
(Style: ${s} | Tone: ${t} | This is a mock demo. Add OPENAI_API_KEY for real, credible generation.)`
}
}
