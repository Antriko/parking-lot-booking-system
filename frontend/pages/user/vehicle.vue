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
            const login = await $fetch("http://localhost:8080/api/vehicle", {
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
            <label for="name" class="mb2">Vehicle name</label>
            <input id="name" name="name" class="input-reset w-100 ba pv2 mb4 b-- br1" v-model="form.vehicleName" required>
        </div>
        <div class="flex flex-column w-100 w-40-l">
            <label for="reg" class="mb2">Registration plate</label>
            <input id="reg" name="reg" class="input-reset w-100 ba pv2 mb4 b-- br1" v-model="form.regPlate" required>
        </div>
        <div class="flex flex-column w-100 w-40-l">
            <button class="w-50 w-25-m button-reset link dim pv2 bg-white pointer">Change vehicle</button>
        </div>
    </form>
</template>