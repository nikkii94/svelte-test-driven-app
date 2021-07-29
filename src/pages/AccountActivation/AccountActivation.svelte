<script>
    import {activate} from '../../api/apiCalls';
    import Spinner from "../../components/Spinner.svelte";

    export let token;
    let inProgress = activate(token);

</script>

<div data-testid="activate-page">
    {#await inProgress}
        <div class="spinner-wrapper">
            <Spinner width="3rem" height="3rem" color="#f3f3f3" role="status" />
        </div>
    {:then response}
        {#if response.ok}
            <div class="alert alert-success text-center">Account has been activated!</div>
        {:else}
            <div class="alert alert-danger text-center">Activation failure!</div>
        {/if}
    {/await}
</div>

<style>
    .spinner-wrapper {
        text-align: center;
        padding: 1rem;
    }
</style>