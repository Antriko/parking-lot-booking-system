<script setup>
useHead({
    title: 'Parking',
    link: [{
        rel: 'icon', 
        type: 'image/x-icon', 
        href: "/assets/images/favicon.ico" 
    }],
})
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
    font-family: "Nunito";
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    margin: 0;
    background-color: #DEE2E6;
}

body::-webkit-scrollbar {
    display: none;
}
</style>