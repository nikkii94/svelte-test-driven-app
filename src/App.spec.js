import {render, screen} from "@testing-library/svelte";
import userEvent from '@testing-library/user-event';
import App from './App.svelte';

describe('Routing', () => {

    const setup = (path) => {
        window.history.pushState({}, '', path);
        render(App);
    }

    // it.each`
    //     path | pageTestId
    //     ${"/"} | ${"home-page"}
    //     ${"/signup"} | ${"signup-page"}
    // `("displays $pageTestId when path is $path", ({ path, pageTestId }) => {
    //     setup(path);
    //
    //     const page = screen.findByTestId(`${pageTestId}`);
    //     expect(page).toBeInTheDocument();
    // });
    //
    // it.each`
    //     path | pageTestId
    //     ${"/"} | ${"signup-page"}
    //     ${"/signup"} | ${"home-page"}
    // `("does not display $pageTestId when path is $path", ({ path, pageTestId }) => {
    //     setup(path);
    //
    //     const page = screen.findByTestId(`${pageTestId}`);
    //     expect(page).not.toBeInTheDocument();
    // });

    it.each`
        initialPath | clicking | visible | lastUrl
        ${"/"} | ${"Sign Up"} |${"signup-page"} | ${"/signup"}
        ${"/signup"} | ${"Home"} |${"home-page"} | ${"/"}
    `('displays $visible after clicking clicking link', async ({ clicking, visible, lastUrl }) => {
        setup('/');
        const link = screen.queryByRole('link', { name:clicking });
        await userEvent.click(link);

        expect(screen.queryByTestId(visible)).toBeInTheDocument();
        expect(window.location.pathname).toBe(lastUrl)
    })

});