import { writable } from 'svelte/store';

export const lightMode = writable(false);
export const questionIndex = writable(0);
export const isQuestionVisible = writable(true);
export const loginOn = writable(false);