import { describe, it, expect, beforeEach } from 'vitest';
import { useLibraryStore } from '../../store/libraryStore';
describe('Navigation and Authentication Flow Lifecycle', () => {
    beforeEach(() => {
        if (typeof localStorage !== 'undefined' && localStorage?.clear) {
            localStorage.clear();
        }
        useLibraryStore.getState().logout();
    });
    it('Step 1: Unauthenticated visitors start on Landing Page without login', () => {
        const state = useLibraryStore.getState();
        expect(state.isAuthenticated).toBe(false);
        expect(state.currentUser).toBeNull();
        expect(state.activeTab).toBe('landing');
    });
    it('Step 2 & 3: Authenticating transitions user to Dashboard with active role and session', () => {
        const { login } = useLibraryStore.getState();
        const result = login('student@lib.com', 'student');
        expect(result).toBe(true);
        const state = useLibraryStore.getState();
        expect(state.isAuthenticated).toBe(true);
        expect(state.currentUser).not.toBeNull();
        expect(state.currentUser?.role).toBe('student');
        expect(state.activeTab).toBe('dashboard');
    });
    it('Step 4: Signing out clears session and directs user back to Landing Page', () => {
        const { login, logout } = useLibraryStore.getState();
        login('librarian@lib.com', 'librarian');
        expect(useLibraryStore.getState().isAuthenticated).toBe(true);
        expect(useLibraryStore.getState().activeTab).toBe('dashboard');
        logout();
        const stateAfterLogout = useLibraryStore.getState();
        expect(stateAfterLogout.isAuthenticated).toBe(false);
        expect(stateAfterLogout.currentUser).toBeNull();
        expect(stateAfterLogout.activeTab).toBe('landing');
    });
});
