<script>
    import {_} from 'svelte-i18n';
    import Input from "../../components/Input.svelte";
    import {login} from "../../api/apiCalls";
    import {navigate} from 'svelte-routing';
    import ButtonWithProgress from "../../components/ButtonWithProgress.svelte";
    import Card from "../../components/Card.svelte";
    import { auth } from '../../store/stores';

    let isSubmitting = false;
    let loginSuccess = false;
    let disabled;
    let error = '';

    let email = '';
    let password = '';

    $: disabled = email === '' || password === '' || isSubmitting;

    const submit = async () => {
        isSubmitting = true;

        try {
            const response = await login({
                email,
                password,
            });

            if (response.ok) {
                loginSuccess = true;
                const user = await response.json();
                $auth = {
                    ...user,
                    header: `Bearer ${user.token}`,
                    isLoggedIn: true
                }
                navigate('/');
            } else {
                const {message} = await response.json();
                error = message;
            }

        } catch (err) {
            loginSuccess = false;
        }

        isSubmitting = false;
    };
</script>

<div class="row" data-testid="login-page">
    <form class="col d-flex justify-content-center">
        <Card>
            <h1 slot="header">{$_('login')}</h1>
            <div slot="body">
                {#if error}
                    <div class="alert alert-danger">{error}</div>
                {/if}
                <div class="mb-3">
                    <Input
                            name="email"
                            label="{$_('email')}"
                            type="email"
                            on:input={(e) => {email = e.target.value; error = '';}}
                            id="email"/>
                </div>
                <div class="mb-3">
                    <Input
                            name="password"
                            label="{$_('password')}"
                            type="password"
                            on:input={(e) => {password = e.target.value; error = '';}}
                            id="password"/>
                </div>

                <ButtonWithProgress
                        onClick={submit}
                        {disabled}
                        inProgress={isSubmitting}>
                    {$_('login')}
                </ButtonWithProgress>
            </div>
        </Card>
    </form>
</div>

<style>
    div {
        width: 100%;
    }
</style>