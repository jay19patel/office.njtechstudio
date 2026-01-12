'use client';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-white/10 w-full max-w-md p-6 animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
