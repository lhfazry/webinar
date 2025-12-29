import { supabase } from "./supabase";
import type { WebinarDetails } from "../types";

export const sendConfirmationEmail = async (
    to: string,
    name: string,
    webinarDetails?: WebinarDetails
): Promise<boolean> => {
    if (!supabase) {
        console.error("Supabase client is not initialized.");
        return false;
    }

    // Debug logging to verify key presence (do not log the actual key in production)
    console.log("Supabase Key Status:", !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? "Present" : "Missing");

    try {
        const { data, error } = await supabase.functions.invoke(
            "send-confirmation-email",
            {
                body: { email: to, name: name, webinar: webinarDetails },
            }
        );

        if (error) {
            console.error("Error invoking send-confirmation-email function:", error);
            return false;
        }

        console.log("Email sent successfully via Edge Function:", data);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
