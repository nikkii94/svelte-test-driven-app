<script>
    import '../api/apiCalls';
    import {locale} from 'svelte-i18n';
</script>

<img title="Magyar"
     on:click={() => locale.set('hu')}
     src="/images/hu.png"
     alt="Hungarian flag" />

<img title="English"
     on:click={() => locale.set('en')}
     src="/images/en.png"
     alt="English flag" />

<style>
    img {
        height: 40px;
        cursor: pointer;
    }

    img:hover{
        opacity: .8;
    }
</style>