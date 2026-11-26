/** Public JSON contract exported by the Ulysses Custom Code WordPress plugin. */
export interface MediaImage {
  id?: number;
  url: string;
  alt?: string | null;
  title?: string;
  width?: number | null;
  height?: number | null;
  srcset?: string | null;
  sizes?: Record<string, { url: string; width: number; height: number }>;
}

export interface RenderedImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  srcSet?: string;
}

export interface NavigationLink {
  label: string;
  href: string;
}

export type SocialPlatform = 'facebook' | 'twitter' | 'youtube' | 'instagram';
export type SocialLinks = Partial<Record<SocialPlatform, string>>;
export type SocialTags = Record<string, string | string[]>;

export interface SocialImage {
  url: string;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
}

export interface FacebookSeo {
  enabled: boolean;
  title?: string | null;
  description?: string | null;
  url?: string | null;
  type?: string | null;
  site_name?: string | null;
  locale?: string | null;
  image?: SocialImage | null;
  tags?: SocialTags;
}

export interface TwitterSeo {
  enabled: boolean;
  card?: string | null;
  title?: string | null;
  description?: string | null;
  site?: string | null;
  creator?: string | null;
  image?: SocialImage | null;
  tags?: SocialTags;
}

export interface PageSeo {
  robots?: { index: boolean; follow: boolean };
  title?: string;
  description?: string;
  canonical_url?: string;
  canonical_path?: string;
  source?: string;
  facebook?: FacebookSeo;
  twitter?: TwitterSeo;
}

export interface Boat {
  boat_image?: MediaImage | null;
  boat_text?: string | null;
  button_text?: string | null;
  button_link?: string | null;
}

export interface BoatDetails {
  image?: MediaImage | null;
  title?: string | null;
  text?: string | null;
}

export interface CmsFields {
  [key: `boat_details_${number}`]: BoatDetails | undefined;
  video_section?: string | null;
  dimensions_title?: string | null;
  dimensions_text?: string | null;
  specifications_title?: string | null;
  specifications_gallery?: MediaImage[];
  more_images_title?: string | null;
  more_images_gallery?: MediaImage[];
  body_background_color?: string | null;
  hero_section?: { hero_image?: MediaImage | null; hero_sub_text?: string | null };
  top_slider_title?: string | null;
  top_slider_sub_text?: string | null;
  top_slider_images?: MediaImage[];
  tab_label_1?: string | null;
  tab_text_1?: string | null;
  tab_label_2?: string | null;
  tab_text_2?: string | null;
  tab_label_3?: string | null;
  tab_text_3?: string | null;
  boat_repeater?: Boat[];
  text_section_1?: string | null;
  text_section_2?: string | null;
  text_section_3?: string | null;
  html_widget?: string | null;
}

export interface CmsSite {
  name: string;
  language?: string;
  wordpress_url: string;
  header_logo?: MediaImage | null;
  footer_logo?: MediaImage | null;
  icon?: MediaImage | null;
  copyright_text?: string;
  espa_pdf_url?: string;
  contact?: { email?: string; secondary_email?: string; phone?: string; address?: string };
  social_links?: SocialLinks;
  frontend?: { base_url: string; domain_name: string };
}

export interface NewsTag {
  id: number; name: string; slug: string; path: string; description?: string; count?: number;
}

export interface CmsPage {
  tags?: NewsTag[];
  id: number;
  title: string;
  is_homepage: boolean;
  modified_at?: string;
  published_at?: string;
  featured_image?: MediaImage | null;
  seo: PageSeo;
  acf?: CmsFields;
  content?: { html: string; raw: string };
}

export interface CmsIndex {
  site: CmsSite;
  pages: { id: number; slug: string; path: string; is_homepage: boolean; file: string }[];
}

export interface HomepageData {
  navigation: NavigationData;
  site: CmsSite;
  page: CmsPage;
}

export interface MenuItem {
  id: number;
  parent_id: number;
  title: string;
  url: string;
  target: string;
  rel: string;
  classes: string[];
  object_type: string;
  object_id: number;
  children: MenuItem[];
}

export interface NavigationData {
  schema_version: number;
  generated_at: string;
  location: string;
  menu: { id: number; name: string; slug: string } | null;
  items: MenuItem[];
}

export interface NewsPostSummary {
  tags?: NewsTag[];
  id: number;
  slug: string;
  path: string;
  title: string;
  excerpt: string;
  published_at: string;
  featured_image?: MediaImage | null;
  file: string;
}

export interface NewsIndex {
  tags?: NewsTag[];
  posts_per_page: number;
  total: number;
  posts: NewsPostSummary[];
}
