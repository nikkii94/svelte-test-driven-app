<script>
    import {Link} from "svelte-routing";
    import LanguageSelector from './LanguageSelector.svelte';
    import {_} from 'svelte-i18n';
    // export let name;
    import {auth} from '../store/stores';

    export let url = window.location.pathname;

</script>

<header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
    <Link to="/" class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
        <span class="fs-4">Svelte Demo App</span>
    </Link>

    <div class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <LanguageSelector />
    </div>

    <ul class="nav nav-pills">
        {#if $auth.isLoggedIn}
            <li class="nav-item">
                <Link to="/users" class="nav-link">{$_('users')}</Link>
            </li>
            <li class="nav-item">
                <Link to={`/user/${$auth.id}`} class="nav-link">{$_('profile')}</Link>
            </li>
        {:else}
            <li class="nav-item">
                <Link to="/login" class="nav-link">{$_('login')}</Link>
            </li>
            <li class="nav-item">
                <Link to="/signup" class="nav-link">{$_('signUp')}</Link>
            </li>
        {/if}

    </ul>
</header>