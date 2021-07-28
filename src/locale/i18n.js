import {addMessages, init, locale} from "svelte-i18n";
import hu from './hu.json';
import en from './en.json';

addMessages('en', en);

addMessages('hu', hu);

init({ initialLocale: 'en' });

export const reset = () => {
    locale.set('en');
}