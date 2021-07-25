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
        }).finally(() => isSubmiting = true);
    }

</script>

<h1>Sign Up</h1>

<form>
    <label>
        <span>Username</span>
        <input bind:value={username} name="username" type="text" />
    </label>
    <label>
        <span>Email</span>
        <input bind:value={email} name="email" type="email" />
    </label>
    <label>
        <span>Password</span>
        <input bind:value={password} name="password" type="password" />
    </label>
    <label>
        <span>Password repeat</span>
        <input bind:value={passwordRepeat} name="password_repeat" type="password" />
    </label>

    <button type="submit" on:click|preventDefault={submit} {disabled}>
        {#if isSubmiting}
            <Spinner />
        {/if}
        Sign up
    </button>
</form>

<style>
    h1 {
        text-align: center;
    }
    form {
        padding: 2rem;
        background: #f3f3f3;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }

    label {
        display: inline-block;
    }

    span {
        display: inline-block;
        min-width: 120px;
        max-width: 200px;
    }

    button {
        cursor: pointer;
        background: darkcyan;
        border: none;
        color: white;
        padding: .5rem 1rem;
    }

    button:disabled {
        opacity: .65;
    }

    button:not(:disabled) {
        opacity: 1;
        background: darkcyan;
    }
</style>