<script>
    import Spinner from './Spinner.svelte';
    export let onClick;
    export let disabled;
    export let inProgress;
</script>


<button class="btn btn-primary"
        type="submit"
        on:click|preventDefault={onClick}
        {disabled}>
    {#if inProgress}
        <Spinner role="status"/>
    {/if}
    <slot />
</button>

<style>
    button {
        cursor: pointer;
        border: none;
        color: white;
        padding: .5rem 1rem;
    }

    button:disabled {
        opacity: .65;
    }

    button:not(:disabled) {
        opacity: 1;
    }
</style>