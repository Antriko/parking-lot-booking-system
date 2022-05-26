<script setup>
// https://github.com/nuxt/framework/issues/3141 - Error When Fast Navigating "Failed to execute 'insertBefore' on 'Node'"
const token = useCookie("token")
if (!token._value) {
    navigateTo("/user/login")
}

var vehicleInfo = await $fetch("/api/getVehicle", {
    credentials: "include"
})
if(vehicleInfo.length > 0) {
    vehicleInfo = vehicleInfo[0]
} else {
    navigateTo("/user/vehicle")
}

</script>

<script>
export default {
    name: "BookingForm",
    data() {
        return {
            dateTo: new Date(),
            dateFrom: new Date(),
            message: null,
            gridMessage: "Select a time period",
            spotSelected: null,
            vehicle: null,  // Get from DB or from cookie, probably cookie from login
        }
    },
    
    methods: {
        changeZone: function(event) {
            // Check if spot is available?

            // Can't select before choosing time and invalid times
            if ([...event.target.classList].includes("bg-white") || [...event.target.classList].includes("bg-light-red")) {
                return
            }

            document.querySelectorAll('.parkingSpot').forEach(function(spot) {
                spot.classList.remove("selected")
            });
            event.currentTarget.classList.add("selected");
            this.spotSelected = parseInt(event.currentTarget.id.replace("Parking", ""));
            this.message = null;
        },
        verifyTime: async function(event) {
            // Check if both time slots are filled in + from is before to
            // Get that parking slots availability via API call
            // then change display of grid accordingly

            // Default
            this.gridMessage = "Select a time period";

            var dateFrom = document.getElementById("dateFrom").value
            var timeFrom = document.getElementById("timeFrom").value

            var dateTo = document.getElementById("dateTo").value
            var timeTo = document.getElementById("timeTo").value

            console.log(timeFrom, timeTo, dateTo, dateFrom)
            if (!timeFrom || !timeTo) {
                return;
            }

            this.dateFrom = new Date(dateFrom + "T" + timeFrom);
            this.dateTo = new Date(dateTo + "T" + timeTo);

            if (this.dateFrom > this.dateTo) {
                this.message = "Invalid date"
                return;
            }

            this.message = null;
            this.gridMessage = "Click on grid";

            console.log(this.dateFrom, this.dateTo)
            const slots = await $fetch("/api/availability", {
                method: "POST",
                credentials: "include",
                body: {
                    dateFrom: this.dateFrom,
                    dateTo: this.dateTo
                }
            })

            document.querySelectorAll('.parkingSpot').forEach(function(spot) {
                spot.classList.remove("bg-white")
                spot.classList.remove("selected")
                spot.classList.remove("bg-light-red")
                spot.classList.add("bg-light-green")
            });
            slots.forEach( slot => {
                var parkingSpot = document.getElementById(`Parking${slot.parkingSlot}`)
                parkingSpot.classList.remove("bg-light-green")
                parkingSpot.classList.remove("selected")
                parkingSpot.classList.add("bg-light-red")
            })
            this.spotSelected = null;

        },
        handleSubmit: async function() {
            if (!document.getElementById("timeFrom").value && !document.getElementById("timeTo").value) {
                this.message = "Please select a time";
                return;
            }
            if (this.dateFrom > this.dateTo) {
                this.message = "Invalid date"
                return;
            }
            if(!this.spotSelected) {
                this.message = "Select a parking spot"
                return;
            }
            console.log(this.dateTo, this.dateFrom, this.spotSelected)
            
            const booking = await $fetch("/api/book", {
                method: "POST",
                credentials: "include",
                body: {
                    dateFrom: this.dateFrom,
                    dateTo: this.dateTo,
                    spot: this.spotSelected
                }
            })

            if (booking) {
                this.message = booking
            } else {
                this.$router.push('/user/bookings');
            }
        }
    }
}
</script>


<template>
    <div class="pa3 pa5-l">
        <form class="w-100 flex flex-wrap-l flex-wrap-reverse justify-around" @submit.prevent="handleSubmit">
            <div class="w-100 w-30-l flex flex-column justify-between">

                <div class="w-100">
                    <div class="w-100 flex flex-wrap justify-around">
                        <div class="w-100 w-40-m w-40-l">
                            <label for="dateFrom" class="f4">From</label>
                            <input class="f4 f3-l b bn w-100" type="date" id="dateFrom" :value="dateFrom.toISOString().slice(0,10)" v-on:change="verifyTime">
                            <input class="f4 f3-l b bn w-100 mt2" type="time" id="timeFrom" v-on:change="verifyTime">
                        </div>
                        <div class="w-100 w-40-m w-40-l">
                            <label for="dateTo" class="f4">To</label>
                            <input class="f4 f3-l b bn w-100" type="date" id="dateTo" :value="dateTo.toISOString().slice(0,10)" v-on:change="verifyTime">
                            <input class="f4 f3-l b bn w-100 mt2" type="time" id="timeTo" v-on:change="verifyTime">
                        </div>
                        <div class="w-100 mt2 f5 tc">*Will be rounded to nearest 30 minute interval</div>
                    </div>
                </div>

                <div class="w-100">
                    <div class="w-100 pa3 mt4 f3 flex flex-wrap">
                        <div class="w-100 flex flex-wrap">
                            <div class="w-100 w-40-l">
                                Your vehicle details:
                            </div>
                            <div class="w-100 w-60-l flex flex-column tr">
                                <div class="w-100">{{ vehicleInfo.vehicleName }}</div>
                                <div class="w-100">{{ vehicleInfo.vehicleReg }}</div>
                            </div>
                        </div>
                        <div class="w-100 f5 pt3 pt0-l">
                            Not it? <NuxtLink class="link black dim b" to="/user/user">Change here</NuxtLink>
                        </div>
                    </div>
                    <button class="w-100 w-25-m button-reset link br2 ph3 pv2 dim bg-white pointer" id="submitButton">Book</button>
                    <div class="w-100 pa3 mt1 f3 red tc">{{message}}</div>
                </div>

            </div>
            <div class="w-100 w-60-l pa2">
                <div class="w-100 f3-l f4 flex">
                    <div class="w-60-l w-75 mb1">
                        Spot selected: <span class="b">{{ spotSelected ? spotSelected : "None" }}</span> 
                    </div>
                    <div class="w-40-l w-25 f5-l f6 tr">{{ gridMessage }}</div>
                </div>
                <div class="selection w-100 flex flex-wrap v-mid">
                    <div class="parkingSpot w-10 h3 h4-m h5-l outline tc f4 f2-l flex flex-column justify-center grow bg-white" v-for="i in 10" :key="i" :id="'Parking'+i" v-on:click="changeZone">{{ i }}</div>
                </div>
                <div class="selection w-100 flex flex-wrap v-mid mt3 mt4-m mt5-l">
                    <div class="parkingSpot w-10 h3 h4-m h5-l outline tc f4 f2-l flex flex-column justify-center grow bg-white" v-for="i in 10" :key="i" :id="'Parking'+(i+10)" v-on:click="changeZone">{{ i+10 }}</div>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
    .parkingSpot:hover {
        z-index: 1;
    }
    .selected {
        background-color: #eee !important;
    }
</style>