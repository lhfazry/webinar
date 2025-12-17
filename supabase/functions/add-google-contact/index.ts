
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'npm:@supabase/supabase-js'
import { google } from 'npm:googleapis'

const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')!
const CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')!
const REFRESH_TOKEN = Deno.env.get('GOOGLE_REFRESH_TOKEN')!
const REDIRECT_URI = "https://developers.google.com/oauthplayground"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { data: registrations, error } = await supabase
            .from('registrations')
            .select('*')
            .is('has_been_added_to_google_contact', false) // Use .is() for boolean check or .eq() depending on version/preference, .eq() usually works for boolean too but explicit check is good. sticking to eq based on user prompt but adapting to safety.
            .eq('has_been_added_to_google_contact', false)
            .limit(10)

        if (error) {
            throw error
        }

        if (!registrations || registrations.length === 0) {
            return new Response(
                JSON.stringify({ message: "No new registrations to add" }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } },
            )
        }

        const auth = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
        );

        auth.setCredentials({
            refresh_token: REFRESH_TOKEN,
        });

        const people = google.people({ version: 'v1', auth });

        for (const registration of registrations) {
            const contact = {
                names: [{
                    givenName: registration.full_name,
                }],
                emailAddresses: [{
                    value: registration.email,
                }],
                phoneNumbers: [{
                    value: registration.whatsapp,
                }],
            }

            await people.people.createContact({
                resource: contact,
            })

            // Update the record as synced
            await supabase
                .from('registrations')
                .update({ has_been_added_to_google_contact: true })
                .eq('id', registration.id)
        }

        return new Response(
            JSON.stringify({ message: `Successfully added ${registrations.length} contacts` }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    } catch (error) {
        console.error(error.message)
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
        )
    }
})
