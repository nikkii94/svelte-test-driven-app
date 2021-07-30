import {locale} from "svelte-i18n";
import 'whatwg-fetch';

locale.subscribe((lang) => {
    localStorage.setItem('lang', lang);
});

const headers = {
    'Content-Type': 'application/json'
};

export const signUp = async (body) => {
    return await fetch('/api/1.0/users', {
        method: 'post',
        headers: {
            ...headers,
            'Accept-Language': localStorage.getItem('lang') || 'en'
        },
        body: JSON.stringify(body)
    });
}

export const activate = async (token) => {
    return await fetch('/api/1.0/users/token/' + token, {
        method: 'post',
    });
}

export const getUsers = async (page = 0) => {
    return await fetch(`/api/1.0/users?page=${page}`);
}