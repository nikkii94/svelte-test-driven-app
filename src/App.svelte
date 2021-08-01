<script>
    import {Router, Route} from "svelte-routing";
    import HomePage from "./pages/Home/HomePage.svelte";
    import SignUp from "./pages/SignUp/SignUp.svelte";
    import Login from "./pages/Login/Login.svelte";
    import UserPage from "./pages/User/UserPage.svelte";
    import AccountActivation from "./pages/AccountActivation/AccountActivation.svelte";
    import UserListPage from "./pages/User/UserListPage.svelte";
    // export let name;
    import NavBar from "./components/NavBar.svelte";

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
        <NavBar />

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
