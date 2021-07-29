<script>
    import {activate} from '../../api/apiCalls';
    import Spinner from "../../components/Spinner.svelte";

    export let token;
    let success = false;
    let fail = false;

    const sendActivationRequest = async () => {
        try {
            const response = await activate(token);
            success = response.ok;

            if (!success) {
                // const {message} = await response.json();
                fail = true;
            }
        } catch (err) {
            success = false;
            fail = true;
        }
    };
    let inProgress = sendActivationRequest();

</script>

<div data-testid="activate-page">
    {#await inProgress}
        <div class="spinner-wrapper">
            <Spinner width="3rem" height="3rem" color="#f3f3f3" role="status" />
        </div>
    {/await}
    {#if success}
        <div class="alert alert-success text-center">Account has been activated!</div>
    {:else if fail}
        <div class="alert alert-danger text-center">Activation failure!</div>
    {/if}
</div>

<style>
    .spinner-wrapper {
        text-align: center;
        padding: 1rem;
    }
</style>