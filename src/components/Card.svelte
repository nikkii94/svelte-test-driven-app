<div class="card">
    {#if $$slots.header}
        <div class="card-header">
            <slot name="header" />
        </div>
    {/if}
    {#if $$slots.body}
        <div class="card-body">
            <slot name="body"/>
        </div>
    {/if}
    <slot />
    {#if $$slots.footer}
        <div class="card-footer">
            <slot name="footer"/>
        </div>
    {/if}
</div>

<style>
    .card {
        width: 100%;
        max-width: 600px;
    }

    .card-header {
        background: #f3f3f3;
    }

    .card-body {
        width: 100%;
        background: #fefefe;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
    }
</style>