<script>
    import {_} from 'svelte-i18n';
    import Input from "../../components/Input.svelte";
    import {signUp} from "../../api/apiCalls";
    import ButtonWithProgress from "../../components/ButtonWithProgress.svelte";
    import Card from "../../components/Card.svelte";

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

<div class="row" data-testid="signup-page">
    {#if !signUpSuccess}
        <form class="col d-flex justify-content-center">
            <Card>
                <h1 class="text-center" slot="header">{$_('signUp')}</h1>

                <div slot="body">
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

                    <ButtonWithProgress
                            onClick={submit}
                            {disabled}
                            inProgress={isSubmitting}>
                        {$_('submit')}
                    </ButtonWithProgress>
                </div>
            </Card>
        </form>
    {/if}
    {#if signUpSuccess}
        <div class="alert alert-success" role="alert">
            Please check your e-mail to activate your account!
        </div>
    {/if}
</div>


<style>
    div {
        width: 100%;
    }
</style>