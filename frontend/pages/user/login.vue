<script>
export default {
    name: "LoginForm",
    data() {
        return {
            form: {
                username: "",
                password: "",
            },
            message: "",
        }
    },
    methods: {
        handleSubmit: async function() {
            const login = await $fetch("http://localhost:3001/login", {
                method: "POST",
                body: {
                    username: this.form.username,
                    password: this.form.password
                }
            })
            console.log(login)
            if (login) {
                this.form.username = "";
                this.form.password = "";
                this.message = login;
            }
        }
    }   
}
</script>

<template>
    <div class="flex flex-wrap">
        <form class="pa4" @submit.prevent="handleSubmit">
            <div class="flex flex-wrap w-100">
                <label for="username" class="mb2">Username</label>
                <input id="username" name="username" class="input-reset w-100 ba pa2 mb4 b-- br1" v-model="form.username" required>

                <label for="password" class="mb2">Password</label>
                <input id="password" name="password" class="input-reset w-100 ba pa2 mb4 b-- br1" v-model="form.password" required>
            </div>
            <div class="flex flex-wrap w-100 w-40-l">
                <button class="w-100 w-25-m button-reset link dim br1 ph3 pv2 mb2 bg-white pointer">Login</button>
            </div>
            <div class="flex flex-wrap w-100">
                {{ message }}
            </div>
        </form>
    </div>
</template>