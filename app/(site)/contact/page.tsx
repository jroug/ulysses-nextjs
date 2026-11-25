import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHero from '../../../components/PageHero';
import ContactForm from '../../../components/ContactForm';
import { getPageByPath, richText } from '../../../lib/cms';
import { pageMetadata } from '../../../lib/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageByPath('/contact/');
  return data ? pageMetadata(data.site, data.page) : { title: 'Contact | Ulysses Sailing', robots: { index: false } };
}

export default async function ContactPage() {
  const data = await getPageByPath('/contact/');
  if (!data) notFound();
  const { page, site } = data;
  const contact = site.contact || {};
  const emails = [contact.email, contact.secondary_email].filter((email): email is string => !!email);
  return <>
    <PageHero page={page} site={site} />
    <section className="contact-page" style={{ backgroundColor: page.acf?.body_background_color || '#ffffff' }}>
      {(emails.length > 0 || contact.phone || contact.address) && <div className="contact-details">
        {emails.map((email, index) => <p key={`${index}-${email}`}>Email: <a href={`mailto:${email}`}>{email}</a></p>)}
        {contact.phone && <p>Phone: <a href={`tel:${contact.phone.replace(/[^+0-9]/g, '')}`}>{contact.phone}</a></p>}
        {contact.address && <p className="contact-address">Address: {contact.address}</p>}
      </div>}
      {page.content?.html && <div className="contact-body" dangerouslySetInnerHTML={{ __html: richText(page.content.html, site, { preserveLinks: true }) }} />}
      <ContactForm />
    </section>
  </>;
}
