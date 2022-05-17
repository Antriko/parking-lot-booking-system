<script setup>
const token = useCookie("token")
if (token._value) {
    navigateTo("/user/user")
}
</script>

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
                credentials: "include",
                body: {
                    username: this.form.username,
                    password: this.form.password
                }
            })
            // Successful login has no message so unsuccessful has a error message to display
            console.log(login)
            if (login) {
                this.form.username = "";
                this.form.password = "";
                this.message = login;
            } else {
                window.location.reload(true)
            }
        }
    }   
}
</script>

<template>
    <div class="flex flex-wrap form-design">
        <form class="pa4 pt7-l pa5-l w-100 w-30-l bg-white ml6-l vh-100" @submit.prevent="handleSubmit">
            <div class="flex flex-wrap w-100 pb3">
                <div class="w-50 black b f2">
                    Login
                </div>
                <div class="w-50 red self-end tr" v-if="message">
                    {{ message }}
                </div>
            </div>
            <div class="flex flex-wrap w-100">
                <label for="username" class="mb2">Username</label>
                <input id="username" name="username" class="input-reset w-100 ba pa2 mb4 b-- br1" v-model="form.username" required>

                <label for="password" class="mb2">Password</label>
                <input id="password" name="password" class="input-reset w-100 ba pa2 mb4 b-- br1" v-model="form.password" required>
            </div>
            <div class="flex flex-wrap w-100 w-30-l">
                <button class="w-100 w-25-m button-reset link dim br2 ph3 pv2 mb2 bg-white pointer">Login</button>
            </div>

            <div class="flex flex-column mt5-l">
                <div class="mv1 pv1">
                    <NuxtLink class="link black dim" to="/user/register">Register</NuxtLink>
                </div>
                <div class="mv1 pv1">
                    <NuxtLink class="link black dim" to="/user/reset">Forgot</NuxtLink>
                </div>
            </div>

        </form>
    </div>
</template>

<style>
@media only screen and (min-width: 960px) { 
    .form-design {
        background: url("@/assets/images/two.jpg") no-repeat center center fixed;
        background-size: cover;
    }
}
</style>