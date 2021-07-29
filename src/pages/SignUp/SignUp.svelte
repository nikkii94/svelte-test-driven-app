<script>
    import {_, locale} from 'svelte-i18n';
    import Spinner from "../../components/Spinner.svelte";
    import Input from "../../components/Input.svelte";
    import {signUp} from "../../api/apiCalls";

    let isSubmitting = false;
    let signUpSuccess = false;
    let disabled;
    let passwordNotMatching;

    let form = {
        username: '',
        email: '',
        password: '',
        password_repeat: '',
    }

    let errors = {};

    $: disabled = form.password === '' || form.password !== form.password_repeat;
    $: passwordNotMatching = form.password !== form.password_repeat;

    const submit = async () => {
        isSubmitting = true;
        disabled = true;
        signUpSuccess = false;

        try {
            const response = await signUp({
                username: form.username,
                email: form.email,
                password: form.password,
            });

            if (response.ok) {
                signUpSuccess = true;
            }

            const {validationErrors} = await response.json();
            if (validationErrors) {
                signUpSuccess = false;
                errors = validationErrors;
            }
        } catch (err) {
            signUpSuccess = false;
        }

        isSubmitting = false;
        disabled = false;
    };

    const onChange = event => {
        const {name, value} = event.target;
        form[name] = value;
        errors[name] = '';
    }

</script>

<div class="form-wrapper col-12" data-testid="signup-page">
    {#if !signUpSuccess}
        <form class="card mt-5">
            <div class="card-header">
                <h1>{$_('signUp')}</h1>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <Input
                            name="username"
                            label="{$_('username')}"
                            type="text"
                            on:input={onChange}
                            on:myCustomInputEvent={onChange}
                            validationMessage={errors.username}
                            id="username"/>
                </div>
                <div class="mb-3">
                    <span class="d-none">Event forwarding example</span>
                    <Input
                            name="email"
                            on:input={onChange}
                            label="{$_('email')}"
                            type="email"
                            on:myCustomInputEvent
                            validationMessage={errors.email}
                            id="email"/>
                </div>
                <div class="mb-3">
                    <Input
                            name="password"
                            on:input={onChange}
                            label="{$_('password')}"
                            type="password"
                            validationMessage={errors.password}
                            id="password"/>
                </div>
                <div class="mb-3">
                    <Input
                            name="password_repeat"
                            on:input={onChange}
                            label="{$_('password_repeat')}"
                            type="password"
                            validationMessage={passwordNotMatching ? $_('password_mismatch') : ''}
                            id="password-repeat"/>
                </div>

                <button class="btn btn-primary" type="submit" on:click|preventDefault={submit} {disabled}>
                    {#if isSubmitting}
                        <Spinner role="status"/>
                    {/if} {$_('submit')}
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