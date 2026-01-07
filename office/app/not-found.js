import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-gray-900 font-sans p-4">
            <div className="text-center max-w-lg">
                <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-4 animate-pulse">
                    404
                </h1>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
                    Page not found
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 bg-gray-900 rounded-xl hover:bg-black hover:scale-105 shadow-lg shadow-purple-600/20"
                >
                    Back to Dashboard
                </Link>
            </div>

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-purple-100 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] bg-blue-100 rounded-full blur-[100px]" />
            </div>
        </div>
    );
}
