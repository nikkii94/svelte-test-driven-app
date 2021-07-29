import { render, screen} from "@testing-library/svelte";
import AccountActivation from './AccountActivation.svelte';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import 'whatwg-fetch';

const server = setupServer();

beforeAll(() => server.listen());

afterAll(() => server.close());

beforeEach(() => server.resetHandlers());

describe('Account activation page', () => {
    let counter = 0;

    beforeEach(() => {
        counter = 0;
        server.use(
            rest.post(
                '/api/1.0/users/token/:token',
                (request, response, context) => {
                    counter++;
                    if (request.params.token === '12345') {
                        return response(
                            context.status(200)
                        );
                    }
                    return response(
                        context.status(400),
                        context.json({ message: 'Activation failure!' })
                    );
                })
        );
    });

    it('displays activation success message when token is correct', async () => {
        render(AccountActivation, { token: '12345' });

        expect(await screen.findByText( 'Account has been activated!'))
            .toBeInTheDocument();
    });

    it('sends activation request to backend', async() => {
        render(AccountActivation, { token: '12345' });

        await screen.findByText( 'Account has been activated!');
        expect(counter).toBe(1);
    });

    it('displays activation failure message when token is incorrect', async () => {
        render(AccountActivation, { token: '64661' });

        await screen.findByText( 'Activation failure!');
        expect(counter).toBe(1);
    });

    it('displays spinner while during activation api call', async () => {
        render(AccountActivation, { token: '64661' });

        const spinner = screen.queryByRole('status');
        expect(spinner).toBeInTheDocument();
    });
});