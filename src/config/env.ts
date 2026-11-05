const DEFAULT_BACKEND_URL = 'http://localhost:3000';

export const API_URL: string = import.meta.env.VITE_API_URL ?? DEFAULT_BACKEND_URL;
export const WS_URL: string = import.meta.env.VITE_WS_URL ?? DEFAULT_BACKEND_URL;
