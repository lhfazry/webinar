import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Calendar,
    Clock,
    MapPin,
    CheckCircle2,
    Linkedin,
    Facebook,
    ArrowLeft,
    Share2,
} from "lucide-react";
import { RegistrationForm } from "../components/RegistrationForm";
import { trackEvent } from "../lib/analytics";
import { DataService } from "../lib/data";
import { useSEO } from "../hooks/useSEO";
import type { Webinar } from "../types";

export default function LandingPage() {
    const { slug } = useParams<{ slug: string }>();
    const [webinar, setWebinar] = useState<Webinar | null>(null);
    const [loading, setLoading] = useState(true);

    useSEO({
        title: webinar
            ? `${webinar.title} | Rumah Coding`
            : "Loading... | Rumah Coding",
        description: webinar?.short_description || "",
        image: webinar
            ? webinar.banner_image_url || webinar.card_image_url
            : undefined,
        url: window.location.href,
    });

    useEffect(() => {
        const loadWebinar = async () => {
            if (slug) {
                const data = await DataService.getWebinarBySlug(slug);
                setWebinar(data);
            }
            setLoading(false);
        };
        loadWebinar();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!webinar) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <h2 className="text-2xl font-bold mb-4">Webinar Not Found</h2>
                <Link to="/" className="text-primary-600 hover:underline">
                    Back to Webinars
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white relative">
            <Link
                to="/"
                className="absolute top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
            >
                <ArrowLeft className="w-6 h-6" />
            </Link>

            {/* Left Column: Content */}
            <div
                className={`flex-1 bg-gradient-to-br from-primary-900 to-primary-950 p-8 lg:p-16 flex flex-col justify-center text-white relative overflow-hidden ${
                    webinar.is_finished ? "grayscale-0" : ""
                }`}
            >
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-500 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-400 blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-xl mx-auto lg:mx-0 pt-10 lg:pt-0">
                    <div className="flex items-center space-x-4 mb-8">
                        <img
                            src="/assets/logo.webp"
                            alt="Rumah Coding"
                            className="h-10 w-auto p-1 rounded-lg backdrop-blur-sm"
                        />
                        <div className="h-6 w-px bg-white/20"></div>
                        <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-blue-200 text-sm font-medium backdrop-blur-sm border border-white/10">
                            Technical Webinar Series
                        </div>
                        {webinar.is_finished && (
                            <div className="inline-block px-3 py-1 bg-red-500/20 text-red-200 rounded-full text-sm font-medium border border-red-500/30">
                                Event Finished
                            </div>
                        )}
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight">
                        {webinar.title}
                    </h1>

                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        {webinar.description}
                    </p>

                    <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {webinar.key_takeaways &&
                            webinar.key_takeaways.map((point, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-2 text-blue-100/90"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-secondary-500 min-w-[20px] mt-1" />
                                    <span>{point}</span>
                                </div>
                            ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 mb-10 w-fit">
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 mr-3 text-secondary-500" />
                            <div>
                                <p className="text-xs text-blue-200 font-medium">
                                    Date
                                </p>
                                <p
                                    className={`text-sm font-semibold text-white ${
                                        webinar.is_finished
                                            ? "line-through opacity-70"
                                            : ""
                                    }`}
                                >
                                    {new Date(webinar.date).toLocaleDateString(
                                        "en-US",
                                        {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="hidden md:block w-px h-8 bg-white/20"></div>

                        <div className="flex items-center">
                            <Clock className="w-5 h-5 mr-3 text-secondary-500" />
                            <div>
                                <p className="text-xs text-blue-200 font-medium">
                                    Time
                                </p>
                                <p
                                    className={`text-sm font-semibold text-white ${
                                        webinar.is_finished
                                            ? "line-through opacity-70"
                                            : ""
                                    }`}
                                >
                                    {webinar.start_time} - {webinar.end_time}
                                </p>
                            </div>
                        </div>

                        <div className="hidden md:block w-px h-8 bg-white/20"></div>

                        <div className="flex items-center">
                            <MapPin className="w-5 h-5 mr-3 text-secondary-500" />
                            <div>
                                <p className="text-xs text-blue-200 font-medium">
                                    Location
                                </p>
                                <p className="text-sm font-semibold text-white">
                                    {webinar.location}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-10 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm w-full md:w-fit">
                        <img
                            src={
                                webinar.speaker_image_url ||
                                "/assets/speaker.webp"
                            }
                            alt={webinar.speaker_name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-secondary-500"
                        />
                        <div>
                            <p className="font-semibold text-lg text-white">
                                {webinar.speaker_name}
                            </p>
                            <p className="text-sm text-gray-400 mb-2">
                                {webinar.speaker_role} at{" "}
                                {webinar.speaker_company}
                            </p>
                            {webinar.speaker_social_links && (
                                <div className="flex items-center space-x-3">
                                    {webinar.speaker_social_links.map(
                                        (link, idx) => {
                                            let Icon = Share2;
                                            if (link.platform === "LinkedIn")
                                                Icon = Linkedin;
                                            else if (
                                                link.platform === "Facebook"
                                            )
                                                Icon = Facebook;

                                            return (
                                                <a
                                                    key={idx}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                                    onClick={() =>
                                                        trackEvent(
                                                            "social_click",
                                                            {
                                                                category:
                                                                    "Social",
                                                                label: link.platform,
                                                            }
                                                        )
                                                    }
                                                >
                                                    <Icon className="w-4 h-4" />
                                                </a>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-16 bg-gray-50 pt-20 lg:pt-16">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {webinar.is_finished
                                ? "Watch Recording & Join Waitlist"
                                : "Reserve Your Seat"}
                        </h2>
                        <p className="text-gray-600">
                            {webinar.is_finished
                                ? "This event has ended. Register below to get the recording link via email and be notified about our next technical deep dive."
                                : "Limited spots available for this live session."}
                        </p>
                    </div>

                    <RegistrationForm
                        isWaitlist={webinar.is_finished}
                        webinarId={webinar.id}
                    />
                </div>
            </div>
        </div>
    );
}
