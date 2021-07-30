import {render, screen, waitFor} from "@testing-library/svelte";
import UserList from './UserList.svelte';
import {setupServer} from 'msw/node';
import {rest} from 'msw';
import 'whatwg-fetch';
import userEvent from "@testing-library/user-event";

const server = setupServer();

beforeAll(() => server.listen());

afterAll(() => server.close());

beforeEach(() => server.resetHandlers());

const page1 = {
    "content": [
        {"id": 1, "username": "user1", "email": "user1@mail.com", "image": null},
        {
            "id": 2,
            "username": "user2",
            "email": "user2@mail.com",
            "image": null
        },
        {"id": 3, "username": "user3", "email": "user3@mail.com", "image": null}
    ],
    "page": 0,
    "size": 3,
    "totalPages": 9
};

const users = [
    {"id": 1, "username": "user1", "email": "user1@mail.com", "image": null},
    {
        "id": 2,
        "username": "user2",
        "email": "user2@mail.com",
        "image": null
    },
    {"id": 3, "username": "user3", "email": "user3@mail.com", "image": null},
    {
        "id": 4,
        "username": "user4",
        "email": "user4@mail.com",
        "image": null
    },
    {"id": 5, "username": "user5", "email": "user5@mail.com", "image": null},
    {
        "id": 6,
        "username": "user6",
        "email": "user6@mail.com",
        "image": null
    },
    {"id": 7, "username": "user7", "email": "user7@mail.com", "image": null},
    {
        "id": 8,
        "username": "user8",
        "email": "user8@mail.com",
        "image": null
    },
    {"id": 9, "username": "user9", "email": "user9@mail.com", "image": null},
    {
        "id": 10,
        "username": "user10",
        "email": "user10@mail.com",
        "image": null
    }
];

const getPage = (page, size) => {
    let start = page * size;
    let end = start + size;
    let totalPages = Math.ceil(users.length / size);
    return {
        content: users.slice(start, end),
        page,
        size,
        totalPages
    };
}

describe('Users page', () => {
    let counter = 0;
    let defaultSize = 3;

    beforeEach(() => {
        counter = 0;
        server.use(
            rest.get(
                '/api/1.0/users',
                (request, response, context) => {
                    counter++;
                    const page = +request.url.searchParams.get('page') || 0;
                    // const size = +request.url.searchParams.get('size') ?? defaultSize;
                    return response(
                        context.status(200),
                        context.json(getPage(page, defaultSize))
                    );
                })
        );
    });

    it('displays 3 users in list', async () => {
        render(UserList);

        await waitFor(() => {
            const users = screen.queryAllByText(/user/);
            expect(users.length).toBe(3);
        });
    });

    it('displays next page link', async () => {
        render(UserList);

        await screen.findByText('user1');
        expect(screen.queryByText('Next')).toBeInTheDocument();
    });

    it('displays next page after clicking next', async () => {
        render(UserList);
        const nextLink = await screen.findByText('Next');
        await userEvent.click(nextLink);
        expect(await screen.findByText(`user${defaultSize+1}`)).toBeInTheDocument();
    });

    it('disables next button if there is no next page', async () => {
        render(UserList);
        const nextLink = await screen.findByText('Next');

        await userEvent.click(nextLink);
        await screen.findByText(`user${defaultSize+1}`);

        await userEvent.click(nextLink);
        await screen.findByText(`user${defaultSize * 2 +1}`);

        await userEvent.click(nextLink);
        await screen.findByText(`user${defaultSize * 3 +1}`);

        expect(nextLink.parentElement.classList).toContain('disabled');
    });

    it('displays previous page link', async () => {
        render(UserList);

        await screen.findByText('user1');
        expect(screen.queryByText('Previous')).toBeInTheDocument();
    });

    it('displays previous page link as disabled initially', async () => {
        render(UserList);

        await screen.findByText('user1');

        const previousLink = await screen.findByText('Previous');
        expect(previousLink.parentElement.classList).toContain('disabled');
    });

    it('enables previous page after clicking next', async () => {
        render(UserList);
        const nextLink = await screen.findByText('Next');
        await userEvent.click(nextLink);

        await screen.findByText(`user${defaultSize+1}`);

        const previousLink = await screen.findByText('Previous');
        expect(previousLink.parentElement.classList).not.toContain('disabled');
    });

    it('displays previous page after clicking previous link', async () => {
        render(UserList);
        const nextLink = await screen.findByText('Next');
        await userEvent.click(nextLink);

        await screen.findByText(`user${defaultSize+1}`);

        const previousLink = await screen.findByText('Previous');
        await userEvent.click(previousLink);

        expect(await screen.findByText(`user1`)).toBeInTheDocument();
    })
});