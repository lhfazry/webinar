import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    Download,
    Search,
    Trash2,
    LogOut,
    TrendingUp,
    Filter,
    Mail,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    CheckCircle,
} from "lucide-react";
import { DataService } from "../lib/data";
import { sendConfirmationEmail } from "../lib/email";
import type { Registration, ReferralSource } from "../types";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [filterReferral, setFilterReferral] = useState<
        ReferralSource | "All"
    >("All");
    const [processingEmailId, setProcessingEmailId] = useState<string | null>(
        null
    );
    const [isSyncing, setIsSyncing] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    const [statistics, setStatistics] = useState<{
        jobTitles: Record<string, number>;
        referralSources: Record<string, number>;
    }>({ jobTitles: {}, referralSources: {} });

    useEffect(() => {
        // Check auth
        if (!localStorage.getItem("admin_auth")) {
            navigate("/admin/login");
            return;
        }
    }, [navigate]);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // Reset to page 1 on search change
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filterReferral]);

    useEffect(() => {
        loadData();
    }, [currentPage, debouncedSearchTerm, filterReferral]);

    const loadData = async () => {
        // Parallel data fetching for efficiency
        const [registrationsResponse, statsResponse] = await Promise.all([
            DataService.getRegistrations(
                currentPage,
                itemsPerPage,
                debouncedSearchTerm,
                filterReferral
            ),
            DataService.getStatistics(),
        ]);

        setRegistrations(registrationsResponse.data);
        setTotalItems(registrationsResponse.count);
        setStatistics(statsResponse);
    };

    const handleLogout = () => {
        localStorage.removeItem("admin_auth");
        navigate("/admin/login");
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this registrant?")) {
            await DataService.deleteRegistration(id);
            await loadData();
        }
    };

    const handleResendEmail = async (reg: Registration) => {
        if (confirm(`Resend confirmation email to ${reg.fullName}?`)) {
            setProcessingEmailId(reg.id);
            const success = await sendConfirmationEmail(
                reg.email,
                reg.fullName
            );
            setProcessingEmailId(null);

            if (success) {
                alert(`Email successfully sent to ${reg.email}`);
            } else {
                alert(
                    `Failed to send email to ${reg.email}. Check console for details.`
                );
            }
        }
    };

    const handleExport = async () => {
        // Export all data matching current filters
        const { data: allData } = await DataService.getRegistrations(
            1,
            10000, // Large limit to get all
            debouncedSearchTerm,
            filterReferral
        );

        const headers = [
            "Full Name",
            "Email",
            "WhatsApp",
            "Job Title",
            "Institution",
            "Referral Source",
            "Registered At",
        ];
        const csvContent = [
            headers.join(","),
            ...allData.map((r) =>
                [
                    `"${r.fullName}"`,
                    `"${r.email}"`,
                    `"${r.whatsapp}"`,
                    `"${r.jobTitle}"`,
                    `"${r.institution}"`,
                    `"${r.referralSource}"`,
                    `"${new Date(r.createdAt).toLocaleString()}"`,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `registrations_${
            new Date().toISOString().split("T")[0]
        }.csv`;
        link.click();
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const result = await DataService.syncGoogleContacts();
            if (result.error) {
                alert(`Error syncing contacts: ${result.error}`);
            } else {
                alert(result.message || "Sync completed successfully");
                // Reload data to reflect any changes if needed (e.g. if we add a synced indicator later)
                await loadData();
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred during sync");
        } finally {
            setIsSyncing(false);
        }
    };

    const getTopReferral = () => {
        // Note: This only calculates based on the current page's data
        if (registrations.length === 0) return "N/A";
        const counts: Record<string, number> = {};
        registrations.forEach((r) => {
            counts[r.referralSource] = (counts[r.referralSource] || 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Admin Dashboard
                        </h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Logout
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center col-span-1">
                        <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Registrants
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {totalItems}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center col-span-1">
                        <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Top Referral Source
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {getTopReferral()}
                            </p>
                            <p className="text-xs text-gray-400">
                                (Current Page)
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-1">
                        <h3 className="text-sm font-medium text-gray-500 mb-4">
                            Job Title Distribution
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(statistics.jobTitles)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 3)
                                .map(([title, count]) => (
                                    <div key={title} className="text-sm">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-700 truncate w-32">
                                                {title}
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {count}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                                            <div
                                                className="bg-green-500 h-1.5 rounded-full"
                                                style={{
                                                    width: `${
                                                        (count / totalItems) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-1">
                        <h3 className="text-sm font-medium text-gray-500 mb-4">
                            Referral Sources
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(statistics.referralSources)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 3)
                                .map(([source, count]) => (
                                    <div key={source} className="text-sm">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-700 truncate w-32">
                                                {source}
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {count}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                                            <div
                                                className="bg-orange-500 h-1.5 rounded-full"
                                                style={{
                                                    width: `${
                                                        (count / totalItems) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 p-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 justify-between items-center">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <select
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none bg-white w-full sm:w-48"
                                value={filterReferral}
                                onChange={(e) =>
                                    setFilterReferral(e.target.value as any)
                                }
                            >
                                <option value="All">All Sources</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Instagram">Instagram</option>
                                <option value="WhatsApp Group">
                                    WhatsApp Group
                                </option>
                                <option value="Email Newsletter">
                                    Email Newsletter
                                </option>
                                <option value="Friend/Colleague">
                                    Friend/Colleague
                                </option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex space-x-2 w-full sm:w-auto">
                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className={`flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center ${
                                isSyncing ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            <RefreshCw
                                className={`w-4 h-4 mr-2 ${
                                    isSyncing ? "animate-spin" : ""
                                }`}
                            />
                            {isSyncing ? "Syncing..." : "Sync Contacts"}
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white border border-gray-200 rounded-b-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Role / Org</th>
                                    <th className="px-6 py-4">Referral</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {registrations.length > 0 ? (
                                    registrations.map((reg) => (
                                        <tr
                                            key={reg.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <p className="font-semibold text-gray-900">
                                                        {reg.fullName}
                                                    </p>
                                                    {reg.hasBeenAddedToGoogleContact && (
                                                        <span title="Synced to Google Contacts">
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    Registered{" "}
                                                    {new Date(
                                                        reg.createdAt
                                                    ).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900">
                                                        {reg.email}
                                                    </span>
                                                    <span className="text-gray-400 text-xs">
                                                        {reg.whatsapp}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900">
                                                        {reg.jobTitle}
                                                    </span>
                                                    <span className="text-gray-400 text-xs">
                                                        {reg.institution}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {reg.referralSource}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleResendEmail(
                                                                reg
                                                            )
                                                        }
                                                        disabled={
                                                            processingEmailId ===
                                                            reg.id
                                                        }
                                                        className={`text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50 ${
                                                            processingEmailId ===
                                                            reg.id
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                        title="Resend Confirmation Email"
                                                    >
                                                        <Mail
                                                            className={`w-5 h-5 ${
                                                                processingEmailId ===
                                                                reg.id
                                                                    ? "animate-pulse"
                                                                    : ""
                                                            }`}
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(reg.id)
                                                        }
                                                        className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                                                        title="Delete Registration"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
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
                                            <div className="flex flex-col items-center justify-center">
                                                <Search className="w-12 h-12 mb-4 text-gray-300" />
                                                <p className="text-lg font-medium text-gray-900">
                                                    No registrations found
                                                </p>
                                                <p className="text-sm">
                                                    Try adjusting your search or
                                                    filters
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing{" "}
                            <span className="font-medium">
                                {Math.min(
                                    (currentPage - 1) * itemsPerPage + 1,
                                    totalItems
                                )}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                                {Math.min(
                                    currentPage * itemsPerPage,
                                    totalItems
                                )}
                            </span>{" "}
                            of <span className="font-medium">{totalItems}</span>{" "}
                            results
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 transition-colors ${
                                    currentPage === 1
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                aria-label="Previous Page"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-gray-700 font-medium">
                                Page {currentPage} of {totalPages || 1}
                            </span>
                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(totalPages, p + 1)
                                    )
                                }
                                disabled={
                                    currentPage === totalPages ||
                                    totalPages === 0
                                }
                                className={`p-2 rounded-md border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 transition-colors ${
                                    currentPage === totalPages ||
                                    totalPages === 0
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                aria-label="Next Page"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
