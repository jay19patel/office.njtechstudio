
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Reset loading state on route change
    useEffect(() => {
        setIsLoading(false);
    }, [pathname]);

    const navigate = (path) => {
        if (path !== pathname) {
            setIsLoading(true);
            router.push(path);
        }
    };

    return (
        <GlobalContext.Provider value={{ isLoading, navigate }}>
            {children}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    return useContext(GlobalContext);
}
