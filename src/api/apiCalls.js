import {locale} from "svelte-i18n";

locale.subscribe((lang) => {
    localStorage.setItem('lang', lang);
});

export const signUp = async (body) => {
    return await fetch('/api/1.0/users', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': localStorage.getItem('lang') || 'en'
        },
        body: JSON.stringify(body)
    });
}