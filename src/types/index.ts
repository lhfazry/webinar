export type ReferralSource =
    | 'LinkedIn'
    | 'Instagram'
    | 'WhatsApp Group'
    | 'Email Newsletter'
    | 'Friend/Colleague'
    | 'Other';

export interface Registration {
    id: string;
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
