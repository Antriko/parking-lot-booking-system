<script setup>
</script>

<template>
    <div>
        <client-only>
            <Navbar />
            <NuxtPage />
        </client-only>
    </div>
</template>

<style> 
@import "@/assets/css/tachyons.min.css";

@import url("https://fonts.googleapis.com/css?family=Nunito");
body {
    height: 100vh;
    font-family: "Nunito";
    overflow: hidden;
}
</style>