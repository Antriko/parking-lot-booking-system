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
        <button @click="logout" class="link br1 ph3 pv2 mb2 mr2 ba black dim w-50 tc">Logout</button>
    </div>
</template>