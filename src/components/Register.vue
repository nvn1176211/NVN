<script setup>
</script>

<template>
    <div class="row justify-content-center">
        <div class="col col-md-6">
            <div class="card p-5 m-auto mt-5">
                <h3 class="card-title text-center">
                    <router-link to="/" class="text-decoration-none">NVN</router-link>
                </h3>
                <form @submit.prevent method="post" action="http://localhost:5173/register">
                    <div class="mb-3 mt-3">
                        <label for="email" class="form-label">Email:</label>
                        <input id="email" class="form-control" type="text" name="email" autocomplete="off">
                    </div>
                    <div class="mb-3 mt-3">
                        <label for="username" class="form-label">Username:</label>
                        <input id="username" class="form-control" type="text" name="username" autocomplete="off">
                    </div>
                    <div class="mb-5 mt-3">
                        <label for="password" class="form-label">Password:</label>
                        <input id="password" class="form-control" type="password" name="password" autocomplete="off">
                    </div>
                    <div class="mb-3 mt-3">
                        <button class="btn btn-primary float-end" type="submit">Register</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>