<script>
    export let text = '';
    export let role = 'status';
    export let width = '';
    export let height = '';
    export let color = '';
</script>

<span style="--width: {`${width}`}; --height: {`${height}`}; --color: {`${color}`};"
      class="spinner spinner-border spinner-border-sm" role={role}></span>
{text}

<style>
    .spinner {
        width: var(--width, 1rem);
        height: var(--height, 1rem);
        color: var(--color, inherit);
    }
</style>