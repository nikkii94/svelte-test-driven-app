<script>
    import { createEventDispatcher } from 'svelte';
    export let label = '';
    export let id = '';
    export let name = '';
    export let validationMessage = '';
    export let type = 'text';
    export let value = '';
    // export let onChange;

    const dispatch = createEventDispatcher();
    const handleInput = (e) => {
        dispatch('myCustomInputEvent', { value });
        value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
    };

</script>

<div class="form-group">
    <label class="form-label" for={id}>{label}</label>
    <input {name} {id} {type} {value} on:input={handleInput}
           class="form-control" class:is-invalid={validationMessage} />
    {#if validationMessage}
        <span class="invalid-feedback" role="alert">{validationMessage}</span>
    {/if}
</div>