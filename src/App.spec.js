import {render, screen} from "@testing-library/svelte";
import userEvent from '@testing-library/user-event';
import App from './App.svelte';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import UserList from "./components/UserList.svelte";
import Login from "./pages/Login/Login.svelte";

const server = setupServer(
    rest.post(
        '/api/1.0/users/token/:token',
        (request, response, context) => {
            return response(context.status(200));
        }),
    rest.get("/api/1.0/users", (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                content: [
                    {
                        id: 1,
                        username: "user-in-list",
                        email: "user-in-list@mail.com",
                        image: null,
                    },
                ],
                page: 0,
                size: 0,
                totalPages: 0,
            })
        );
    }),
    rest.get("/api/1.0/users/:id", (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                id: 1,
                username: "user1",
                email: "user1@mail.com",
                image: null,
            })
        );
    }),
    rest.post("/api/1.0/auth", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ id: 5, username: "user5" }));
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
    });

    it('navigates to user page when clicking the username on user list', async () => {
        setup('/users');
        const firstUser = await screen.findByText('user-in-list');
        await userEvent.click(firstUser);

        expect(screen.queryByTestId('user-page')).toBeInTheDocument();
    });

    describe('Login', () => {

        server.use(
            rest.post('/api/1.0/auth', (request, response, context) => {
                return response(
                    context.status(200),
                    context.json({ username: 'user5' })
                );
            })
        );

        it('redirects to homepage after successful login', async () => {
            setup('/login');
            const emailInput = screen.getByLabelText('Email');
            const passwordInput = screen.getByLabelText('Password');
            const loginButton = screen.getByRole('button', { name: 'Login' });

            await userEvent.type(emailInput, 'user5@gmail.com');
            await userEvent.type(passwordInput, 'P4ssword');
            await userEvent.click(loginButton);

            const homepage = await screen.findByTestId('home-page');
            expect(homepage).toBeInTheDocument();
        });
    })

});