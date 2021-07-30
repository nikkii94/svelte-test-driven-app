<script>
    import {Router, Link, Route} from "svelte-routing";
    import LanguageSelector from './components/LanguageSelector.svelte';
    import {_} from 'svelte-i18n';
    import HomePage from "./pages/Home/HomePage.svelte";
    import SignUp from "./pages/SignUp/SignUp.svelte";
    import Login from "./pages/Login/Login.svelte";
    import UserPage from "./pages/User/UserPage.svelte";
    import AccountActivation from "./pages/AccountActivation/AccountActivation.svelte";
    import UserListPage from "./pages/User/UserListPage.svelte";
    // export let name;

    export let url = window.location.pathname;

    const changeListener = event => {
        console.log('App receiving');
    }

</script>

<!--<svelte:head>-->
<!--    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">-->
<!--</svelte:head>-->

<Router url="{url}">
    <div class="container">
        <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
            <Link to="/" class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                <span class="fs-4">Svelte Demo App</span>
            </Link>

            <div class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                <LanguageSelector />
            </div>

            <ul class="nav nav-pills">
                <li class="nav-item">
                    <Link to="/" class="nav-link active" aria-current="page">{$_('home')}</Link>
                </li>
                <li class="nav-item">
                    <Link to="/login" class="nav-link">{$_('login')}</Link>
                </li>
                <li class="nav-item">
                    <Link to="/signup" class="nav-link">{$_('signUp')}</Link>
                </li>
                </ul>
        </header>

        <div class="container">
            <Route path="/">
                <HomePage />
            </Route>
            <Route path="/signup">
                <SignUp on:myCustomInputEvent={changeListener} />
            </Route>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/users">
                <UserListPage />
            </Route>
            <Route path="/user/:id" let:params>
                <UserPage id={params.id} />
            </Route>
            <Route path="/activate/:token" let:params>
                <AccountActivation token={params.token}/>
            </Route>
        </div>

    </div>
</Router>



<style>
</style>