import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Slideshow from '../../../components/Slideshow';
import TrainingTabs from '../../../components/TrainingTabs';
import { getPageByPath, imageProps, richText } from '../../../lib/cms';
import { pageMetadata } from '../../../lib/metadata';
import type { RenderedImage } from '../../../lib/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPageByPath('/training-schedule/');
  if (!data) return { title: 'Training Schedule | Ulysses Sailing', robots: { index: false } };
  return pageMetadata(data.site, data.page);
}

export default async function TrainingSchedulePage() {
  const data = await getPageByPath('/training-schedule/');
  if (!data) notFound();
  const { site, page } = data;
  const fields = page.acf || {};
  const images = (fields.top_slider_images || [])
    .map((image) => imageProps(image, site, 'Sailing training in Greece'))
    .filter((image): image is RenderedImage => image !== null);
  const tabs = ([1, 2, 3] as const).map((number) => ({
    id: `training-${number}`,
    label: fields[`tab_label_${number}`] || '',
    html: richText(fields[`tab_text_${number}`], site, { preserveLinks: true }),
  })).filter((tab) => tab.label);

  return <>
    <Slideshow images={images} title={fields.top_slider_title || page.title} subtitle={fields.top_slider_sub_text} />
    <section className="training-section" style={{ backgroundColor: fields.body_background_color || '#ffffff' }}>
      <div className="training-introduction" dangerouslySetInnerHTML={{ __html: richText(page.content?.html, site, { preserveLinks: true }) }} />
      <TrainingTabs tabs={tabs} />
    </section>
  </>;
}
