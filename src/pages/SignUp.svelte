<script>
    import Spinner from "../components/Spinner.svelte";

    let isSubmiting = false;
    let disabled;
    let username = '';
    let email = '';
    let password = '';
    let passwordRepeat = '';

    $: disabled = password === '' || password !== passwordRepeat;

    const submit = () => {
        isSubmiting = true;
        fetch('/api/1.0/users', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username, email, password
            })
        })
            .then(result => result.json())
            .then(response => {
                console.log(response);

                if (response.validationErrors) {
                    for (const name in response.validationErrors) {
                        console.log(name, response.validationErrors[name]);
                    }
                }
            })
            .finally(() => isSubmiting = true);
    }

</script>

<div class="form-wrapper col-12">
    <form class="card mt-5">
        <div class="card-header">
            <h1>Sign Up</h1>
        </div>
        <div class="card-body">
            <div class="mb-3">
                <label class="form-label">Username</label>
                <input class="form-control" bind:value={username} name="username" type="text"/>
            </div>
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input class="form-control" bind:value={email} name="email" type="email"/>
            </div>
            <div class="mb-3">
                <label class="form-label">Password</label>
                <input class="form-control" bind:value={password} name="password" type="password"/>
            </div>
            <div class="mb-3">
                <label class="form-label">Password repeat</label>
                <input class="form-control" bind:value={passwordRepeat} name="password_repeat" type="password"/>
            </div>

            <button class="btn btn-primary" type="submit" on:click|preventDefault={submit} {disabled}>
                {#if isSubmiting}
                    <Spinner/>
                {/if}
                Sign up
            </button>
        </div>
    </form>
</div>

<style>
    .form-wrapper {
        display: flex;
        justify-content: center;
    }
    h1 {
        text-align: center;
    }

    .card-header {
        background: #f3f3f3;
    }

    .card-body {
        width: 100%;
        max-width: 50vw;
        background: #fefefe;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    div {
        width: 100%;
        /*display: inline-block;*/
    }

    span {
        /*display: inline-block;*/
    }

    button {
        cursor: pointer;
        /*background: darkcyan;*/
        border: none;
        color: white;
        padding: .5rem 1rem;
    }

    button:disabled {
        opacity: .65;
    }

    button:not(:disabled) {
        opacity: 1;
        /*background: darkcyan;*/
    }
</style>