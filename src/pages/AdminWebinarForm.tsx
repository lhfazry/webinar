import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DataService } from "../lib/data";
import type { WebinarInput } from "../types";
import { useSEO } from "../hooks/useSEO";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";

export default function AdminWebinarForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = id && id !== "new";
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);

    useSEO({
        title: isEditMode
            ? "Edit Webinar | Rumah Coding Admin"
            : "Create Webinar | Rumah Coding Admin",
        description: "Create or edit a webinar.",
    });

    const [form, setForm] = useState<WebinarInput>({
        slug: "",
        title: "",
        short_description: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        start_time: "19:00",
        end_time: "21:00",
        location: "Online via Google Meet",
        is_online: true,
        card_image_url: "",
        banner_image_url: "",
        speaker_name: "",
        speaker_role: "",
        speaker_company: "",
        speaker_image_url: "",
        speaker_social_links: [],
        key_takeaways: [],
        is_finished: false,
    });

    const [takeawayInput, setTakeawayInput] = useState("");
    const [socialPlatform, setSocialPlatform] = useState("LinkedIn");
    const [socialUrl, setSocialUrl] = useState("");

    useEffect(() => {
        const loadWebinar = async () => {
            if (isEditMode && id) {
                // Fetch all and find (not efficient but checking logic of data service.. better to add getWebinarById later but for now we can iterate or use slug if known.. wait, data service has getWebinarBySlug. Let's use getWebinars and find for now as ID fetching isn't explicit yet, or add getWebinarById.)
                // Actually, let's just fetch all and filter in memory since list is small, or assume ID match.
                // UPDATE: I'll use getWebinars for now as quick fix or add getWebinarById properly?
                // Let's add getWebinarById to data.ts but for now to be safe with existing tools, I will fetch all.
                const webinars = await DataService.getWebinars();
                const found = webinars.find((w) => w.id === id);
                if (found) {
                    // We need to type cast or ensure types match properly
                    const { id: _, ...rest } = found;
                    setForm(rest);
                } else {
                    alert("Webinar not found");
                    navigate("/admin/webinars");
                }
                setLoading(false);
            }
        };
        loadWebinar();
    }, [id, isEditMode, navigate]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const value =
            e.target.type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : e.target.value;
        setForm((prev) => ({ ...prev, [e.target.name]: value }));
    };

    const handleAddTakeaway = () => {
        if (takeawayInput.trim()) {
            setForm((prev) => ({
                ...prev,
                key_takeaways: [...prev.key_takeaways, takeawayInput.trim()],
            }));
            setTakeawayInput("");
        }
    };

    const handleRemoveTakeaway = (index: number) => {
        setForm((prev) => ({
            ...prev,
            key_takeaways: prev.key_takeaways.filter((_, i) => i !== index),
        }));
    };

    const handleAddSocial = () => {
        if (socialUrl.trim()) {
            setForm((prev) => ({
                ...prev,
                speaker_social_links: [
                    ...prev.speaker_social_links,
                    { platform: socialPlatform, url: socialUrl.trim() },
                ],
            }));
            setSocialUrl("");
        }
    };

    const handleRemoveSocial = (index: number) => {
        setForm((prev) => ({
            ...prev,
            speaker_social_links: prev.speaker_social_links.filter(
                (_, i) => i !== index
            ),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEditMode && id) {
                await DataService.updateWebinar(id, form);
            } else {
                await DataService.addWebinar(form);
            }
            navigate("/admin/webinars");
        } catch (error) {
            console.error(error);
            alert("Failed to save webinar");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link
                            to="/admin/webinars"
                            className="text-gray-500 hover:text-gray-900 mr-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">
                            {isEditMode ? "Edit Webinar" : "Create New Webinar"}
                        </h1>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Basic Info
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={form.title}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Slug (URL)
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={form.slug}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={form.date}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    name="start_time"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={form.start_time}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Time
                                </label>
                                <input
                                    type="time"
                                    name="end_time"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={form.end_time}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={form.location}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex items-center mt-6">
                                <input
                                    type="checkbox"
                                    id="is_online"
                                    name="is_online"
                                    checked={form.is_online}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                                />
                                <label
                                    htmlFor="is_online"
                                    className="ml-2 text-sm text-gray-700"
                                >
                                    Is Online Event
                                </label>
                            </div>
                            <div className="flex items-center mt-6">
                                <input
                                    type="checkbox"
                                    id="is_finished"
                                    name="is_finished"
                                    checked={form.is_finished}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                                />
                                <label
                                    htmlFor="is_finished"
                                    className="ml-2 text-sm text-gray-700"
                                >
                                    Is Finished (Show Recording/Waitlist)
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Short Description
                            </label>
                            <textarea
                                name="short_description"
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                value={form.short_description}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Description
                            </label>
                            <textarea
                                name="description"
                                rows={5}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Speaker & Images
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Speaker Name
                                </label>
                                <input
                                    type="text"
                                    name="speaker_name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={form.speaker_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Speaker Role
                                </label>
                                <input
                                    type="text"
                                    name="speaker_role"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={form.speaker_role}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Speaker Company
                                </label>
                                <input
                                    type="text"
                                    name="speaker_company"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={form.speaker_company}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Speaker Image URL
                                </label>
                                <input
                                    type="text"
                                    name="speaker_image_url"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={form.speaker_image_url}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Card Image URL (List)
                                </label>
                                <input
                                    type="text"
                                    name="card_image_url"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={form.card_image_url}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Banner Image URL (Detail)
                                </label>
                                <input
                                    type="text"
                                    name="banner_image_url"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={form.banner_image_url}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Social Links */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Speaker Social Links
                            </label>
                            <div className="flex space-x-2 mb-2">
                                <select
                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                    value={socialPlatform}
                                    onChange={(e) =>
                                        setSocialPlatform(e.target.value)
                                    }
                                >
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Facebook">Facebook</option>
                                    <option value="Twitter">Twitter</option>
                                    <option value="Website">Website</option>
                                </select>
                                <input
                                    type="text"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="URL"
                                    value={socialUrl}
                                    onChange={(e) =>
                                        setSocialUrl(e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSocial}
                                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {form.speaker_social_links.map((link, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                                    >
                                        <span className="text-sm">
                                            <span className="font-semibold">
                                                {link.platform}:
                                            </span>{" "}
                                            {link.url}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveSocial(idx)
                                            }
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Key Takeaways
                        </h2>
                        <div className="flex space-x-2 mb-2">
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="Add a key takeaway point..."
                                value={takeawayInput}
                                onChange={(e) =>
                                    setTakeawayInput(e.target.value)
                                }
                                onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    (e.preventDefault(), handleAddTakeaway())
                                }
                            />
                            <button
                                type="button"
                                onClick={handleAddTakeaway}
                                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {form.key_takeaways.map((point, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                                >
                                    <span className="text-sm">{point}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveTakeaway(idx)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center px-6 py-3 bg-primary-900 text-white rounded-lg font-medium hover:bg-primary-950 transition-colors disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5 mr-2" />
                            )}
                            {saving ? "Saving..." : "Save Webinar"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
