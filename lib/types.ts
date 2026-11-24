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

export interface CmsFields {
  hero_section?: { hero_image?: MediaImage | null; hero_sub_text?: string | null };
  home_slider_title?: string | null;
  home_slider_sub_title?: string | null;
  home_slider?: MediaImage[];
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
  social_links?: SocialLinks;
  frontend?: { base_url: string; domain_name: string };
}

export interface CmsPage {
  id: number;
  title: string;
  is_homepage: boolean;
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
