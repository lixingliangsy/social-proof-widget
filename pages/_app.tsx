import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import ChatWidget from '../components/ChatWidget'
import { SUPPORT } from '../lib/support.config'

export default function App({ Component, pageProps }: AppProps) {
  return       <><Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SocialProof Widget" />
        <meta property="og:description" content="Generate credible, ready-to-paste testimonial snippets, rating bars, and usage counters for your landing page in seconds \u2014 no designer or copywriter needed." />
        <meta property="og:url" content="https://social-proof-widget.lxsaihub.com/" />
        <meta property="og:image" content="https://social-proof-widget.lxsaihub.com/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SocialProof Widget" />
        <meta name="twitter:description" content="Generate credible, ready-to-paste testimonial snippets, rating bars, and usage counters for your landing page in seconds \u2014 no designer or copywriter needed." />
        <meta name="twitter:image" content="https://social-proof-widget.lxsaihub.com/og.png" />
                                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: '{"@context":"https://schema.org","@type":"SoftwareApplication","name":"SocialProof Widget","url":"https://social-proof-widget.lxsaihub.com/","description":"Generate credible, ready-to-paste testimonial snippets, rating bars, and usage counters for your landing page in seconds \\u2014 no designer or copywriter needed.","applicationCategory":"BusinessApplication","operatingSystem":"Web","offers":{"@type":"Offer","priceCurrency":"USD","price":"0","availability":"https://schema.org/OnlineOnly"}}' }} />
      </Head>
      <Component {...pageProps} />
      <ChatWidget productName={SUPPORT.productName} brandColor={SUPPORT.brandColor} sessionKeyPrefix={SUPPORT.productSlug} /></>
}
