<script setup>
const token = useCookie("token")
if (token._value) {
    navigateTo("/user/user")
}
</script>

<script>
export default {
    name: "RegisterForm",
    data() {
        return {
            form: {
                username: "",
                password: "",
            },
            message: "",
        }
    },
    beforeCreate() {
        document.body.className = 'hideOverflow';
    },
    beforeRouteLeave() {
        document.body.className = '';
    },
    methods: {
        handleSubmit: async function() {
            const register = await $fetch("/api/register", {
                method: "POST",
                credentials: "include",
                body: {
                    username: this.form.username,
                    password: this.form.password
                }
            })
            // Successful register has no message so unsuccessful has a error message to display
            console.log(register)
            if (register) {
                this.form.username = "";
                this.form.password = "";
                this.message = register;
            } else {
                window.location.reload(true)
            }
        }
    }   
}
</script>

<template>
    <div class="flex form-design">
        <form class="flex flex-column justify-center pa4 pa5-l w-100 w-30-l ml6-l form" @submit.prevent="handleSubmit">
            <div class="flex flex-wrap w-100 pb3">
                <div class="w-50 black b f2">
                    Register
                </div>
                <div class="w-50 red self-end tr" v-if="message">
                    {{ message }}
                </div>
            </div>
            <div class="flex flex-wrap w-100">
                <label for="username" class="mb2 f4">Username</label>
                <input id="username" name="username" class="input-reset w-100 ba pa2 mb4 b-- br1" v-model="form.username" required>

                <label for="password" class="mb2 f4">Password</label>
                <input id="password" name="password" class="input-reset w-100 ba pa2 mb4 b-- br1" v-model="form.password" required>
            </div>

            <div class="flex flex-wrap w-100">
                <button class="w-100 f3 link dim ph4 pv3 mb4 br4 dib white bg-black pointer">Register</button>
            </div>
            <div class="flex flex-wrap justify-around mt2-l tc">
                <NuxtLink class="w-100 f3 link dim ph4 pv3 mb2 br4 dib white bg-black" to="/user/login">Login</NuxtLink>
                <NuxtLink class="w-100 f3 link dim ph4 pv3 mb2 br4 dib white bg-black" to="/user/reset">Forgot password?</NuxtLink>
            </div>
        </form>
    </div>
</template>