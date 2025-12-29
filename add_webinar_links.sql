
-- Add link columns to webinars table
ALTER TABLE public.webinars
ADD COLUMN whatsapp_link text,
ADD COLUMN recording_link text,
ADD COLUMN material_link text;
