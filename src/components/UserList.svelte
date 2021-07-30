<script>
    import {getUsers} from '../api/apiCalls';

    let page = {
        content: [],
        page: 0,
        totalPages: 1,
    };

    const nextClick = async () => {
        await users(page.page + 1);
    };

    const previousClick = async () => {
        await users(page.page - 1);
    };

    const pageClick = async (event) => {
        await users(+((event.target.innerText).trim()) - 1);
    }

    const users = async (currentPage) => {
        let apiCall = await getUsers(currentPage);
        page = await apiCall.json();
    };
    users();
</script>

<div class="card border-0">
    <div class="card-header text-center border-bottom-0">
        <h3>Users</h3>
    </div>
    <div class="card-body p-0">
        <ul class="list-group list-group-flush border">
            {#each page.content as user}
                <li class="list-group-item list-group-item-action">{user.username}</li>
            {/each}
        </ul>
        <nav class="" aria-label="users pagination">
            <ul class="pagination justify-content-center pt-2 mb-0">
                <li class="page-item" class:disabled={page.page === 0}>
                    <a on:click={previousClick} class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                </li>
                {#each Array.from({ length: page.totalPages}) as p, index}
                    <li class="page-item">
                        <a on:click={pageClick} class="page-link" class:active={index === page.page} href="#">{index+1}</a>
                    </li>
                {/each}
<!--                <li class="page-item active" aria-current="page"><a class="page-link" href="#">1</a></li>-->
                <li class="page-item" class:disabled={page.page === (page.totalPages - 1)}>
                    <a on:click={nextClick} class="page-link" href="#">Next</a>
                </li>
            </ul>
        </nav>
    </div>
</div>

<style>
    li {
        cursor: pointer;
    }
</style>