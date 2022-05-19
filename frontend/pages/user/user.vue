<script setup>
const token = useCookie("token")
if (!token._value) {
    navigateTo("/")
}
</script>

<script>
export default {
    methods: {
        logout: async function() {
            await $fetch("http://localhost:3001/logout", {
                credentials: "include"
            })
            window.location.reload(true)
        }
    }
};
</script>

<template>
    <div class="flex flex-wrap pa3 pa5-l">
        <div class="w-100 mt3 mb3 f2">
            <NuxtLink class="link black dim b" to="/user/bookings">View bookings</NuxtLink>
        </div>
        <div class="w-100 mt5">
            <button @click="logout" class="link br1 ph3 pv2 mb2 mr2 ba black dim w-25 pointer tc">Logout</button>
        </div>
    </div>
</template>