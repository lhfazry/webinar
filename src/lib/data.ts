import type { Registration, RegistrationInput, Webinar, WebinarInput } from '../types';

import { supabase } from './supabase';

const STORAGE_KEY = 'webinar_registrations';

export const DataService = {
    getRegistrations: async (
        page: number = 1,
        limit: number = 10,
        search: string = "",
        filter: string = "All",
        roleFilter: string = "All",
        webinarId: string = "All"
    ): Promise<{ data: Registration[]; count: number }> => {
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        if (supabase) {
            let query = supabase
                .from("registrations")
                .select("*", { count: "exact" })
                .order("created_at", { ascending: false })
                .range(from, to);

            if (search) {
                query = query.or(
                    `full_name.ilike.%${search}%,email.ilike.%${search}%`
                );
            }

            if (filter !== "All") {
                query = query.eq("referral_source", filter);
            }

            if (roleFilter !== "All") {
                query = query.eq("job_title", roleFilter);
            }

            if (webinarId !== "All") {
                query = query.eq("webinar_id", webinarId);
            }

            const { data, error, count } = await query;

            if (error) {
                console.error("Error fetching registrations:", error);
                return { data: [], count: 0 };
            }

            return {
                data: data.map((item: any) => ({
                    id: item.id,
                    fullName: item.full_name,
                    email: item.email,
                    whatsapp: item.whatsapp,
                    jobTitle: item.job_title,
                    institution: item.institution,
                    referralSource: item.referral_source,
                    createdAt: item.created_at,
                    hasBeenAddedToGoogleContact: item.has_been_added_to_google_contact,
                    webinarId: item.webinar_id
                })),
                count: count || 0,
            };
        }

        const data = localStorage.getItem(STORAGE_KEY);
        let registrations: Registration[] = data ? JSON.parse(data) : [];

        // Filter
        if (search) {
            const lowerSearch = search.toLowerCase();
            registrations = registrations.filter(
                (r) =>
                    r.fullName.toLowerCase().includes(lowerSearch) ||
                    r.email.toLowerCase().includes(lowerSearch)
            );
        }

        if (filter !== "All") {
            registrations = registrations.filter(
                (r) => r.referralSource === filter
            );
        }

        if (roleFilter !== "All") {
            registrations = registrations.filter(
                (r) => r.jobTitle === roleFilter
            );
        }

        if (webinarId !== "All") {
            registrations = registrations.filter(
                (r) => r.webinarId === webinarId
            );
        }

        const totalCount = registrations.length;
        const paginatedData = registrations.slice(from, to + 1);

        return { data: paginatedData, count: totalCount };
    },

    addRegistration: async (input: RegistrationInput): Promise<Registration | null> => {
        const newRegistration = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...input,
        };

        if (supabase) {
            const { data, error } = await supabase
                .from('registrations')
                .insert([{
                    full_name: input.fullName,
                    email: input.email,
                    whatsapp: input.whatsapp,
                    job_title: input.jobTitle,
                    institution: input.institution,
                    referral_source: input.referralSource,
                    created_at: new Date().toISOString(),
                    webinar_id: input.webinarId
                }])
                .select()
                .single();

            if (error) {
                console.error('Error adding registration:', error);
                throw error;
            }

            return {
                id: data.id,
                fullName: data.full_name,
                email: data.email,
                whatsapp: data.whatsapp,
                jobTitle: data.job_title,
                institution: data.institution,
                referralSource: data.referral_source,
                createdAt: data.created_at,
                webinarId: data.webinar_id
            };
        }

        const registrations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        registrations.push(newRegistration);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));

        return newRegistration;
    },

    deleteRegistration: async (id: string): Promise<void> => {
        if (supabase) {
            const { error } = await supabase
                .from('registrations')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting registration:', error);
                throw error;
            }
            return;
        }

        const registrations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const filtered = registrations.filter((r: Registration) => r.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    getStatistics: async (
        search: string = "",
        filter: string = "All",
        roleFilter: string = "All",
        webinarId: string = "All"
    ): Promise<{
        jobTitles: Record<string, number>;
        referralSources: Record<string, number>;
    }> => {
        let registrations: any[] = [];

        if (supabase) {


            // Re-constructing query properly
            let statsQuery = supabase
                .from("registrations")
                .select("job_title, referral_source, full_name, email, webinar_id");

            if (search) {
                statsQuery = statsQuery.or(
                    `full_name.ilike.%${search}%,email.ilike.%${search}%`
                );
            }

            if (filter !== "All") {
                statsQuery = statsQuery.eq("referral_source", filter);
            }

            if (roleFilter !== "All") {
                statsQuery = statsQuery.eq("job_title", roleFilter);
            }

            if (webinarId !== "All") {
                statsQuery = statsQuery.eq("webinar_id", webinarId);
            }

            const { data, error } = await statsQuery;

            if (error) {
                console.error("Error fetching statistics:", error);
            } else {
                registrations = data || [];
            }
        } else {
            const data = localStorage.getItem(STORAGE_KEY);
            registrations = data ? JSON.parse(data) : [];

            // Apply Filters for LocalStorage
            if (search) {
                const lowerSearch = search.toLowerCase();
                registrations = registrations.filter(
                    (r) =>
                        (r.fullName || r.full_name || "").toLowerCase().includes(lowerSearch) ||
                        (r.email || "").toLowerCase().includes(lowerSearch)
                );
            }

            if (filter !== "All") {
                registrations = registrations.filter(
                    (r) => (r.referralSource || r.referral_source) === filter
                );
            }

            if (roleFilter !== "All") {
                registrations = registrations.filter(
                    (r) => (r.jobTitle || r.job_title) === roleFilter
                );
            }

            if (webinarId !== "All") {
                registrations = registrations.filter(
                    (r) => (r.webinarId || r.webinar_id) === webinarId
                );
            }
        }

        const jobTitles: Record<string, number> = {};
        const referralSources: Record<string, number> = {};

        registrations.forEach((r) => {
            const jobTitle = r.job_title || r.jobTitle || "Unknown";
            const referralSource =
                r.referral_source || r.referralSource || "Unknown";

            jobTitles[jobTitle] = (jobTitles[jobTitle] || 0) + 1;
            referralSources[referralSource] =
                (referralSources[referralSource] || 0) + 1;
        });

        return { jobTitles, referralSources };
    },

    syncGoogleContacts: async (): Promise<{ message?: string; error?: string }> => {
        if (supabase) {
            const { data, error } = await supabase.functions.invoke(
                "add-google-contact"
            );
            if (error) {
                console.error("Error syncing contacts:", error);
                return { error: error.message };
            }
            return data;
        }
        return { error: "Supabase client not initialized" };
    },

    getWebinars: async (): Promise<Webinar[]> => {
        if (supabase) {
            const { data, error } = await supabase
                .from("webinars")
                .select("*")
                .order("date", { ascending: false });

            if (error) {
                console.error("Error fetching webinars:", error);
                return [];
            }

            return data || [];
        }
        // Fallback or mock data if no supabase
        return [];
    },

    getWebinarBySlug: async (slug: string): Promise<Webinar | null> => {
        if (supabase) {
            const { data, error } = await supabase
                .from("webinars")
                .select("*")
                .eq("slug", slug)
                .single();

            if (error) {
                console.error("Error fetching webinar:", error);
                return null;
            }

            return data;
        }
        return null;
        return null;
    },

    addWebinar: async (input: WebinarInput): Promise<Webinar | null> => {
        if (supabase) {
            const { data, error } = await supabase
                .from("webinars")
                .insert([input])
                .select()
                .single();

            if (error) {
                console.error("Error adding webinar:", error);
                throw error;
            }
            return data;
        }
        return null;
    },

    updateWebinar: async (id: string, input: WebinarInput): Promise<Webinar | null> => {
        if (supabase) {
            const { data, error } = await supabase
                .from("webinars")
                .update(input)
                .eq("id", id)
                .select()
                .single();

            if (error) {
                console.error("Error updating webinar:", error);
                throw error;
            }
            return data;
        }
        return null;
    },

    deleteWebinar: async (id: string): Promise<void> => {
        if (supabase) {
            const { error } = await supabase
                .from("webinars")
                .delete()
                .eq("id", id);

            if (error) {
                console.error("Error deleting webinar:", error);
                throw error;
            }
        }
    }
};
