-- Link all existing registrations to the specified webinar ID
UPDATE public.registrations
SET webinar_id = '62638215-5b8d-4226-b497-7cd39e3bd912'
WHERE webinar_id IS NULL;
