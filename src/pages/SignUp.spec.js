import SignUp from './SignUp.svelte';
import {render, screen, waitFor} from '@testing-library/svelte';
import '@testing-library/jest-dom/extend-expect'
import userEvent from "@testing-library/user-event";
import 'whatwg-fetch';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

describe('Sign Up Page', () => {
    describe('Layout', () => {
        it('has sign up header', () => {
            render(SignUp);

            const header = screen.getByRole('heading', {
                name: 'Sign Up'
            });
            expect(header).toBeInTheDocument();
        });

        it('has username input', () => {
            const {container} = render(SignUp);

            const input = container.querySelector('input[name="username"]');
            expect(input).toBeInTheDocument();
        });

        it('has email input', () => {
            const {container} = render(SignUp);

            const input = container.querySelector('input[name="email"]');
            expect(input).toBeInTheDocument();
        });

        it('has email type for email input', () => {
            const {container} = render(SignUp);

            const type = container.querySelector('input[name="email"]').type;
            expect(type).toBe('email');
        });

        it('has password input', () => {
            const {container} = render(SignUp);

            const input = container.querySelector('input[name="password"]');
            expect(input).toBeInTheDocument();
        });

        it('has password type for password input', () => {
            const {container} = render(SignUp);

            const type = container.querySelector('input[name="password"]').type;
            expect(type).toBe('password');
        });

        it('has password repeat input', () => {
            const {container} = render(SignUp);

            const input = container.querySelector('input[name="password_repeat"]');
            expect(input).toBeInTheDocument();
        });

        it('has password type for password repeat input', () => {
            const {container} = render(SignUp);

            const type = container.querySelector('input[name="password_repeat"]').type;
            expect(type).toBe('password');
        });

        it('has a sign up button', () => {
            const {container} = render(SignUp);

            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();
        });

        it('disables the button initially', () => {
            const {container} = render(SignUp);

            const button = container.querySelector('button');
            expect(button).toBeDisabled();
        })
    });

    describe('Interactions', () => {
        const setup = async (successful = true) => {
            const {container, getByText} = render(SignUp);

            const username = container.querySelector('input[name="username"]');
            const email = container.querySelector('input[name="email"]');
            const password = container.querySelector('input[name="password"]');
            const passwordRepeat = container.querySelector('input[name="password_repeat"]');

            if (successful) {
                await userEvent.type(username, 'demo');
                await userEvent.type(email, 'demo@localhost');
            }

            await userEvent.type(password, 'P4ssword');
            await userEvent.type(passwordRepeat, 'P4ssword');

            return {container, getByText};
        };

        it('enables the button if the two password field has matching values', async () => {
            const {container} = render(SignUp);

            const password = container.querySelector('input[name="password"]');
            const passwordRepeat = container.querySelector('input[name="password_repeat"]');

            await userEvent.type(password, 'p4ssword');
            await userEvent.type(passwordRepeat, 'p4ssword');

            const button = container.querySelector('button');
            expect(button).toBeEnabled();
        });

        it('send data to backend on button submit', async () => {
            let requestBody;
            const server = setupServer(
                rest.post(
                    '/api/1.0/users',
                    (request, response, context) => {
                        requestBody = request.body;
                        return response(context.status(200));
                })
            );
            server.listen();

            await setup();

            const button = screen.getByRole('button', { name: 'Sign up' });
            await userEvent.click(button);

            await server.close();
            expect(requestBody).toEqual({
                username: 'demo',
                email: 'demo@localhost',
                password: 'P4ssword',
            });
        });

        it('disabled button if there is ongoing request', async () => {
            let counter = 0;
            const server = setupServer(
                rest.post(
                    '/api/1.0/users',
                    (request, response, context) => {
                        counter++;
                        return response(context.status(200));
                    })
            );
            server.listen();

            await setup();

            const button = screen.getByRole('button', { name: 'Sign up' });
            await userEvent.click(button);
            await userEvent.click(button);

            await server.close();
            expect(counter).toBe(1);
        });

        it('displays spinner while the api request in progress', async () => {
            const server = setupServer(
                rest.post(
                    '/api/1.0/users',
                    (request, response, context) => {
                        return response(context.status(200));
                    })
            );
            server.listen();

            const {container} = await setup();

            const button = screen.getByRole('button', { name: 'Sign up'} );
            await userEvent.click(button);

            const spinner = container.querySelector('.spinner');
            expect(spinner).toBeInTheDocument();
        });

        it('does not displays spinner while there is no api request', async () => {
            const server = setupServer(
                rest.post(
                    '/api/1.0/users',
                    (request, response, context) => {
                        return response(context.status(200));
                    })
            );
            server.listen();

            const {container} = await setup();

            const spinner = container.querySelector('.spinner');
            expect(spinner).not.toBeInTheDocument();
        });

        it('does not display account activation message before sign up', async () => {
            const server = setupServer(
                rest.post(
                    '/api/1.0/users',
                    (request, response, context) => {
                        return response(context.status(200));
                    })
            );
            server.listen();

            await setup();

            const text = screen.queryByText('Please check your e-mail to activate your account!');
            expect(text).not.toBeInTheDocument();
        });

        it('displays account activation information after successful sign up request', async () => {
            const server = setupServer(
                rest.post(
                    '/api/1.0/users',
                    (request, response, context) => {
                        return response(context.status(200));
                    })
            );
            server.listen();

            await setup();

            const button = await screen.getByRole('button', { name: 'Sign up' });

            await userEvent.click(button);
            await server.close();

            const text = await screen.findByText('Please check your e-mail to activate your account!');
            expect(text).toBeInTheDocument();
        });

        it('does not displays account activation information after failing sign up request', async () => {
            const server = setupServer(
                rest.post(
                    '/api/1.0/users',
                    (request, response, context) => {
                        return response(context.status(400));
                    })
            );
            server.listen();

            await setup(false);

            const button = await screen.getByRole('button', { name: 'Sign up' });

            await userEvent.click(button);
            await server.close();

            const text = await screen.queryByText('Please check your e-mail to activate your account!');
            expect(text).not.toBeInTheDocument();
        });

        it('hides sign up form after successful request', async () => {
            const server = setupServer(
                rest.post(
                    '/api/1.0/users',
                    (request, response, context) => {
                        return response(context.status(200));
                    })
            );
            server.listen();

            await setup();

            const button = await screen.getByRole('button', { name: 'Sign up' });

            await userEvent.click(button);
            await server.close();

            const form = screen.queryByRole('form');
            await waitFor(() => {
                expect(form).not.toBeInTheDocument();
            });
        });
    });
});
