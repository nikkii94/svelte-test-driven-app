import SignUp from './SignUp.svelte';
import {render, screen, waitFor} from '@testing-library/svelte';
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
        let button;
        let requestBody;
        let counter = 0;
        const server = setupServer(
            rest.post(
                '/api/1.0/users',
                (request, response, context) => {
                    requestBody = request.body;
                    counter++;
                    return response(context.status(200));
                })
        );

        beforeAll(() => server.listen());

        afterAll(() => server.close());

        beforeEach(() => {
            counter = 0;
            server.resetHandlers();
        });

        let username, email, password, passwordRepeat;
        const setup = async (successful = true) => {
            const {container, getByText} = render(SignUp);

            button = screen.getByRole('button', { name: 'Sign up' });

            username = container.querySelector('input[name="username"]');
            email = container.querySelector('input[name="email"]');
            password = container.querySelector('input[name="password"]');
            passwordRepeat = container.querySelector('input[name="password_repeat"]');

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

            button = screen.getByRole('button', { name: 'Sign up' });

            const password = container.querySelector('input[name="password"]');
            const passwordRepeat = container.querySelector('input[name="password_repeat"]');

            await userEvent.type(password, 'demo');
            await userEvent.type(passwordRepeat, 'demo');

            expect(button).toBeEnabled();
        });

        it('send data to backend on button submit', async () => {
            await setup();

            // const button = screen.getByRole('button', { name: 'Sign up' });
            await userEvent.click(button);

            await screen.findByText('Please check your e-mail to activate your account!');

            expect(requestBody).toEqual({
                username: 'demo',
                email: 'demo@localhost',
                password: 'P4ssword',
            });
        });

        it('disabled button if there is ongoing request', async () => {
            await setup();

            // const button = screen.getByRole('button', { name: 'Sign up' });
            await userEvent.click(button);
            await userEvent.click(button);

            await screen.findByText('Please check your e-mail to activate your account!');

            expect(counter).toBe(1);
        });

        it('displays spinner while the api request in progress', async () => {
            const {container} = await setup();

            // const button = screen.getByRole('button', { name: 'Sign up'} );
            await userEvent.click(button);

            const spinner = container.querySelector('.spinner');
            expect(spinner).toBeInTheDocument();
        });

        it('does not displays spinner while there is no api request', async () => {
            const {container} = await setup();

            const spinner = container.querySelector('.spinner');
            expect(spinner).not.toBeInTheDocument();
        });

        it('does not display account activation message before sign up', async () => {
            await setup();

            const text = screen.queryByText('Please check your e-mail to activate your account!');
            expect(text).not.toBeInTheDocument();
        });

        it('displays account activation information after successful sign up request', async () => {
            await setup();

            await userEvent.click(button);

            const text = await screen.findByText('Please check your e-mail to activate your account!');
            expect(text).toBeInTheDocument();
        });

        it('does not displays account activation information after failing sign up request', async () => {
            server.use(
                rest.post(
                    '/api/1.0/users',
                    (request, response, context) => {
                        return response(context.status(400));
                    })
            );

            await setup(false);

            await userEvent.click(button);

            const text = await screen.queryByText('Please check your e-mail to activate your account!');
            expect(text).not.toBeInTheDocument();
        });

        it('hides sign up form after successful request', async () => {
            await setup();

            await userEvent.click(button);

            const form = screen.queryByRole('form');
            await waitFor(() => {
                expect(form).not.toBeInTheDocument();
            });
        });

        const generateValidationError = (field, message) => {
            return rest.post(
                '/api/1.0/users',
                (request, response, context) => {
                    return response(context.status(400), context.json({
                        validationErrors: {
                            [field]: message,
                        }
                    }));
                })
        }

        it('hides spinner after response receive', async () => {
            server.use(
                generateValidationError('username', 'Username cannot be null')
            );

            await setup();
            await userEvent.click(button);

            await screen.findByText('Username cannot be null');

            const spinner = await screen.queryByRole('status');
            expect(spinner).not.toBeInTheDocument();
        });

        it.each`
            field | message
            ${"username"} | ${"Username cannot be null"}
            ${"email"} | ${"Email cannot be null"}
            ${"password"} | ${"Password cannot be null"}
        `("display $message for $field", async ({ field, message }) => {
            server.use(
                generateValidationError(field, message)
            );

            await setup();

            await userEvent.click(button);

            const fieldValidationError = await screen.findByText(message);
            expect(fieldValidationError).toBeInTheDocument();
        });

        it('displays mismatch message for password repeat input', async () => {
            server.use(
                generateValidationError('password_repeat', 'Password mismatch')
            );

            await setup();
            await userEvent.type(password, 'demo');
            await userEvent.type(passwordRepeat, 'asdf');

            await userEvent.click(button);

            const fieldValidationError = await screen.findByText('Password mismatch');
            expect(fieldValidationError).toBeInTheDocument();
        });

        it('does not display mismatch message initially', async () => {
            render(SignUp);

            const mismatchText = screen.queryByText('Password mismatch');
            expect(mismatchText).not.toBeInTheDocument();
        });

        it.each`
            field | message | label
            ${'username'} | ${'Username cannot be null'} | ${'Username'}
            ${'email'} | ${'Email cannot be null'} | ${'Email'}
            ${'password'} | ${'Email cannot be null'} | ${'Password'}
        `('clears validation error after $field field is updated',
            async ({ field, message, label}) => {
            server.use(
                generateValidationError(field, message)
            );
            await setup();
            await userEvent.click(button);

            const fieldValidationError = await screen.findByText(message);

            const input = screen.getByLabelText(label);
            await userEvent.type(input, `updated_${field}_text`);

            expect(fieldValidationError).not.toBeInTheDocument();
        });
    });
});
