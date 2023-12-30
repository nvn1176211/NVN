<script setup>
</script>

<template>
    <div class="row justify-content-center">
        <div class="col col-md-6">
            <div class="card p-5 m-auto mt-5">
                <h3 class="card-title text-center">
                    <router-link to="/" class="text-decoration-none">NVN</router-link>
                </h3>
                <form method="post" id="loginForm">
                    <div class="mb-3 mt-3">
                        <label for="username" class="form-label">Username:</label>
                        <input id="username" class="form-control" type="text" name="username" autocomplete="off">
                    </div>
                    <div class="mb-5 mt-3">
                        <label for="password" class="form-label">Password:</label>
                        <input id="password" class="form-control" type="text" name="password" autocomplete="off">
                    </div>
                    <div class="d-flex justify-content-between">
                        <a href="javascript:void(0)">Create Account</a>
                        <button class="btn btn-primary" type="button">SIGN IN</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>