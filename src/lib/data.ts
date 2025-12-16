import type { Registration, RegistrationInput } from '../types';

import { supabase } from './supabase';

const STORAGE_KEY = 'webinar_registrations';

export const DataService = {
    getRegistrations: async (): Promise<Registration[]> => {
        if (supabase) {
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching registrations:', error);
                return [];
            }

            return data.map((item: any) => ({
                id: item.id,
                fullName: item.full_name,
                email: item.email,
                whatsapp: item.whatsapp,
                jobTitle: item.job_title,
                institution: item.institution,
                referralSource: item.referral_source,
                createdAt: item.created_at
            }));
        }

        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
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
                    created_at: new Date().toISOString()
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
                createdAt: data.created_at
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
    }
};
