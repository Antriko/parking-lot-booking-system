<script setup>
const { data: info } = await useFetch('http://localhost:3001/verify')
definePageMeta({
  layout: false,
});
</script>

<template>
    <div>
        <Navbar />
        <NuxtPage />
    </div>
</template>

<style> 
    @import "@/assets/css/tachyons.min.css";

    @import url("https://fonts.googleapis.com/css?family=Ubuntu");
    body {
        font-family: "Ubuntu";
    }

</style>