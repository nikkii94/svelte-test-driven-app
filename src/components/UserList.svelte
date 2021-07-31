<script>
    import {getUsers} from '../api/apiCalls';
    import { _ } from 'svelte-i18n';
    import {fade} from 'svelte/transition';
    import UserListItem from "./UserListItem.svelte";
    import Spinner from "./Spinner.svelte";

    let page = {
        content: [],
        page: 0,
        totalPages: 1,
    };

    let pendingApiCall = false;

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
        pendingApiCall = true;
        let apiCall = await getUsers(currentPage);
        page = await apiCall.json();
        pendingApiCall = false;

        if (!currentPage) {
            try {
                page.content[1].image = '/images/dog.jpg';
            } catch (err) {
            }
        }
    };
    users();
</script>

<div class="card">
    <div class="card-header text-center border-bottom-0">
        <h3>{$_('users')}</h3>
    </div>
    <div class="card-body p-0">
        <ul class="list-group list-group-flush border">
        {#if pendingApiCall}
            <div class="d-flex justify-content-center align-items-center">
                <Spinner width="3rem" height="3rem" color="#f1f1f1" />
            </div>
        {:else}
            {#each page.content as user (user.id)}
                <UserListItem {user} />
            {/each}
        {/if}
        </ul>
        <nav class="card-footer border-top-0" aria-label="users pagination">
            <ul class="pagination justify-content-center pt-2 mb-0">
                <li class="page-item" class:disabled={page.page === 0}>
                    <a transition:fade on:click={previousClick}
                       class="page-link"
                       href="#"
                       tabindex="-1"
                       aria-disabled="true">
                        {$_('previousPage')}
                    </a>
                </li>
                {#each Array.from({ length: page.totalPages}) as p, index}
                    <li class="page-item" class:active={index === page.page}>
                        <a transition:fade
                           on:click={pageClick}
                           class="page-link"
                           href="#">{index+1}
                        </a>
                    </li>
                {/each}
                <!--                <li class="page-item active" aria-current="page"><a class="page-link" href="#">1</a></li>-->
                <li class="page-item" class:disabled={page.page === (page.totalPages - 1)}>
                    <a transition:fade on:click={nextClick} class="page-link" href="#">
                        {$_('nextPage')}
                    </a>
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