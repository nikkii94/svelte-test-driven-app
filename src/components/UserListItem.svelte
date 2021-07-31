<script>
    import { link } from 'svelte-routing';
    export let user;

    let imageUrl = user.image ?? '/images/user.png';

    // $: imageUrl = user.image ?? '/images/user.png'; or keyed each for prevent component reuse
</script>

<a use:link href={`/user/${user.id}`}
   class="list-group-item list-group-item-action">
    <img class="rounded-circle" src={imageUrl} alt="user profile image" />
    {user.username}
</a>

<style>
    img {
        width: 30px;
        height: 30px;
        object-fit: cover;
        object-position: center;
        margin-right: 10px;
    }
</style>