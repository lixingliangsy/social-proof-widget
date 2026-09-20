import React, { FormEvent, useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { PRODUCT } from '../lib/product'

type Lead = {
  id: string
  email: string
  plan: string
  source: string
  note?: string
  createdAt: string
}

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
)

const TRUST = [
  ['AI-powered', 'Real models, real output'],
  ['No credit card', 'Start free, upgrade later'],
  ['Cancel anytime', 'No lock-in, no penalties'],
  ['Private by design', 'Your data stays yours'],
]

const STEPS = [
  ['1', 'Input', 'Describe what you need - a topic, a draft, or a few bullet points.'],
  ['2', 'AI processing', 'Our model works on your input and returns a clean, usable result.'],
  ['3', 'Use it', 'Copy, refine, or iterate with one more prompt. Done.'],
]

const TESTIS = [
  ['JL', 'Jordan Lee', 'Indie maker', '"This tool does exactly what it says - clean output, no fuss. Part of my daily stack now."'],
  ['RK', 'Riya Kapoor', 'Growth lead', '"We shipped faster with this. The AI output is genuinely usable, not a rough draft."'],
  ['TM', 'Tom Meyer', 'Founder', '"Finally an AI tool that respects my time. Results in seconds, easy to refine."'],
]

const FAQS = [
  ['Is there a free plan?', 'Yes. Every product includes a free tier so you can try it with no credit card required.'],
  ['Do I need to install anything?', 'No. It runs in your browser. Open the page and start.'],
  ['Can I cancel or change my plan?', 'Plans are flexible - upgrade, downgrade, or cancel anytime.'],
  ['Is my data private?', 'Your inputs are processed to generate output and are never used to train public models.'],
  ['How do I get help?', 'Reach out via the support page - we reply fast.'],
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [email, setEmail] = useState('')
  const [signupMsg, setSignupMsg] = useState('')

  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [result, setResult] = useState('')
  const [toolBusy, setToolBusy] = useState(false)
  const [toolStatus, setToolStatus] = useState('')

  const [leads, setLeads] = useState<Lead[]>([])
  const [leadFilter, setLeadFilter] = useState('')
  const [leadsBusy, setLeadsBusy] = useState(false)

  function showToast(m: string) {
    setToast(m)
    window.setTimeout(() => setToast(''), 2600)
  }

  async function loadLeads() {
    setLeadsBusy(true)
    try {
      const qs = new URLSearchParams()
      if (leadFilter.trim()) qs.set('q', leadFilter.trim())
      const r = await fetch('/api/leads?' + qs.toString())
      const data = await r.json()
      if (!r.ok || !data.ok) throw new Error(data.error || 'Failed to load leads')
      setLeads(data.leads || [])
    } catch (e: any) {
      showToast(e?.message || 'Load leads failed')
    } finally {
      setLeadsBusy(false)
    }
  }

  useEffect(() => { loadLeads() }, [leadFilter])
  useEffect(() => {
    const accs = Array.from(document.querySelectorAll<HTMLDetailsElement>('details.acc'))
    const onToggle = (ev: Event) => {
      const t = ev.currentTarget as HTMLDetailsElement
      if (t.open) accs.forEach((o) => { if (o !== t) o.open = false })
    }
    accs.forEach((a) => a.addEventListener('toggle', onToggle))
    return () => accs.forEach((a) => a.removeEventListener('toggle', onToggle))
  }, [])

  async function submitLead(plan: 'free' | 'pro' | 'enterprise' | 'sales', source: string, note?: string) {
    const value = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setSignupMsg('Please enter a valid email.')
      return null
    }
    try {
      const r = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, plan, source, note }),
      })
      const data = await r.json()
      if (!r.ok || !data.ok) throw new Error(data.error || 'Signup failed')
      setSignupMsg('You\u2019re in - check your inbox soon. Opening the studio\u2026')
      showToast('Lead saved: ' + value)
      await loadLeads()
      document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' })
      return data.lead as Lead
    } catch (e: any) {
      setSignupMsg(e?.message || 'Signup failed')
      return null
    }
  }

  async function onSignup(e: FormEvent) {
    e.preventDefault()
    await submitLead('free', 'final_cta')
  }

  async function runStudio(e?: FormEvent) {
    e?.preventDefault()
    setToolBusy(true)
    setToolStatus('')
    try {
      const r = await fetch('/api/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, useMock: false }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Tool failed')
      setResult(data.result || '')
      setToolStatus(data.degraded ? 'Degraded demo' : data.mock ? 'Demo mode' : 'Live AI')
    } catch (err: any) {
      setToolStatus(err?.message || 'Tool error')
      setResult('')
    } finally {
      setToolBusy(false)
    }
  }

  async function deleteLeadRow(id: string) {
    try {
      const r = await fetch('/api/leads?id=' + encodeURIComponent(id), { method: 'DELETE' })
      const data = await r.json()
      if (!r.ok || !data.ok) throw new Error(data.error || 'Delete failed')
      showToast('Lead deleted')
      await loadLeads()
    } catch (e: any) {
      showToast(e?.message || 'Delete failed')
    }
  }

  function setVal(k: string, v: string) { setInputs((s) => ({ ...s, [k]: v })) }

  const filteredHint = useMemo(
    () => (leadFilter ? leads.length + ' filtered' : leads.length + ' leads'),
    [leads, leadFilter],
  )

  return (
    <>
      <Head>
        <title>{`${PRODUCT.name} - ${PRODUCT.tagline}`}</title>
        <meta name="description" content={PRODUCT.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header>
        <div className="wrap nav">
          <a href="#top" className="logo"><span className="mark">{PRODUCT.name.charAt(0)}</span>{PRODUCT.name}</a>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#studio">Studio</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="nav-cta">
            <a href="#signup" className="btn btn-ghost">Sign in</a>
            <a href="#signup" className="btn btn-primary">Start free</a>
          </div>
          <button className="burger" aria-label="Menu" onClick={() => setMenuOpen((v) => !v)}><span /><span /><span /></button>
        </div>
        <div className={`mobile-menu${menuOpen ? ' open' : ''}`} id="mobileMenu">
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#studio" onClick={() => setMenuOpen(false)}>Studio</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <a href="#signup" className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => setMenuOpen(false)}>Start free</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">AI toolkit</div>
            <h1>{PRODUCT.tagline}</h1>
            <p className="sub">{PRODUCT.description}</p>
            <div className="hero-cta">
              <a href="#signup" className="btn btn-primary btn-lg">Start free</a>
              <a href="#studio" className="btn btn-ghost btn-lg">&#9654; Watch demo</a>
            </div>
            <p className="hero-note">No credit card required - <strong>free tier included</strong> - cancel anytime</p>
          </div>
          <div className="mock" aria-hidden="true">
            <div className="mock-bar"><i className="r" /><i className="y" /><i className="g" /></div>
            <div className="hero-fake">
              <div className="line w80" /><div className="line w60" /><div className="line w40" />
              <div className="ai">{PRODUCT.name} - working on your request\u2026</div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="wrap trust-grid">
          {TRUST.map(([t, l]) => (<div key={t}><div className="num">{t}</div><div className="lab">{l}</div></div>))}
        </div>
      </section>

      <section id="features">
        <div className="wrap">
          <div className="sec-head"><div className="eyebrow">Why {PRODUCT.name}</div><h2>Everything you need, in one place</h2><p className="lead">A focused toolkit that turns rough input into ready-to-use output.</p></div>
          <div className="feat-grid">
            {PRODUCT.features.map((f) => (
              <div className="feat" key={f}><div className="ico">&#10022;</div><h3>{f}</h3><p>Built into {PRODUCT.name} so you get results without switching tools.</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="steps" id="how">
        <div className="wrap">
          <div className="sec-head"><div className="eyebrow">How it works</div><h2>From idea to result in 3 steps</h2><p className="lead">No setup, no learning curve.</p></div>
          <div className="step-grid">
            {STEPS.map(([n, t, d]) => (<div className="step" key={n}><div className="n">{n}</div><h3>{t}</h3><p>{d}</p></div>))}
          </div>
        </div>
      </section>

      <section className="studio" id="studio">
        <div className="wrap">
          <div className="sec-head"><div className="eyebrow">Live studio</div><h2>{PRODUCT.toolTitle}</h2><p className="lead">Try it now - same page, wired to /api/tool.</p></div>
          <div className="studio-grid">
            <form className="panel" onSubmit={runStudio}>
              <h3>Controls</h3>
              {PRODUCT.inputs.map((f) => (
                <div className="field" key={f.key}>
                  <label>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea value={inputs[f.key] || ''} onChange={(e) => setVal(f.key, e.target.value)} placeholder={f.placeholder || ''} />
                  ) : f.type === 'select' ? (
                    <select value={inputs[f.key] || ''} onChange={(e) => setVal(f.key, e.target.value)}>
                      <option value="">Select\u2026</option>
                      {(f.options || []).map((o) => (<option key={o} value={o}>{o}</option>))}
                    </select>
                  ) : (
                    <input type="text" value={inputs[f.key] || ''} onChange={(e) => setVal(f.key, e.target.value)} placeholder={f.placeholder || ''} />
                  )}
                </div>
              ))}
              <button className="btn btn-primary" type="submit" disabled={toolBusy} style={{ width: '100%' }}>{toolBusy ? 'Generating\u2026' : PRODUCT.ctaLabel}</button>
              {toolStatus ? <p className={`status${toolStatus.includes('fail') || toolStatus.includes('error') ? ' err' : ' ok'}`}>{toolStatus}</p> : null}
            </form>
            <div className="panel">
              <h3>{PRODUCT.resultLabel}</h3>
              <div className="result-box">{result || 'Your AI output will appear here.'}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-ghost" onClick={() => { if (!result) return; navigator.clipboard?.writeText(result); showToast('Copied to clipboard') }}>Copy</button>
                <a className="btn btn-primary" href={`/api/checkout?slug=${PRODUCT.slug}`}>Upgrade - unlock full power</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials">
        <div className="wrap">
          <div className="sec-head"><div className="eyebrow">Loved by makers</div><h2>People ship faster with {PRODUCT.name}</h2></div>
          <div className="test-grid">
            {TESTIS.map(([av, nm, role, q]) => (
              <div className="test" key={nm}>
                <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <q>{q}</q>
                <div className="who"><div className="avatar" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}>{av}</div><div><div className="nm">{nm}</div><div className="role">{role}</div></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="price" id="pricing">
        <div className="wrap">
          <div className="sec-head"><div className="eyebrow">Pricing</div><h2>Simple plans that scale with you</h2><p className="lead">Start free. Upgrade when you\u2019re ready. Checkout via Waffo.</p></div>
          <div className="price-grid">
            {PRODUCT.pricing.map((tier, i) => {
              const isFree = (tier.tier || '').toLowerCase().includes('free')
              const href = isFree ? '#signup' : `/api/checkout?slug=${PRODUCT.slug}`
              const label = isFree ? 'Get started free' : `Start ${tier.tier} checkout`
              const bullets = isFree ? ['Free forever', ...PRODUCT.features.slice(0, 2)] : PRODUCT.features
              const per = (tier.price || '').includes('/mo') ? 'billed monthly' : (tier.price === '$0' ? 'forever' : '')
              return (
                <div className={`plan${i === 1 ? ' featured' : ''}`} key={tier.tier}>
                  {i === 1 ? <div className="badge">Most popular</div> : null}
                  <div className="pname">{tier.tier}</div>
                  <div className="pdesc">{tier.desc}</div>
                  <div className="pprice">{tier.price}<small>{per ? '' : ''}</small></div>
                  {per ? <div className="per">{per}</div> : <div className="per">&nbsp;</div>}
                  <ul>{bullets.map((b) => (<li key={b}><Check />{b}</li>))}</ul>
                  <a href={href} className="btn btn-primary">{label}</a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap">
          <div className="sec-head"><div className="eyebrow">FAQ</div><h2>Frequently asked questions</h2></div>
          <div className="faq">
            {FAQS.map(([q, a], i) => (
              <details className="acc" key={q} open={i === 0}><summary>{q}<span className="plus">+</span></summary><div className="body">{a}</div></details>
            ))}
          </div>
        </div>
      </section>

      <section><div className="final" id="signup">
        <h2>Start using {PRODUCT.name} today</h2>
        <p>Join makers who ship faster with AI. Try it free - no credit card needed.</p>
        <form className="signup" onSubmit={onSignup}>
          <input type="email" placeholder="Enter your email" aria-label="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" className="btn btn-lg">Get started</button>
        </form>
        {signupMsg ? <small style={{ display: 'block', marginTop: 12 }}>{signupMsg}</small> : <small>Private by design - cancel anytime</small>}
      </div></section>

      <section id="leads">
        <div className="wrap">
          <div className="sec-head"><div className="eyebrow">Leads</div><h2>Signup inbox (same page)</h2><p className="lead">Create via the form above - filter - delete. Backed by /api/leads.</p></div>
          <div className="panel">
            <div className="filter-row">
              <input style={{ flex: 1, minWidth: 180, border: '1px solid var(--line)', borderRadius: 999, padding: '10px 14px' }} placeholder="Filter email\u2026" value={leadFilter} onChange={(e) => setLeadFilter(e.target.value)} />
              <button type="button" className="btn btn-ghost" onClick={loadLeads} disabled={leadsBusy}>{leadsBusy ? 'Loading\u2026' : 'Refresh'}</button>
              <span className="status">{filteredHint}</span>
            </div>
            <div className="leads-list">
              {leads.length === 0 ? (<div className="status">No leads yet - submit the signup form.</div>) : leads.map((l) => (
                <div className="lead-row" key={l.id}>
                  <div><strong>{l.email}</strong><div className="status">{l.plan} - {l.source} - {new Date(l.createdAt).toLocaleString()}</div></div>
                  <button type="button" onClick={() => deleteLeadRow(l.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div>
              <div className="logo"><span className="mark">{PRODUCT.name.charAt(0)}</span>{PRODUCT.name}</div>
              <p>{PRODUCT.description}</p>
            </div>
            <div className="foot-col"><h4>Product</h4><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#studio">Studio</a><a href="#faq">FAQ</a></div>
            <div className="foot-col"><h4>Company</h4><a href="#signup">About</a><a href="#testimonials">Customers</a><a href="#leads">Leads</a><a href="#signup">Contact</a></div>
            <div className="foot-col"><h4>Legal</h4><a href="/terms.html">Terms</a><a href="/privacy.html">Privacy</a><a href="/refund-policy.html">Refund</a><a href="/support.html">Support</a></div>
          </div>
          <div className="foot-bot"><span>&copy; 2026 {PRODUCT.name}. All rights reserved.</span><span>Powered by the OPC product factory - TEST checkout via Waffo</span></div>
        </div>
      </footer>

      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </>
  )
}
