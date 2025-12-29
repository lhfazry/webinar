import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataService } from "../lib/data";
import type { Webinar } from "../types";
import { useSEO } from "../hooks/useSEO";
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";

export default function AdminWebinars() {
    const navigate = useNavigate();
    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [loading, setLoading] = useState(true);

    useSEO({
        title: "Manage Webinars | Rumah Coding",
        description: "Admin panel for creating and managing webinars.",
    });

    useEffect(() => {
        // Check auth
        if (!localStorage.getItem("admin_auth")) {
            navigate("/admin/login");
            return;
        }
        loadWebinars();
    }, [navigate]);

    const loadWebinars = async () => {
        const data = await DataService.getWebinars();
        setWebinars(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (
            confirm(
                "Are you sure you want to delete this webinar? This cannot be undone."
            )
        ) {
            try {
                await DataService.deleteWebinar(id);
                loadWebinars();
            } catch (error) {
                alert("Failed to delete webinar");
                console.error(error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link
                            to="/admin"
                            className="text-gray-500 hover:text-gray-900 mr-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Manage Webinars
                        </h1>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-700">
                        Webinar List
                    </h2>
                    <Link
                        to="/admin/webinars/new"
                        className="flex items-center px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Webinar
                    </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-8 flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-500">
                                <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Slug</th>
                                        <th className="px-6 py-4">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {webinars.length > 0 ? (
                                        webinars.map((webinar) => (
                                            <tr
                                                key={webinar.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {webinar.title}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                                    {webinar.slug}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span>
                                                            {new Date(
                                                                webinar.date
                                                            ).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {webinar.start_time}{" "}
                                                            - {webinar.end_time}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {webinar.is_finished ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            Finished
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Upcoming
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link
                                                            to={`/admin/webinars/${webinar.id}`}
                                                            className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    webinar.id
                                                                )
                                                            }
                                                            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-12 text-center text-gray-400"
                                            >
                                                No webinars found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
