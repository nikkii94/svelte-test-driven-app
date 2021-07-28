<script>
	import SignUp from './pages/SignUp.svelte';
	import LanguageSelector from './components/LanguageSelector.svelte';
	// export let name;

    const changeListener = event => {
        console.log('App receiving');
    }

</script>

<!--<svelte:head>-->
<!--    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">-->
<!--</svelte:head>-->

<div class="container">
    <SignUp on:myCustomInputEvent={changeListener} />
    <LanguageSelector />
</div>

<style>
</style>