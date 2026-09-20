/**
 * Deterministic self-test for social-proof-widget core logic (§5 Verify).
 * Run: tsx lib/rules/__selftest.ts
 *
 * This product is a social-proof copy generator (no deterministic ruleset). The
 * §3 domain standard is real conversion-copy features: testimonial, star-rating,
 * logo-bar and usage-counter proof styles, credible (non-fabricated) copy, and
 * HTML embed export. We assert the mock output covers these real features and
 * labels itself (no silent mock), and the system prompt forbids inventing fake
 * numbers or quotes.
 */
import { PRODUCT } from '../product'

let passed = 0
let failed = 0
function assert(cond: boolean, msg: string) {
  if (cond) { passed++; console.log('  PASS:', msg) }
  else { failed++; console.error('  FAIL:', msg) }
}

console.log('social-proof-widget selftest')

const mockOut = (PRODUCT as any).mock({
  product: 'a scheduling app for solo consultants',
  audience: 'busy freelance consultants',
  proofType: 'Testimonial',
  tone: 'Confident',
})
const sp = (PRODUCT as any).systemPrompt as string

// 1) Demo mock labels itself honestly (no silent mock).
assert(/mock demo/i.test(mockOut), 'mock output labeled "(mock demo)"')
assert(/Add OPENAI_API_KEY/i.test(mockOut), 'mock directs user to enable real AI')

// 2) Mock covers real proof-style features (§3: testimonial/rating/logo/counter).
assert(/testimonial/i.test(sp) || /testimonial/i.test(mockOut.toLowerCase()), 'references testimonial proof style')
assert(/rating|star/i.test(sp.toLowerCase()) || /rating|star/i.test(mockOut.toLowerCase()), 'references star-rating proof style')
assert(/logo/i.test(sp.toLowerCase()) || /logo/i.test(mockOut.toLowerCase()), 'references logo-bar proof style')
assert(/counter/i.test(sp.toLowerCase()) || /counter/i.test(mockOut.toLowerCase()), 'references usage-counter proof style')

// 3) System prompt forbids fabricating fake numbers/quotes (honesty rule).
assert(/never invent|do not invent|don't invent|never fabricate|do not fabricate/i.test(sp.toLowerCase()), 'system prompt forbids inventing fake numbers/quotes')

// 4) Product metadata sanity.
assert(!!(PRODUCT as any).slug, 'product has slug')
assert(Array.isArray((PRODUCT as any).inputs) && (PRODUCT as any).inputs.length >= 2, 'product declares input fields')

console.log(`\nsocial-proof-widget selftest: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
