<template>
  <v-card
      :loading="isLoading && !isMobile"
      :elevation="isMobile ? 0 : 2"
  >
    <template slot="progress">
      <v-progress-linear
          color="#E52B38"
          height="10"
          indeterminate
      ></v-progress-linear>
    </template>
    <div class="content">
      <div class="logo">
      </div>
      <form class="mt-10" @submit.prevent="generateTemplate">
        <v-row class="jutify-center">
          <v-col cols="12">
            <p class="text-h3 font-weight-bold text-center">
              Acak Soal
            </p>
          </v-col>
          <v-col cols="12">
            <v-row class="ma-0 pa-0">
              <div class="text-h6 font-weight-bold text-start">
                Email
              </div>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <img src="../../assets/hint.svg" width="18px" height="18px" class="mt-2 ml-3"  v-bind="attrs" v-on="on">
                </template>
                <span>Kami akan mengirim soal hasil acakan ke email ini</span>
              </v-tooltip>
            </v-row>
            <v-text-field
                :rules="[rules.email]"
                v-model="email"
                type="email"
            ></v-text-field>
          </v-col>
          <v-col cols="5">
            <v-row class="ma-0 pa-0">
              <div class="text-h6 font-weight-bold text-start">
                File Zip Soal
              </div>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <img src="../../assets/hint.svg" width="18px" height="18px" class="mt-2 ml-3"  v-bind="attrs" v-on="on">
                </template>
                <span>Lihat tutorial untuk lebih jelas</span>
              </v-tooltip>

            </v-row>
            <v-file-input
                v-model="docxZip"
                :rules="[(value) => !!value || 'File docx tidak boleh kosong']"
                accept="application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip"
            ></v-file-input>
          </v-col>
          <v-col cols="5" offset="2">
            <v-row class="ma-0 pa-0">
              <div class="text-h6 font-weight-bold text-start">
                Jumlah acak soal
              </div>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <img src="../../assets/hint.svg" width="18px" height="18px" class="mt-2 ml-3"  v-bind="attrs" v-on="on">
                </template>
                <span>Jumlah variasi hasil acakan/paket</span>
              </v-tooltip>

            </v-row>
            <v-text-field
                type="number"
                :rules="rules.jumlahAcak"
                v-model="jumlahAcak"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-alert
                dense
                outlined
                type="error"
                :icon="false"
                v-if="error.isError"
                class="text-center text-subtitle-2"
            >{{ errorMessage }}
            </v-alert
            >
          </v-col>
          <v-col class="d-flex justify-center">
            <v-btn
                style="width: 100%; margin-bottom: 50px"
                type="submit"
                large
                color="#E52B38"
                class="login_btn"
                :disabled="!isInputValid"
            >Download Template
            </v-btn
            >
          </v-col>
        </v-row>
      </form>
    </div>
    <v-overlay v-if="isLoading"></v-overlay>
    <InformationDialog @dismiss-dialog="onDismissDialog" v-if="dialog" title="Berhasil!" :message="successMessage"/>
  </v-card>
</template>

<script>
import soal from "../../datasource/soal"
import InformationDialog from "./InformationDialog";
export default {
  name: "AcakSoal",
  components: {
    InformationDialog
  },
  data() {
    return {
      isLoading: false,
      dialog: false,
      email: "",
      docxZip: null,
      jumlahAcak: "",
      successMessage: "",
      error: {
        isError: false,
        message: "",
      },
      rules: {
        email: (value) => !!value || "email tidak boleh kosong",
        jumlahAcak : [
          (value) => !!value || "Jumlah pilihan tidak boleh kosong",
          (value) => value>0 || "Jumlah pilihan minimal adalah 1",
          (value) => value<=5 || "Jumlah pilihan maksimal adalah 5"
        ]
      },
    };
  },
  computed: {
    errorMessage() {
      return this.error.message;
    },
    isInputValid() {
      const isEmpty = (this.email === "")  | (this.docxZip === null)
      const jumlahAcakValidation = this.jumlahAcak > 0 && this.jumlahAcak<= 5
      return !isEmpty && jumlahAcakValidation;
    },
    isMobile() {
      return this.$vuetify.breakpoint.xs ? true : false;
    },
  },
  methods: {
    async generateTemplate() {
      this.error.isError = false;
      this.error.message = "";
      this.isLoading = true;
      let formData = new FormData()
      formData.append("fileSoal", this.docxZip)
      formData.append("email", this.email)
      formData.append("jumlahAcak", this.jumlahAcak)
      const result = await soal.acakSoal(formData)
      this.isLoading = false;
      if(result instanceof Error) {
        this.error = {
          isError: true,
          message: result.cause
        }
        return
      }
      const successEmail = this.email
      this.email= ""
      this.jumlahPilihan = 0
      this.jumlahSoal = 0
      this.successMessage = "Kami akan mengirim hasil acak soal ke " +  successEmail
      this.dialog = true

    },
    onDismissDialog() {
      this.dialog = false
      this.$emit("onSuccess")
    }
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.content {
  padding: 1rem;
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.content form {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media screen and (max-width: 400px) {
  .content .logo {
    width: 60%;
  }

  .content form {
    width: 90%;
  }
}

.content form .login_btn {
  color: white;
}
</style>
