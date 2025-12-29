import Link from "next/link";
import { DataService } from "@/lib/data";
import { Calendar, Clock, ArrowRight } from "lucide-react";

// Revalidate every hour
export const revalidate = 3600;

export default async function Home() {
    const webinars = await DataService.getWebinars();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary-900 to-primary-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-500 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-400 blur-3xl"></div>
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <img
                        src="/assets/logo.webp"
                        alt="Rumah Coding"
                        className="h-12 w-auto mb-8 bg-white/10 p-2 rounded-xl backdrop-blur-sm"
                    />
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Technical Webinar Series
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
                        Join our expert-led sessions on the latest technologies,
                        architectures, and best practices in software
                        engineering.
                    </p>
                </div>
            </div>

            {/* Webinar Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {webinars.map((webinar) => (
                        <Link
                            key={webinar.id}
                            href={`/webinar/${webinar.slug}`}
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full ring-1 ring-gray-900/5"
                        >
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                <img
                                    src={
                                        webinar.card_image_url ||
                                        "/assets/card-placeholder.webp"
                                    }
                                    alt={webinar.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {webinar.is_finished ? (
                                    <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center">
                                        Finished
                                    </div>
                                ) : (
                                    <div className="absolute top-4 right-4 bg-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center">
                                        Upcoming
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                                    {webinar.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                                    {webinar.short_description}
                                </p>

                                <div className="space-y-3 pt-6 border-t border-gray-100 mt-auto">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                                        {new Date(
                                            webinar.date
                                        ).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="w-4 h-4 mr-2 text-primary-500" />
                                        {webinar.start_time} -{" "}
                                        {webinar.end_time}
                                    </div>
                                    <div className="flex items-center text-sm text-primary-600 font-bold group-hover:translate-x-1 transition-transform pt-2">
                                        View Details
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {webinars.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">
                            No webinars found at the moment.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
