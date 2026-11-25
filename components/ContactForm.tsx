'use client';

import { useRouter } from 'next/navigation';

export default function ContactForm() {
  const router = useRouter();
  return <form className="contact-form" aria-label="Contact enquiry" aria-describedby="contact-preview-note"
    onSubmit={(event) => { event.preventDefault(); router.push('/thank-you'); }}>
    <div className="contact-form-grid">
      <label htmlFor="contact-first-name">First Name <span aria-hidden="true">*</span><input id="contact-first-name" name="firstName" autoComplete="given-name" placeholder="(required)" required /></label>
      <label htmlFor="contact-last-name">Last Name <span aria-hidden="true">*</span><input id="contact-last-name" name="lastName" autoComplete="family-name" placeholder="(required)" required /></label>
      <label htmlFor="contact-email">Your Email <span aria-hidden="true">*</span><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="(required)" required /></label>
      <label htmlFor="contact-phone">Phone No:<input id="contact-phone" name="phone" type="tel" autoComplete="tel" /></label>
      <label className="contact-form-full" htmlFor="contact-subject">Subject <span aria-hidden="true">*</span><input id="contact-subject" name="subject" required /></label>
      <label className="contact-form-full" htmlFor="contact-message">Your Message <span aria-hidden="true">*</span><textarea id="contact-message" name="message" rows={6} required /></label>
      <label className="contact-form-full" htmlFor="contact-source">How did you hear about us<input id="contact-source" name="source" /></label>
    </div>
    <button className="button contact-send" type="submit">Send</button>
    <p className="contact-preview-note" id="contact-preview-note">Demo form — messages are not sent yet.</p>
  </form>;
}
