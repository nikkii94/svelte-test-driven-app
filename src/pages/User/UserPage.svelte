<script>
    // console.log($$props);
    import {getUser} from "../../api/apiCalls";
    import Spinner from "../../components/Spinner.svelte";
    import ProfileCard from "../../components/ProfileCard.svelte";

    export let id;
    let pendingApiCall = false;

    let user;

    const getUserData = async () => {
        pendingApiCall = true;
        try {
            user = await (await getUser(id)).json();
        } catch(err) {
            console.log(err);
        }
        pendingApiCall = false;
        // user = await apiCall.json();
    }
    getUserData();
</script>

<div data-testid="user-page">
    {#if pendingApiCall}
        <div class="text-center">
            <Spinner width="3rem" height="3rem" color="#f3f3f3" role="status" />
        </div>
    {:else}
        {#if user.id}
            <ProfileCard {user} />
        {:else}
            <div class="alert alert-danger">{user.message}</div>
        {/if}
    {/if}
</div>