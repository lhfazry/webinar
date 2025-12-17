import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "1ZCm>r3jDK7x") {
            // Simple demo auth
            localStorage.setItem("admin_auth", "true");
            navigate("/admin");
        } else {
            setError("Invalid password");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-center mb-6">
                    <div className="bg-primary-100 p-3 rounded-full">
                        <Lock className="w-6 h-6 text-primary-600" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                    Admin Login
                </h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-primary-900 text-white py-2 px-4 rounded-lg hover:bg-primary-950 transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
