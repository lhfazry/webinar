import {
    Calendar,
    Clock,
    MapPin,
    CheckCircle2,
    Linkedin,
    Facebook,
} from "lucide-react";
import { RegistrationForm } from "../components/RegistrationForm";
import { trackEvent } from "../lib/analytics";

export default function LandingPage() {
    const isWebinarFinished = true;

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Left Column: Content */}
            <div
                className={`flex-1 bg-gradient-to-br from-primary-900 to-primary-950 p-8 lg:p-16 flex flex-col justify-center text-white relative overflow-hidden ${
                    isWebinarFinished ? "grayscale-0" : ""
                }`}
            >
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-500 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-400 blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-xl mx-auto lg:mx-0">
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
                        {isWebinarFinished && (
                            <div className="inline-block px-3 py-1 bg-red-500/20 text-red-200 rounded-full text-sm font-medium border border-red-500/30">
                                Event Finished
                            </div>
                        )}
                    </div>

                    <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight">
                        ViT <span className="text-secondary-500">vs</span> CNN:
                        <br />
                        The Clash of Architectures
                    </h1>

                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Is Convolution Dead? Join us as we dive deep into the
                        Rise of Attention mechanisms in Computer Vision and
                        compare them with traditional CNNs.
                    </p>

                    <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            "The Decade of Convolutions",
                            "An Image is Worth 16x16 Words",
                            "Patch Embeddings",
                            "Inductive Bias vs. General Purpose",
                            "Implementation Walkthrough",
                        ].map((point, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2 text-blue-100/90"
                            >
                                <CheckCircle2 className="w-5 h-5 text-secondary-500" />
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
                                <p className="text-sm font-semibold text-white/70 line-through">
                                    Monday, 22 Dec 2025
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
                                <p className="text-sm font-semibold text-white/70 line-through">
                                    20:00 - 22:00
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
                                    Online via Google Meet
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-10 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm w-fit">
                        <img
                            src="/assets/speaker.webp"
                            alt="Lhuqita Fazry"
                            className="w-16 h-16 rounded-full object-cover border-2 border-secondary-500"
                        />
                        <div>
                            <p className="font-semibold text-lg text-white">
                                Lhuqita Fazry
                            </p>
                            <p className="text-sm text-gray-400 mb-2">
                                Founder Rumah Coding
                            </p>
                            <div className="flex items-center space-x-3">
                                <a
                                    href="https://www.linkedin.com/in/lhuqita-fazry/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                    onClick={() =>
                                        trackEvent("social_click", {
                                            category: "Social",
                                            label: "LinkedIn",
                                        })
                                    }
                                >
                                    <Linkedin className="w-4 h-4" />
                                </a>
                                <a
                                    href="https://www.facebook.com/lhfazry"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                    onClick={() =>
                                        trackEvent("social_click", {
                                            category: "Social",
                                            label: "Facebook",
                                        })
                                    }
                                >
                                    <Facebook className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-16 bg-gray-50">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {isWebinarFinished
                                ? "Join Waitlist for Next Webinar"
                                : "Reserve Your Seat"}
                        </h2>
                        <p className="text-gray-600">
                            {isWebinarFinished
                                ? "This event has ended. Fill out the form below to get notified about our next technical deep dive."
                                : "Limited spots available for this live session."}
                        </p>
                    </div>

                    <RegistrationForm isWaitlist={isWebinarFinished} />
                </div>
            </div>
        </div>
    );
}
