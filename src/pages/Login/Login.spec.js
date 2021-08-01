import {render, screen, waitFor, waitForElementToBeRemoved} from '@testing-library/svelte';
import Login from "../Login/Login.svelte";
import LanguageSelector from '../../components/LanguageSelector.svelte';
import userEvent from "@testing-library/user-event";
import 'whatwg-fetch';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import en from '../../locale/en.json';
import hu from '../../locale/hu.json';

const server = setupServer();

beforeAll(() => server.listen());

afterAll(() => server.close());

beforeEach(() => server.resetHandlers());

const failingUser = {
    email: 'user100@failing.com',
    password: 'aA123456'
};

describe('Login page', () => {
    it('has login header', () => {
        render(Login);

        const header = screen.getByRole('heading', {
            name: 'Login'
        });
        expect(header).toBeInTheDocument();
    });

    it('has email input', () => {
        render(Login);
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('has email type for email input', () => {
        render(Login);
        const email = screen.getByLabelText('Email');
        expect(email.type).toBe('email');
    });

    it('has password input', () => {
        render(Login);
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('has a login button', () => {
        render(Login);
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('disables the button initially', () => {
        render(Login);
        expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled();
    });

    describe('Interactions', () => {
        let emailInput, passwordInput, loginButton;
        let counter = 0;
        let requestBody;

        beforeEach(() => {
            counter = 0;
            server.use(
                rest.post(
                    '/api/1.0/auth',
                    (request, response, context) => {
                        requestBody = request.body;
                        counter++;
                        return response(
                            context.status(401),
                            context.json({ message: 'Incorrect credentials'})
                        );
                    })
            );
        });

        const setup = () => {
            render(Login);
            emailInput = screen.getByLabelText('Email');
            passwordInput = screen.getByLabelText('Password');
            loginButton = screen.getByRole('button', { name: 'Login' });
        }

        const fillAndSubmit = async () => {
            await userEvent.type(emailInput, failingUser.email);
            await userEvent.type(passwordInput, failingUser.password);
            await userEvent.click(loginButton);
        }

        it('enables submit button when email and password input are filled', async () => {
            setup();

            await userEvent.type(emailInput, failingUser.email);
            await userEvent.type(passwordInput, failingUser.password);

            expect(loginButton).toBeEnabled();
        });

        it('displays spinner after clicking the button', async () => {
            setup();
            await fillAndSubmit();

            const spinner = screen.queryByRole('status');
            expect(spinner).toBeInTheDocument();
        });

        it('hides spinner after api call finishes', async () => {
            setup();
            await fillAndSubmit();

            const spinner = screen.queryByRole('status');
            await waitFor(() => {
                expect(spinner).not.toBeInTheDocument();
            });
        });

        it('send data to backend on button submit', async () => {
            setup();
            await fillAndSubmit();

            const spinner = screen.queryByRole('status');
            await waitForElementToBeRemoved(spinner);

            expect(requestBody).toEqual(failingUser);
        });

        it('disables login button if there is ongoing request', async () => {
            setup();
            await fillAndSubmit();

            await userEvent.click(loginButton);
            await userEvent.click(loginButton);

            const spinner = screen.queryByRole('status');
            await waitForElementToBeRemoved(spinner);
            expect(counter).toBe(1);
        });

        it('displays login failed message after submitting invalid data', async () => {
            setup();
            await fillAndSubmit();

            const spinner = screen.queryByRole('status');
            await waitForElementToBeRemoved(spinner);

            expect(screen.getByText('Incorrect credentials'))
                .toBeInTheDocument();
        });

        it('clears authentication fail message if input field is changed', async () => {
            setup();
            await fillAndSubmit();

            const error = await screen.findByText('Incorrect credentials');
            await userEvent.type(emailInput, 'test');

            expect(error).not.toBeInTheDocument();
        })


    });

    describe('Internationalization', () => {
        let emailInput, passwordInput, loginButton;

        const setup = () => {
            render(Login);
            render(LanguageSelector);
            emailInput = screen.getByLabelText('Email');
            passwordInput = screen.getByLabelText('Password');
            loginButton = screen.getByRole('button', { name: 'Login' });
        }

        const fillAndSubmit = async () => {
            await userEvent.type(emailInput, failingUser.email);
            await userEvent.type(passwordInput, failingUser.password);
            await userEvent.click(loginButton);
        }

        const toggleLang = async (lang) => {
            const toggle = screen.getByTitle(lang);
            await userEvent.click(toggle);
        };

        beforeEach(() => {
            server.use(
                rest.post(
                    '/api/1.0/auth',
                    (request, response, context) => {
                        const lang = request.headers.get('Accept-Language') || 'en';
                        return response(
                            context.status(401),
                            context.json({ message: lang === 'en'
                                    ? 'Incorrect credentials'
                                    : 'Érvénytelen belépési adatok'
                            })
                        );
                    })
            );
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('initially displays all texts in english', () => {
            setup();

            expect(screen.queryByRole('heading', { name: en.login })).toBeInTheDocument();
            expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
            expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
            expect(
                screen.queryByRole('button', { name: en.login})
            ).toBeInTheDocument();
        });

        it('initially displays all texts in hungarian after toggling the language', async () => {
            setup();
            await toggleLang('Magyar');

            expect(screen.queryByRole('heading', { name: hu.login })).toBeInTheDocument();
            expect(screen.queryByLabelText(hu.email)).toBeInTheDocument();
            expect(screen.queryByLabelText(hu.password)).toBeInTheDocument();
            expect(
                screen.queryByRole('button', { name: hu.login})
            ).toBeInTheDocument();
        });

        it('initially displays all texts in english after toggling back the language', async () => {
            setup();
            await toggleLang('Magyar');
            await toggleLang('English');

            expect(
                screen.queryByRole('heading', { name: en.login})
            ).toBeInTheDocument();

            expect(
                screen.queryByRole('button', { name: en.login})
            ).toBeInTheDocument();

            expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
            expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
        });

        it('returns validation message in english initially', async () => {
            setup();
            await fillAndSubmit();

            const spinner = screen.queryByRole('status');
            await waitForElementToBeRemoved(spinner);

            expect(await screen.findByText('Incorrect credentials'))
                .toBeInTheDocument();
        });

        it('returns validation message in hungarian after language is selected', async () => {
            setup();
            await toggleLang('Magyar');
            await fillAndSubmit();

            const spinner = screen.queryByRole('status');
            await waitForElementToBeRemoved(spinner);

            expect(await screen.findByText('Érvénytelen belépési adatok'))
                .toBeInTheDocument();
        });

        it('returns validation message in english after toggling back from hungarian', async () => {
            setup();
            await toggleLang('Magyar');
            await toggleLang('English');

            await fillAndSubmit();

            const spinner = screen.queryByRole('status');
            await waitForElementToBeRemoved(spinner);

            expect(await screen.findByText('Incorrect credentials'))
                .toBeInTheDocument();
        })
    });
})