import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

import WebinarList from "./pages/WebinarList";
import AdminWebinars from "./pages/AdminWebinars";
import AdminWebinarForm from "./pages/AdminWebinarForm";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WebinarList />} />
                <Route path="/webinar/:slug" element={<LandingPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/webinars" element={<AdminWebinars />} />
                <Route
                    path="/admin/webinars/new"
                    element={<AdminWebinarForm />}
                />
                <Route
                    path="/admin/webinars/:id"
                    element={<AdminWebinarForm />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
