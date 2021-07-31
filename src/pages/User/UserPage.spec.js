import {render, screen, waitFor} from "@testing-library/svelte";
import UserPage from './UserPage.svelte';
import {setupServer} from "msw/node";
import {rest} from 'msw';
import 'whatwg-fetch';
import UserList from "../../components/UserList.svelte";

const server = setupServer();

beforeAll(() => server.listen());

afterAll(() => server.close());

beforeEach(() => server.resetHandlers());

describe('User Page', () => {
    let counter = 0;

    const testUser = {
        "id": 1,
        "username": "user1",
        "email": "user1@mail.com",
        "image": "/images/dog.jpg"
    };

    beforeEach(() => {
        counter = 0;
        server.use(
            rest.get(
                '/api/1.0/users/1',
                (request, response, context) => {
                    counter++;
                    return response(
                        context.status(200),
                        context.json(testUser)
                    );
                }),
            rest.get(
                '/api/1.0/users/100',
                (request, response, context) => {
                    counter++;
                    return response(
                        context.status(404),
                        context.json({message: 'User not found'})
                    );
                })
        );
    });

    it('displays user name on page when user is found', async () => {
        render(UserPage, { id: 1 });

        await waitFor(async () => {
            expect(screen.queryByText('user1')).toBeInTheDocument();
        });
    });

    it('displays spinner while the api call is in progress', async () => {
        render(UserPage, { id: 1 });
        const spinner = screen.queryByRole('status');
        await screen.findByText('user1');
        expect(spinner).not.toBeInTheDocument();
    });

    it('displays error message received from backend when user not found', async () => {
        render(UserPage, { id: 100 });
        await waitFor(async () => {
            expect(screen.queryByText('User not found')).toBeInTheDocument();
        });
    })
})