<script setup>
const token = useCookie("token")
</script>
<script>
export default {
    beforeCreate() {
        document.body.className = 'dark-background';
    },
    beforeRouteLeave() {
        document.body.className = '';
    },
}
</script>


<template>
    <div>
        <div class="flex flex-wrap justify-center h-100">
            <div class="flex flex-wrap justify-center w-100 one">
                <div class="flex pa3 pa5-l w-100 w-40-l">
                    <div class="flex flex-wrap justify-around w-100 mt3 mb3">
                        <div class="w-100">
                            <p class="b f2 black lh-solid">Parking Lot Booking Systemssss</p>
                            <p class="f3">A web application in which the main functionality is to reserve a parking spot, there will be no conflicts between bookings so everyone who books gets the spot they've chosen at the time without any hassle.</p>
                        </div>
                        <div class="w-100">
                            <NuxtLink class="f3 link dim ph4 pv3 mb3 br4 dib white bg-black" to="/booking" v-if="token">Book now</NuxtLink>
                            <NuxtLink class="f3 link dim ph4 pv3 mb3 br4 dib white bg-black" to="/user/login" v-else>Book now</NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="flex pa3 pa5-l w-100 w-30-l">
                    <div class="br4 grow one-image"></div>
                </div>
            </div>


            <div class="flex flex-wrap-reverse flex-wrap-l justify-center w-100 two">
                <div class="flex pa3 pa5-l w-100 w-30-l">
                    <div class="br4 grow two-image"></div>
                </div>

                <div class="flex pa3 pa5-l w-100 w-40-l">
                    <div class="w-100 mb3 self-end tr">
                        <NuxtLink class="f3 link dim ph4 pv3 mb0 br4 dib white bg-black" to="https://github.com/Antriko/parking-lot-booking-system">github repo</NuxtLink>
                        <p class="b f3 f2-ns mt4 black lh-solid mb1">Created and designed by Antriko H.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .one-image {
        background: url("@/assets/images/three.jpg") no-repeat center center fixed;
        background-size: cover;
        background-repeat: no-repeat;
        height: 100%;
        width: 100%;
        padding-top: 66.64%;
    }
    .two-image {
        background: url("@/assets/images/four.jpg") no-repeat center center fixed;
        background-size: cover;
        background-repeat: no-repeat;
        width: 100%;
        height: 0;
        padding-top: 66.64%;
    }
    .one {
        background-color: #adb5bd;
    }
    .two {
        background-color: #6c757d;
    }
    .dark-background {
        background-color: #6c757d;
    }
</style>