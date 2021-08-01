import { writable} from "svelte/store";

const loadStateFromStorage = () => {
    return localStorage.getItem("auth") || { isLoggedIn: false };
};

export const auth = writable(loadStateFromStorage);

auth.subscribe((authState) => {
    localStorage.setItem("auth", JSON.stringify(authState));
});