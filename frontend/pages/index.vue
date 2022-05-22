<script setup>
const token = useCookie("token")
</script>

<template>
    <div>
        <div class="flex flex-wrap pa3 pa5-l">
            <div class="w-100 mt3 mb3 f2">
                <NuxtLink class="link black dim" to="/booking" v-if="token">Book now</NuxtLink>
                <NuxtLink class="link black dim" to="/user/login" v-else>Login</NuxtLink>
            </div>
            <div class="w-100 mt3 mb3 f5">
                Created and designed by Antriko H.
            </div>
        </div>
    </div>
</template>