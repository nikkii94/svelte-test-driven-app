import {locale} from "svelte-i18n";

locale.subscribe((lang) => {
    localStorage.setItem('lang', lang);
});