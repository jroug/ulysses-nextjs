import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHero from '../../../components/PageHero';
import ContactForm from '../../../components/ContactForm';
import { getPageByPath, richText } from '../../../lib/cms';
import { pageMetadata } from '../../../lib/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageByPath('/book-now/');
  return data ? pageMetadata(data.site, data.page) : { title: 'Book Now | Ulysses Sailing', robots: { index: false } };
}

export default async function BookNowPage() {
  const data = await getPageByPath('/book-now/');
  if (!data) notFound();
  const { page, site } = data;
  const contact = site.contact || {};
  const emails = [contact.email, contact.secondary_email].filter((email): email is string => !!email);
  const phoneLink = contact.phone ? `tel:${contact.phone.replace(/[^+0-9]/g, '')}` : null;

  return <div className="book-now-page">
    <PageHero page={page} site={site} />
    <section className="book-now-content" style={{ backgroundColor: page.acf?.body_background_color || '#ffffff' }}>
      {page.content?.html && <div className="book-now-introduction" dangerouslySetInnerHTML={{ __html: richText(page.content.html, site, { preserveLinks: true }) }} />}
      {phoneLink && <div className="book-now-call"><a className="button book-now-call-button" href={phoneLink}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
        Call Now
      </a></div>}
      {(emails.length > 0 || contact.phone || contact.address) && <div className="book-now-contact-details">
        {emails.length > 0 && <div>
          <h2>Email</h2>
          {emails.map((email, index) => <a key={`${index}-${email}`} href={`mailto:${email}`}>{email}</a>)}
        </div>}
        {phoneLink && <div><h2>Phone</h2><a href={phoneLink}>{contact.phone}</a></div>}
        {contact.address && <div><h2>Address</h2><p className="contact-address">{contact.address}</p></div>}
      </div>}
      <ContactForm />
    </section>
  </div>;
}
