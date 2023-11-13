import { writable } from 'svelte/store';

export const lightMode = writable(false);
export const questionIndex = writable(0);
export const isQuestionVisible = writable(true);
export const loginOn = writable(false);
export const CreateCardFormOn = writable(false);
export const token = writable(null);

export function setToken(newToken) {
    token.set(newToken);
    localStorage.setItem('auth_token', newToken);
}

export function clearToken() {
    token.set(null);
    localStorage.removeItem('auth_token');
}