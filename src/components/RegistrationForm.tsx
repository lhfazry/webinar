"use client";
import React, { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { DataService } from "../lib/data";
import { sendConfirmationEmail } from "../lib/email";
import { trackEvent } from "../lib/analytics";
import type { RegistrationInput, Webinar } from "../types";

export function RegistrationForm({
    isWaitlist = false,
    webinar,
}: {
    isWaitlist?: boolean;
    webinar?: Webinar | null;
}) {
    const [formData, setFormData] = useState<RegistrationInput>({
        fullName: "",
        email: "",
        whatsapp: "",
        jobTitle: "",
        institution: "",
        referralSource: "LinkedIn",
        webinarId: webinar?.id,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await DataService.addRegistration(formData);

            // Send confirmation email (fire and forget or await doesn't matter much here,
            // but we'll await to ensure it fires before unmount if any)
            try {
                await sendConfirmationEmail(
                    formData.email,
                    formData.fullName,
                    webinar
                        ? {
                              title: webinar.title,
                              speaker: webinar.speaker_name,
                              whatsappLink: webinar.whatsapp_link,
                              recordingLink: webinar.recording_link,
                              materialLink: webinar.material_link,
                              date: new Date(webinar.date).toLocaleDateString(
                                  "en-US",
                                  {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                  }
                              ),
                              time: `${webinar.start_time} - ${webinar.end_time}`,
                          }
                        : undefined
                );
            } catch (emailError) {
                console.error("Failed to send email silently:", emailError);
                // Don't fail the registration if email fails
            }

            setIsSuccess(true);
            trackEvent("generate_lead", {
                category: "Registration",
                label: formData.jobTitle,
                value: 1,
                webinar_id: webinar?.id,
                webinar_title: webinar?.title,
            });
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center h-full min-h-[400px]">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                    {isWaitlist
                        ? "You're on the list!"
                        : "Registration Complete!"}
                </h3>
                <p className="text-gray-600">
                    {isWaitlist
                        ? "Thank you for joining the waitlist. We will notify you as soon as the next webinar is scheduled."
                        : "Thank you for registering. Please join our WhatsApp Group for updates and discussion."}
                </p>

                {!isWaitlist && (
                    <a
                        href="https://chat.whatsapp.com/D5RFqx605NHD1DISRGDgNs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                    >
                        <span>Join WhatsApp Group</span>
                    </a>
                )}

                <button
                    onClick={() => setIsSuccess(false)}
                    className="text-primary-600 font-medium hover:text-primary-700 underline text-sm mt-4"
                >
                    {isWaitlist
                        ? "Join for another person"
                        : "Register another person"}
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Full Name
                </label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    value={formData.fullName}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label
                    htmlFor="whatsapp"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    WhatsApp Number
                </label>
                <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    value={formData.whatsapp}
                    onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="jobTitle"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Job Title
                    </label>
                    <select
                        id="jobTitle"
                        name="jobTitle"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                        value={formData.jobTitle}
                        onChange={handleChange}
                    >
                        <option value="">Select Job Title</option>
                        <option value="AI Engineer">AI Engineer</option>
                        <option value="Machine Learning Engineer">
                            Machine Learning Engineer
                        </option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="Data Analyst">Data Analyst</option>
                        <option value="Computer Vision Engineer">
                            Computer Vision Engineer
                        </option>
                        <option value="NLP Engineer">NLP Engineer</option>
                        <option value="Software Engineer">
                            Software Engineer
                        </option>
                        <option value="Student / Researcher">
                            Student / Researcher
                        </option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label
                        htmlFor="institution"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Institution
                    </label>
                    <input
                        type="text"
                        id="institution"
                        name="institution"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        value={formData.institution}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="referralSource"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Where did you hear about us?
                </label>
                <select
                    id="referralSource"
                    name="referralSource"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                    value={formData.referralSource}
                    onChange={handleChange}
                >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="WhatsApp Group">WhatsApp Group</option>
                    <option value="Email Newsletter">Email Newsletter</option>
                    <option value="Friend/Colleague">Friend/Colleague</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {isWaitlist ? "Joining Waitlist..." : "Registering..."}
                    </>
                ) : isWaitlist ? (
                    "Join Waitlist"
                ) : (
                    "Secure Your Spot"
                )}
            </button>
        </form>
    );
}
