import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen w-0">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
