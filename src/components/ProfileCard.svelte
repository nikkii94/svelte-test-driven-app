<script>
    export let user;
</script>

<div class="card">
    <div class="card-header text-center">
        <img class="border-rounded" src={user.image ?? '/images/user.png'} alt="user profile" />
    </div>
    <div class="card-body">
        <h3 class="text-center"> {user.username}</h3>
    </div>
</div>


<style>
    img {
        width: 150px;
        height: auto;
    }
</style>
