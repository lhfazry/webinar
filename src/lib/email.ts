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
