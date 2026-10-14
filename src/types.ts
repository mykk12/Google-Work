export type ScreenId = 'showcase' | 'gallery' | 'case-study' | 'device-studio' | 'html-importer';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Architecture' | 'Industrial Design' | 'Minimalist Living' | 'Editorial Fashion';
  hotlinkUrl: string;
  author: string;
  authorHandle: string;
  aspectRatio: '16:9' | '4:3' | '3:4' | '1:1';
  dimensions: string;
  exif: {
    camera: string;
    lens: string;
    focalLength: string;
    aperture: string;
    iso: string;
    shutter: string;
  };
  description: string;
  year: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  client: string;
  year: string;
  discipline: string;
  heroImage: string;
  challenge: string;
  solution: string;
  metrics: {
    label: string;
    value: string;
    context: string;
  }[];
  deliverables: string[];
  galleryImages: {
    url: string;
    caption: string;
    tag: string;
  }[];
}

export interface ExtractedHotlink {
  url: string;
  alt: string;
  domain: string;
  tagSnippet: string;
  valid: boolean;
}

export type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'all';
