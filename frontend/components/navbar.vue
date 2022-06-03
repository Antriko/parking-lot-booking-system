<script setup>
const { data: data } = await $fetch("/api/verify", {
    credentials: "include"
})
</script>

<template>
    <nav class="flex justify-between white bg-dark-gray nav">
        <div class="flex pa3">
            <NuxtLink class="link white dim mh1 pa1" to="/">Parking</NuxtLink>
        </div>

        
        <div class="flex pa3 flex items-center mr4-l" v-if="!data">
            <NuxtLink class="link white dim mh1 pa1" to="/user/login">Login</NuxtLink>
        </div>

        <div class="flex pa3 flex items-center mr4-l" v-else>
            <NuxtLink class="link white dim mh1 pa1" to="/user/user">{{data.username}}</NuxtLink>
        </div>
        
    </nav>
</template>