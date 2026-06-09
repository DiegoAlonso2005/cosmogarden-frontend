import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

const tokenFromStorage = localStorage.getItem('cosmogarden_token');

const useAuthStore = create<AuthState>((set) => ({
  token: tokenFromStorage,
  isAuthenticated: Boolean(tokenFromStorage),
  setToken: (token) => {
    localStorage.setItem('cosmogarden_token', token);
    set({ token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('cosmogarden_token');
    set({ token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
