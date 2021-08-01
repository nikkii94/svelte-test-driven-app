import {render, screen} from "@testing-library/svelte";
import userEvent from '@testing-library/user-event';
import App from './App.svelte';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import Login from "./pages/Login/Login.svelte";
import {resetAuthState} from "./store/stores";
import storage from "./store/storage";

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
        ${"/signup"} | ${"Svelte Demo App"} |${"home-page"} | ${"/"}
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
        let emailInput, passwordInput, loginButton;

        const fillLoginForm = async () => {
            setup('/login');
            emailInput = screen.getByLabelText('Email');
            passwordInput = screen.getByLabelText('Password');
            loginButton = screen.getByRole('button', { name: 'Login' });

            await userEvent.type(emailInput, 'user5@mail.com');
            await userEvent.type(passwordInput, 'P4ssword');
            await userEvent.click(loginButton);
        };

        // afterEach(() => {
        //     resetAuthState();
        // })

        it('redirects to homepage after successful login', async () => {
           await fillLoginForm();

            const homepage = await screen.findByTestId('home-page');
            expect(homepage).toBeInTheDocument();
        });

        it('hides login and signup form navbar after successful login', async () => {
            await fillLoginForm();

            const loginLink = screen.queryByRole('link', { name: 'Login'});
            const signUpLink = screen.queryByRole('link', { name: 'Sign Up'});

            await screen.findByTestId('home-page');

            expect(loginLink).not.toBeInTheDocument();
            expect(signUpLink).not.toBeInTheDocument();
        });

        it('displays profile link on navbar after successful login', async () => {
            await fillLoginForm();
            await screen.findByTestId('home-page');
            const profileLink = screen.queryByRole('link', { name: 'Profile'});

            expect(profileLink).toBeInTheDocument();
        });

        it('displays user page with logged in user id in url after clicking profile link', async () => {
            await fillLoginForm();
            await screen.findByTestId('home-page');

            const profileLink = screen.queryByRole('link', { name: 'Profile'});
            await userEvent.click(profileLink);
            const userPage = await screen.findByTestId('user-page');
            expect(userPage).toBeInTheDocument();

            expect(window.location.pathname.endsWith('/user/5')).toBeTruthy();
        });

        it('stores logged in state in locale storage', async () => {
            await fillLoginForm();
            await screen.findByTestId('home-page');

            const state = storage.getItem('auth');
            expect(state.isLoggedIn).toBeTruthy();
        });

        it('displays layout of logged in state when local storage has logged in user', async () => {
            storage.setItem('auth', { isLoggedIn: true, id: 5 });
            resetAuthState();
            await setup('/');

            await screen.findByTestId('home-page');
            const profileLink = screen.queryByRole('link', { name: 'Profile'});

            expect(profileLink).toBeInTheDocument();
        })

    });

});