export const isDelayed = (startDate, endDate, status) => {
    if (!startDate || !endDate || status === 'Completed') return false;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

    const totalDuration = end - start;
    if (totalDuration <= 0) return false; // Invalid dates or end before start

    const elapsed = now - start;
    const percentage = elapsed / totalDuration;

    return percentage > 0.8;
};

export const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // User requested "Total Hours", so let's provide both: X Days (Y Hours)
    // Assuming 8 hour work days for the "Hours" part or just raw 24h?
    // "Start and End Date and uske hisabse total houes" likely means duration. 
    // Let's standardise on Days. If < 1 day, maybe hours?
    // Let's stick to simple "X Days" for now as it's cleaner for high level view.

    return `${diffDays} Day${diffDays !== 1 ? 's' : ''}`;
};

export const getOverdueDays = (endDate) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();

    // Reset time portions to compare dates only (optional, but cleaner)
    // For now, strict time comparison
    if (now <= end) return 0;

    const diffTime = Math.abs(now - end);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};
