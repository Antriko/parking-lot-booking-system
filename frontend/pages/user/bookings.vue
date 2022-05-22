<script setup>
const token = useCookie("token")
if (!token._value) {
    navigateTo("/user/login")
}

const data  = await $fetch("http://localhost:3011/bookings", {
    credentials: "include",
})

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
</script>

<template>
    <div class="flex flex-wrap pa3 pa5-l">
        <div class="w-100 f2">
            Bookings
        </div>
        <div v-if="!data">Loading???</div>
        <div v-else class="w-100 flex flex-wrap-reverse">
            <div class="w-100 flex flex-wrap-reverse" v-for="bookings in data" :key="bookings">
                <div class="w-100 w-100-m w-75-l flex flex-wrap justify-between f3 mt3 pa3 outline grow pointer">
                    <div class="w-100 w-10-l flex flex-column mb3 mb0-l">
                        <div class="w-100 b">
                            Parking spot
                        </div>
                        <div class="w-100">
                            {{ bookings.parkingSlot }}
                        </div>
                    </div>

                    <div class="w-100 w-25-l flex flex-column mb3 mb0-l">
                        <div class="w-100 b">
                            From
                        </div>
                        <div class="w-100">
                            {{ new Date(bookings.timeFrom).toLocaleString("en-GB", dateOptions) }}
                        </div>
                        <div class="w-100">
                            {{ new Date(bookings.timeFrom).toLocaleTimeString() }}
                        </div>
                    </div>

                    <div class="w-100 w-25-l flex flex-column mb3 mb0-l">
                        <div class="w-100 b">
                            To
                        </div>
                        <div class="w-100">
                            {{ new Date(bookings.timeTo).toLocaleString("en-GB", dateOptions) }}
                        </div>
                        <div class="w-100">
                            {{ new Date(bookings.timeTo).toLocaleTimeString() }}
                        </div>
                    </div>

                    <div class="w-100 w-20-l flex flex-column mb3 mb0-l">
                        <div class="w-100 b">
                            Reference
                        </div>
                        <div class="w-100">
                            {{ bookings.ID }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>