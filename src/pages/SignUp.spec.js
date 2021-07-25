import SignUp from './SignUp.svelte';
import { render, screen } from '@testing-library/svelte';
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

            const {container} = render(SignUp);

            const username = container.querySelector('input[name="username"]');
            const email = container.querySelector('input[name="email"]');
            const password = container.querySelector('input[name="password"]');
            const passwordRepeat = container.querySelector('input[name="password_repeat"]');

            await userEvent.type(username, 'demo');
            await userEvent.type(email, 'demo@localhost');
            await userEvent.type(password, 'demo');
            await userEvent.type(passwordRepeat, 'demo');

            const button = container.querySelector('button');
            await userEvent.click(button);

            await server.close();
            expect(requestBody).toEqual({
                username: 'demo',
                email: 'demo@localhost',
                password: 'demo',
            });
        });
    })
});
