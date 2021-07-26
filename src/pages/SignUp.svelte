<script>
    import Spinner from "../components/Spinner.svelte";

    let isSubmiting = false;
    let signUpSuccess = false;
    let disabled;
    let username = '';
    let email = '';
    let password = '';
    let passwordRepeat = '';

    $: disabled = password === '' || password !== passwordRepeat;

    const submit = async () => {
        isSubmiting = true;
        disabled = true;
        signUpSuccess = false;

        fetch('/api/1.0/users', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username, email, password
            })
        }).then(result => {
            if (result.ok) {
                signUpSuccess = true;
            }
            return result.json();
        }).then(response => {

        }).catch(err => {
            signUpSuccess = false;
        }).finally(() => {
            isSubmiting = false;
            disabled = false;
        });

    };

</script>

<div class="form-wrapper col-12">
    {#if !signUpSuccess}
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
                        <Spinner role="status"/>
                        Sign up
                    {:else} Sign up
                    {/if}
                </button>
            </div>
        </form>
    {/if}
    {#if signUpSuccess}
        <div class="alert alert-success" role="alert">
            Please check your e-mail to activate your account!
        </div>
    {/if}
</div>

<style>
    .form-wrapper {
        display: flex;
        justify-content: center;
    }

    h1 {
        text-align: center;
    }

    .card {
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

    div {
        width: 100%;
    }

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