
-- Create webinars table
CREATE TABLE public.webinars (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  slug text NOT NULL,
  title text NOT NULL,
  short_description text,
  description text,
  date date,
  start_time text,
  end_time text,
  location text,
  is_online boolean DEFAULT true,
  card_image_url text,
  banner_image_url text,
  speaker_name text,
  speaker_role text,
  speaker_company text,
  speaker_image_url text,
  speaker_social_links jsonb,
  key_takeaways text[],
  is_finished boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone ('utc'::text, now()),
  CONSTRAINT webinars_pkey PRIMARY KEY (id),
  CONSTRAINT webinars_slug_key UNIQUE (slug)
);

-- Enable RLS for webinars
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;

-- Allow public read for webinars
CREATE POLICY "Allow public read" ON public.webinars FOR SELECT USING (true);

-- Add webinar_id to registrations
ALTER TABLE public.registrations ADD COLUMN webinar_id uuid REFERENCES public.webinars(id);

-- Dummy Data for Webinars
INSERT INTO public.webinars (
    slug,
    title,
    short_description,
    description,
    date,
    start_time,
    end_time,
    location,
    is_online,
    card_image_url,
    banner_image_url,
    speaker_name,
    speaker_role,
    speaker_company,
    speaker_image_url,
    speaker_social_links,
    key_takeaways,
    is_finished
) VALUES (
    'vit-vs-cnn',
    'ViT vs CNN: The Clash of Architectures',
    'Is Convolution Dead? Join us as we dive deep into the Rise of Attention mechanisms in Computer Vision.',
    'Is Convolution Dead? Join us as we dive deep into the Rise of Attention mechanisms in Computer Vision and compare them with traditional CNNs.',
    '2025-12-22',
    '20:00',
    '22:00',
    'Online via Google Meet',
    true,
    '/assets/card-vit.webp',
    '/assets/banner-vit.webp',
    'Lhuqita Fazry',
    'Founder',
    'Rumah Coding',
    '/assets/speaker.webp',
    '[{"platform": "LinkedIn", "url": "https://www.linkedin.com/in/lhuqita-fazry/"}, {"platform": "Facebook", "url": "https://www.facebook.com/lhfazry"}]',
    ARRAY['The Decade of Convolutions', 'An Image is Worth 16x16 Words', 'Patch Embeddings', 'Inductive Bias vs. General Purpose', 'Implementation Walkthrough'],
    true
), (
    'modern-web-dev',
    'Modern Web Development 2026',
    'Explore the latest trends in web development, from React server components to edge computing.',
    'Join us for a comprehensive look at the state of web development in 2026. We will cover the newest frameworks, tools, and best practices.',
    '2026-01-15',
    '19:00',
    '21:00',
    'Online via Zoom',
    true,
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    'Sarah Jenkins',
    'Senior Frontend Engineer',
    'TechCorp',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
     '[{"platform": "Twitter", "url": "https://twitter.com/sarahjenkins"}]',
    ARRAY['React Server Components', 'Edge Computing', 'CSS Container Queries', 'Web Assembly'],
    false
);
