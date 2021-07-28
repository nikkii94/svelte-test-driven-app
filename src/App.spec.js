import {render, screen} from "@testing-library/svelte";
import App from './App.svelte';

describe('Routing', () => {
    it('displays homepage at /', () => {
        render(App);

        const homepage = screen.queryByTestId('home-page');
        expect(homepage).toBeInTheDocument();
    })
});