<script setup>
// const token = useCookie("token")
// if (!token._value) {
//     navigateTo("/user/login")
// }


// Get current days availability API
</script>

<script>
export default {
    data() {
        return {
            zoneSelected: null,
            date1: new Date(),
            date2: new Date(),
        }
    },
    methods: {
        changeZone: function(event) {
            // Check if spot is available?

            document.querySelectorAll('.parkingSpot').forEach(function(spot) {
                spot.classList.remove("bg-light-gray")
                spot.classList.add("bg-white")
            });
            event.currentTarget.classList.remove("bg-white");
            event.currentTarget.classList.add("bg-light-gray");
            this.zoneSelected = parseInt(event.currentTarget.id.replace("Parking", ""));

            // When date is changed (eventlooker), get that days availability
            // then change display of times available
        }
    }
}
</script>


<template>
    <div class="pa3 pa5-l">
        <div class="w-100 flex flex-wrap-l flex-wrap-reverse">
            <div class="w-100 w-40-l">

                <div class="w-100 flex flex-wrap justify-around">
                    <div class="w-100 w-40-m w-40-l">
                        <label for="dateFrom" class="f4">From</label>
                        <input class="f4 f2-l b bn w-100" type="date" id="dateFrom" :value="date1.toISOString().slice(0,10)">
                        <input class="f4 f2-l b bn w-100" type="time" id="timeFrom">
                        
                    </div>
                    <div class="w-100 w-40-m w-40-l">
                        <label for="dateTo" class="f4">To</label>
                        <input class="f4 f2-l b bn w-100" type="date" id="dateTo" :value="date2.toISOString().slice(0,10)">
                        <input class="f4 f2-l b bn w-100" type="time" id="timeTo">
                    </div>
                </div>

                <div class="w-100 pa3 mt4 f3">Zone selected: <span class="b">{{ zoneSelected ? zoneSelected : "None" }}</span></div>
            </div>
            <div class="w-100 w-60-l pa2">
                <div class="selection w-100 flex flex-wrap v-mid">
                    <div class="parkingSpot w-10 h3 h4-m h5-l outline tc f4 f2-l flex flex-column justify-center grow bg-white" v-for="i in 10" :key="i" :id="'Parking'+i" v-on:click="changeZone">{{ i }}</div>
                </div>
                <div class="selection w-100 flex flex-wrap v-mid mt3 mt4-m mt5-l">
                    <div class="parkingSpot w-10 h3 h4-m h5-l outline tc f4 f2-l flex flex-column justify-center grow bg-white" v-for="i in 10" :key="i" :id="'Parking'+(i+10)" v-on:click="changeZone">{{ i+10 }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .parkingSpot:hover {
        z-index: 1;
    }
</style>