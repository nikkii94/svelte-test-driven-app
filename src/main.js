import App from './App.svelte';
import './locale/i18n';

const app = new App({
	target: document.body,
	hydrate: true
	// props: {
	// 	name: 'world'
	// }
});

export default app;