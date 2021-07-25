<template>
  <v-container style="background: rgba(255,0,0,0);color: white" fluid class="fill-height">
    <div class="d-flex justify-space-around flex-wrap" style="width: 100%; margin-top: -150px">
      <img src="../assets/download_template.svg" class="child" @click="onDialogClicked(DOWNLOAD_TEMPLATE)">
      <img src="../assets/acak_soal.svg" class="child" @click="onDialogClicked(ACAK_SOAL)">
      <img src="../assets/tutorial.svg" class="child" @click="onDialogClicked(TUTORIAL)"/>
    </div>
    <v-dialog
        transition="dialog-bottom-transition"
        v-model="dialog"
        width="60%"
    >
      <download-template v-if="clicked === DOWNLOAD_TEMPLATE" @onSucess="onSuccess"/>
      <acak-soal v-else-if="clicked === ACAK_SOAL"/>
    </v-dialog>
  </v-container>
</template>

<script>
import DownloadTemplate from "./component/DownloadTemplate";
import AcakSoal from "./component/AcakSoal";

export default {
  name: "Main",
  components: {AcakSoal, DownloadTemplate},
  data() {
    return {
      clicked: -1,
      DOWNLOAD_TEMPLATE: 1,
      ACAK_SOAL: 2,
      TUTORIAL: 3,
      dialog: false
    }
  },
  methods: {
    onDialogClicked(clicked) {
      this.clicked = clicked
      this.dialog = true
    },
    onSuccess() {
      this.dialog = false
      this.clicked = -1
    }
  }
}
</script>
<style scoped>
.child {
  margin-top: 150px;
  cursor: pointer;
}
</style>

