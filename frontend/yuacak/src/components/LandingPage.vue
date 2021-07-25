<template>
  <v-container style="background: rgba(0,0,0,0);color: white; width: 100%" fluid class="fill-height" >
    <v-row>
      <v-col cols="12">
        <div class="text-center text-h1 font-weight-bold">Yuk Acak</div>
      </v-col>
      <v-col cols="12">
        <div class="text-center text-h6 font-weight-regular">acak soalmu dengan mudah</div>
      </v-col>
      <v-col cols="12">
      </v-col>
      <v-col cols="12">
        <div class="text-center text-caption font-weight-regular">Mohamad Naufal Fadhil (181524016)</div>
      </v-col>
      <v-col cols="12">
        <div class="text-center text-caption font-weight-regular">Rayhan Azka Anandhias (181524027)</div>
      </v-col>
      <v-col cols="12">
        <div class="d-flex justify-center">
          <v-btn @click="goToMain">Mulai Acak Soal</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "LandingPage",
  methods: {
    goToMain(){
      this.$emit('go-to-main')
    }
  }
}
</script>

<style scoped>

</style>
