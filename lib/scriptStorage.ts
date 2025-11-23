export interface SavedScript {
    id: string;
    name: string;
    code: string;
    createdAt: number;
    updatedAt: number;
}

const STORAGE_KEY = 'agentic-trader-scripts';

export function getAllScripts(): SavedScript[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function getScript(id: string): SavedScript | null {
    const scripts = getAllScripts();
    return scripts.find(s => s.id === id) || null;
}

export function saveScript(script: Omit<SavedScript, 'id' | 'createdAt' | 'updatedAt'> | SavedScript): SavedScript {
    const scripts = getAllScripts();
    const now = Date.now();

    let savedScript: SavedScript;

    if ('id' in script) {
        // Update existing
        const index = scripts.findIndex(s => s.id === script.id);
        savedScript = { ...script, updatedAt: now };
        if (index >= 0) {
            scripts[index] = savedScript;
        } else {
            scripts.push(savedScript);
        }
    } else {
        // Create new
        savedScript = {
            ...script,
            id: `script-${now}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: now,
            updatedAt: now,
        };
        scripts.push(savedScript);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
    return savedScript;
}

export function deleteScript(id: string): void {
    const scripts = getAllScripts();
    const filtered = scripts.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
