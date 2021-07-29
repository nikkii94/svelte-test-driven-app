import {render, screen} from "@testing-library/svelte";
import userEvent from '@testing-library/user-event';
import App from './App.svelte';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
    rest.post(
        '/api/1.0/users/token/:token',
        (request, response, context) => {
            return response(context.status(200));
        })
);

beforeAll(() => server.listen());

afterAll(() => server.close());

beforeEach(() => server.resetHandlers());

describe('Routing', () => {

    const setup = (path) => {
        window.history.pushState({}, '', path);
        render(App);
    };

    it.each`
        path            | pageTestId
        ${"/"}          | ${"home-page"}
        ${"/signup"}    | ${"signup-page"}
        ${"/login"}     | ${"login-page"}
        ${"/user/1"}    | ${"user-page"}
        ${"/user/2"}    | ${"user-page"}
        ${"/activate/12345"}  | ${"activate-page"}
    `("displays $pageTestId when path is $path", ({ path, pageTestId }) => {
        setup(path);

        const page = screen.queryByTestId(pageTestId);
        expect(page).toBeInTheDocument();
    });

    it.each`
        path            | pageTestId
        ${"/"}          | ${"signup-page"}
        ${"/"}          | ${"login-page"}
        ${"/"}          | ${"user-page"}
        ${"/"}          | ${"activation-page"}
        ${"/signup"}    | ${"home-page"}
        ${"/signup"}    | ${"login-page"}
        ${"/signup"}    | ${"user-page"}
        ${"/signup"}    | ${"activation-page"}
        ${"/login"}     | ${"home-page"}
        ${"/login"}     | ${"signup-page"}
        ${"/login"}     | ${"user-page"}
        ${"/login"}     | ${"activation-page"}
        ${"/user/1"}    | ${"home-page"}
        ${"/user/1"}    | ${"signup-page"}
        ${"/user/1"}    | ${"login-page"}
        ${"/user/1"}    | ${"activation-page"}
        ${'/activate/12345'} | ${"home-page"}
        ${'/activate/12345'} | ${"signup-page"}
        ${'/activate/12345'} | ${"login-page"}
        ${'/activate/12345'} | ${"user-page"}
    `("does not display $pageTestId when path is $path", ({ path, pageTestId }) => {
        setup(path);

        const page = screen.queryByTestId(pageTestId);
        expect(page).not.toBeInTheDocument();
    });

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