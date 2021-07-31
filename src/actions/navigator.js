import {navigate} from "svelte-routing";

export const navigator = node => {
    const clickHandler = event => {
        event.preventDefault();
        navigate(event.target.pathname);
    };

    node.addEventListener('click', clickHandler);

    return {
        destroy() {
            node.removeEventListener('click', clickHandler);
        }
    }
};