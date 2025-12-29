-- Allow public insert for webinars (for admin usage via anon key)
CREATE POLICY "Allow public insert" ON public.webinars FOR INSERT WITH CHECK (true);

-- Allow public update for webinars
CREATE POLICY "Allow public update" ON public.webinars FOR UPDATE USING (true);

-- Allow public delete for webinars
CREATE POLICY "Allow public delete" ON public.webinars FOR DELETE USING (true);
