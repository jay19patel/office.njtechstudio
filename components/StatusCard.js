'use client';

import Link from 'next/link';

export default function StatusCard({
    label,
    count,
    subtext = "Items",
    isActive = true,
    onClick,
    href,
    type = 'default'
}) {

    const getColors = () => {
        switch (type) {
            case 'success': // Green / Completed
                return {
                    bg: 'bg-green-50',
                    text: 'text-green-700',
                    border: 'border-green-200',
                    ring: 'ring-green-500'
                };
            case 'warning': // Yellow / Pending / On Hold
                return {
                    bg: 'bg-yellow-50',
                    text: 'text-yellow-700',
                    border: 'border-yellow-200',
                    ring: 'ring-yellow-500'
                };
            case 'info': // Blue / In Progress
                return {
                    bg: 'bg-blue-50',
                    text: 'text-blue-700',
                    border: 'border-blue-200',
                    ring: 'ring-blue-500'
                };
            case 'purple': // Purple / Brainstorming / Planning
                return {
                    bg: 'bg-purple-50',
                    text: 'text-purple-700',
                    border: 'border-purple-200',
                    ring: 'ring-purple-500'
                };
            case 'red': // Red / Bugs
                return {
                    bg: 'bg-red-50',
                    text: 'text-red-700',
                    border: 'border-red-200',
                    ring: 'ring-red-500'
                };
            case 'pink': // Pink / Total
                return {
                    bg: 'bg-pink-50',
                    text: 'text-pink-700',
                    border: 'border-pink-200',
                    ring: 'ring-pink-500'
                };
            case 'orange': // Orange / Open
                return {
                    bg: 'bg-orange-50',
                    text: 'text-orange-700',
                    border: 'border-orange-200',
                    ring: 'ring-orange-500'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    text: 'text-gray-700',
                    border: 'border-gray-200',
                    ring: 'ring-gray-500'
                };
        }
    };

    const colors = getColors();

    const CardContent = (
        <>
            {/* Decorative Background Blob */}
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-0 group-hover:opacity-10 transition-opacity ${colors.bg.replace('bg-', 'bg-current text-')}`} />

            <div className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded mb-3 inline-block ${colors.bg} ${colors.text} ${colors.border} border`}>
                {label}
            </div>

            <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-3xl font-bold text-gray-900">{count}</span>
                {subtext && <span className="text-xs text-gray-400 font-medium">{subtext}</span>}
            </div>
        </>
    );

    const baseClass = `
        w-full text-left p-6 rounded-2xl border border-gray-100 transition-all duration-200 relative overflow-hidden group
        ${isActive ? 'opacity-100 shadow-sm' : 'opacity-40 hover:opacity-70'}
        ${isActive ? 'hover:shadow-md' : ''}
        ${isActive && count > -1 ? `ring-2 ${colors.ring} ring-opacity-0 hover:ring-opacity-50` : ''} 
        bg-white block
    `;

    if (href) {
        return (
            <Link href={href} className={baseClass}>
                {CardContent}
            </Link>
        );
    }

    if (onClick) {
        return (
            <button onClick={onClick} className={baseClass}>
                {CardContent}
            </button>
        );
    }

    return (
        <div className={baseClass}>
            {CardContent}
        </div>
    );
}
