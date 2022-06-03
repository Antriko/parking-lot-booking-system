<script setup>
</script>

<script>

export default {
    name: "VehicleForm",
        data() {
        return {
            form: {
                vehicleName: "",
                regPlate: "",
            }
        }
    },
    methods: {
        handleSubmit: async function() {
            console.log(this.form)
            const login = await $fetch("/api/vehicle", {
                method: "POST",
                credentials: "include",
                body: {
                    vehicleName: this.form.vehicleName,
                    regPlate: this.form.regPlate
                }
            })
            this.$router.push('/user/user');
        }
    }   
}
</script>

<template>
    <form class="flex flex-column pa3 pa5-l" @submit.prevent="handleSubmit">
        <div class="w-100 mt3 mb3 f2">
            Vehicle information
        </div>

        <div class="flex flex-column w-100 w-40-l">
            <label for="name" class="mb2 f4">Vehicle name</label>
            <input id="name" name="name" class="input input-reset w-100 ba pv2 mb4 b-- br1" v-model="form.vehicleName" required>
        </div>
        <div class="flex flex-column w-100 w-40-l">
            <label for="reg" class="mb2 f4">Registration plate</label>
            <input id="reg" name="reg" class="input input-reset w-100 ba pv2 mb4 b-- br1" v-model="form.regPlate" required>
        </div>
        <div class="flex flex-column w-100 w-40-l">
            <button class="f3 link dim ph4 pv3 mb0 br4 dib white bg-black">Add vehicle</button>
        </div>
    </form>
</template>

<style scoped> 
.input {
    background-color: #DEE2E6;
}
</style>