import { writable } from "svelte/store";

export const lightMode = writable(false);
export const questionIndex = writable(0);
export const isQuestionVisible = writable(true);
export const loginOn = writable(false);
export const CreateCardFormOn = writable(false);
export const token = writable(null);

export const setAuthToken = ({ cookies, token }) => {
  cookies.set("AuthorizationToken", `Bearer ${token}`, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
};
