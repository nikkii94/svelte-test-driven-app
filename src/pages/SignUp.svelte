<script>
    import Spinner from "../components/Spinner.svelte";
    import Input from "../components/Input.svelte";

    let isSubmitting = false;
    let signUpSuccess = false;
    let disabled;
    let passwordNotMatching;

    let username = '';
    let email = '';
    let password = '';
    let passwordRepeat = '';

    let errors = {};

    $: disabled = password === '' || password !== passwordRepeat;
    $: passwordNotMatching = password !== passwordRepeat;

    $: {
        // this is a dirty solution
        if (username) {
        }
        errors.username = '';
    }

    $: {
        // this is a dirty solution
        if (email) {
        }
        errors.email = '';
    }

    $: {
        // this is a dirty solution
        if (password) {
        }
        errors.password = '';
    }

    const submit = async () => {
        isSubmitting = true;
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
            if (response?.validationErrors) {
                signUpSuccess = false;
                const { validationErrors } = response;
                errors = validationErrors;
            } else {
                signUpSuccess = true;
            }
        }).catch(err => {
            signUpSuccess = false;
        }).finally(() => {
            isSubmitting = false;
            disabled = false;
        });
    };

    const onChangeUsername = event => {
        console.log(event.detail.value);
    }

</script>

<div class="form-wrapper col-12">
    {#if !signUpSuccess}
        <form class="card mt-5">
            <div class="card-header">
                <h1>Sign Up</h1>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <Input
                            name="username"
                            bind:value={username}
                            label="Username"
                            type="text"
                            on:myCustomInputEvent={onChangeUsername}
                            validationMessage={errors.username}
                            id="username" />
                </div>
                <div class="mb-3">
                    <span class="d-none">Event forwarding example</span>
                    <Input
                            name="email"
                            bind:value={email}
                            label="Email"
                            type="email"
                            on:myCustomInputEvent
                            validationMessage={errors.email}
                            id="email" />
                </div>
                <div class="mb-3">
                    <Input
                            name="password"
                            bind:value={password}
                            label="Password"
                            type="password"
                            validationMessage={errors.password}
                            id="password" />
                </div>
                <div class="mb-3">
                    <Input
                            name="password_repeat"
                            bind:value={passwordRepeat}
                            label="Password repeat"
                            type="password"
                            validationMessage={passwordNotMatching ? 'Password mismatch' : ''}
                            id="password-repeat" />
                </div>

                <button class="btn btn-primary" type="submit" on:click|preventDefault={submit} {disabled}>
                    {#if isSubmitting}
                        <Spinner role="status"/>
                    {/if} Sign up
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