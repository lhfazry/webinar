import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    // Manual Authentication Check
    // We expect the client to send "Bearer <SUPABASE_ANON_KEY>"
    const authHeader = req.headers.get("Authorization");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!authHeader || (anonKey && !authHeader.includes(anonKey))) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    try {
        const { email, name } = await req.json();
        const token = Deno.env.get("MAILTRAP_API_TOKEN");
        const senderEmail = Deno.env.get("MAILTRAP_SENDER_EMAIL") || "hello@demomailtrap.com";

        if (!token) {
            throw new Error("MAILTRAP_API_TOKEN is not set");
        }

        const webinarDetails = {
            title: "ViT vs CNN: The Clash of Architectures",
            speaker: "Lhuqita Fazry",
            whatsappLink: "https://chat.whatsapp.com/D5RFqx605NHD1DISRGDgNs",
        };

        const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You're on the waitlist!</title>
        <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin-top: 40px; margin-bottom: 40px; }
            .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 30px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; margin-bottom: 10px; }
            .header p { margin: 0; opacity: 0.9; font-size: 16px; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 18px; margin-bottom: 24px; color: #111827; }
            .card { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px; }
            .card-title { font-weight: 600; font-size: 16px; margin-bottom: 16px; color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; }
            .detail-row { display: flex; margin-bottom: 12px; }
            .detail-label { width: 100px; font-weight: 500; color: #6b7280; font-size: 14px; }
            .detail-value { flex: 1; font-weight: 600; color: #111827; font-size: 14px; }
            .cta-section { text-align: center; margin-top: 32px; margin-bottom: 32px; }
            .button { background-color: #25D366; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 211, 102, 0.3); transition: background-color 0.2s; }
            .button:hover { background-color: #128c7e; }
            .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
            .footer a { color: #4f46e5; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>You're on the list!</h1>
                <p>We've added you to the waitlist for our next event</p>
            </div>
            
            <div class="content">
                <p class="greeting">Hi ${name},</p>
                <p>Thanks for your interest in "<strong>${webinarDetails.title}</strong>". The live session has concluded, but don't worry—we've added you to our priority notification list.</p>
                <p>You will be the first to know when we announce our next technical deep dive or if we release recording materials.</p>
                
                <p style="text-align: center; margin-bottom: 16px; color: #4b5563;">
                    In the meantime, join our community to discuss with other engineers and researchers.
                </p>
                
                <div class="cta-section">
                    <a href="${webinarDetails.whatsappLink}" class="button">Join WhatsApp Group</a>
                </div>

                <p style="font-size: 14px; text-align: center; color: #9ca3af;">
                    If the button doesn't work, you can copy this link:<br>
                    <a href="${webinarDetails.whatsappLink}" style="color: #4f46e5; word-break: break-all;">${webinarDetails.whatsappLink}</a>
                </p>
            </div>
            
            <div class="footer">
                <p>&copy; 2025 Rumah Coding. All rights reserved.</p>
                <p>You received this email because you signed up for the waitlist.</p>
            </div>
        </div>
    </body>
    </html>
    `;

        const response = await fetch("https://send.api.mailtrap.io/api/send", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: {
                    email: senderEmail,
                    name: "Rumah Coding"
                },
                to: [
                    {
                        email: email,
                        name: name
                    }
                ],
                subject: `Waitlist Confirmed: ${webinarDetails.title}`,
                html: htmlContent,
                category: "Waitlist Confirmation"
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to send email to Mailtrap:", response.status, errorData);
            throw new Error(`Failed to send email: ${response.status}`);
        }

        return new Response(
            JSON.stringify({ message: "Email sent successfully" }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200
            }
        );

    } catch (error) {
        console.error("Error in send-confirmation-email function:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400
            }
        );
    }
});
