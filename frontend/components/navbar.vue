<script setup>
const { data: data } = await useFetch('http://localhost:3001/verify')
</script>

<template>
    <nav class="flex justify-between white bg-dark-gray">
        <div class="flex pa3">
            <NuxtLink class="link white dim mh1 pa1" to="/">Icon</NuxtLink>
        </div>

        <div class="flex pa3 flex items-center mr4" v-if="!data.username">
            <NuxtLink class="link white dim mh1 pa1" to="/user/login">Login</NuxtLink>
        </div>

        <div class="flex pa3 flex items-center mr4" v-else>
            <NuxtLink class="link white dim mh1 pa1" to="/login">{{data.username}}</NuxtLink>
        </div>

    </nav>
</template>