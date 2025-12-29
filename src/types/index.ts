export type ReferralSource =
    | 'LinkedIn'
    | 'Instagram'
    | 'WhatsApp Group'
    | 'Email Newsletter'
    | 'Friend/Colleague'
    | 'Other';

export interface Webinar {
    id: string;
    slug: string;
    title: string;
    short_description: string;
    description: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    is_online: boolean;
    card_image_url: string;
    banner_image_url: string;
    speaker_name: string;
    speaker_role: string;
    speaker_company: string;
    speaker_image_url: string;
    speaker_social_links: { platform: string; url: string }[];
    key_takeaways: string[];
    is_finished: boolean;
}

export type WebinarInput = Omit<Webinar, 'id'>;

export interface Registration {
    id: string;
    webinarId?: string;
    fullName: string;
    email: string;
    whatsapp: string;
    jobTitle: string;
    institution: string;
    referralSource: ReferralSource;
    createdAt: string;
    hasBeenAddedToGoogleContact?: boolean;
}

export type RegistrationInput = Omit<Registration, 'id' | 'createdAt'>;
