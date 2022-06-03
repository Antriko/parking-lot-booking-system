<script setup>
const token = useCookie("token")
if (!token._value) {
    navigateTo("/")
}

var vehicleInfo = await $fetch("/api/getVehicle", {
    credentials: "include"
})

const { data: data } = await $fetch("/api/verify", {
    credentials: "include"
})
</script>

<script>
export default {
    methods: {
        logout: async function() {
            await $fetch("/api/logout", {
                credentials: "include"
            })
            window.location.reload(true)
        }
    }
};
</script>

<template>
    <div class="flex flex-wrap pa3 pa5-l">
        <div class="flex flex-wrap-reverse flex-wrap-l w-100 mt3 mb3 f2" v-if="vehicleInfo.length > 0">
            <div class="w-100">
                <p class="b f3 f2-ns mt4 black lh-solid mb1">Logged in as {{data.username}}</p>
            </div>
            <div class="w-100 w-25-l">
                <NuxtLink class="f3 link dim ph4 pv3 mb0 br4 dib white bg-black" to="/user/vehicle">Amend vehicle</NuxtLink>
            </div>
            <div class="flex flex-wrap w-100 w-50-l">
                <div class="w-100 f3">
                    Current vehicle
                </div>
                <div class="w-100">
                    {{ vehicleInfo[0].vehicleName }}
                </div>
                <div class="w-100">
                    {{ vehicleInfo[0].vehicleReg }}
                </div>
            </div>
        </div>
        <div class="flex flex-wrap w-100 mb3 f2" v-else>
            <div class="w-100">
                <NuxtLink class="f3 link dim ph4 pv3 mb0 br4 dib white bg-black" to="/user/vehicle">Add vehicle</NuxtLink>
            </div>
        </div>
        <div class="w-100 mt3 mb3 f2">
            <NuxtLink class="f3 link dim ph4 pv3 mb0 br4 dib white bg-black" to="/booking">Create booking</NuxtLink>
        </div>
        <div class="w-100 mt3 mb3 f2">
            <NuxtLink class="f3 link dim ph4 pv3 mb0 br4 dib white bg-black" to="/user/bookings">View bookings</NuxtLink>
        </div>
        <div class="w-100 mt5">
            <button @click="logout" class="f3 link dim ph4 pv3 mb0 br4 dib white bg-black">Logout</button>
        </div>
    </div>
</template>