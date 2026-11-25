import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thank you | Ulysses Sailing',
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return <section className="thank-you-page" aria-labelledby="thank-you-title">
    <svg className="thank-you-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="2" />
      <path d="m19 32 9 9 18-19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <h1 id="thank-you-title">Thank you!</h1>
    <p>Thank you for your interest in Ulysses Sailing.</p>
    <p className="contact-preview-note">This is a demo confirmation. Your message has not been sent yet.</p>
    <Link className="button" href="/">Return to homepage</Link>
  </section>;
}
