
import { useBugs, useSprints, useNotes } from '@/hooks/useData';

// Re-export hooks with old names for backward compatibility
export const useProjectData = useBugs;
export const useSprintData = useSprints;
export const useNotesData = useNotes;
