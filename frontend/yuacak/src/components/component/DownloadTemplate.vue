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
              Generate Template
            </p>
          </v-col>
          <v-col cols="12">
            <p class="text-h6 font-weight-bold text-start">
              Email
            </p>
            <v-text-field
                :rules="[rules.email]"
                v-model="email"
            ></v-text-field>
          </v-col>
          <v-col cols="5">
            <p class="text-h6 font-weight-bold text-start">
              Jumlah Soal
            </p>
            <v-text-field
                type="number"
                :rules="rules.jumlahSoalRules"
                v-model="jumlahSoal"
            ></v-text-field>
          </v-col>
          <v-col cols="5" offset="2">
            <p class="text-h6 font-weight-bold text-start">
              Jumlah Pilihan
            </p>
            <v-text-field
                type="number"
                :rules="rules.jumlahPilihanRules"
                v-model="jumlahPilihan"
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
  name: "DownloadTemplate",
  components: {
    InformationDialog
  },
  data() {
    return {
      isLoading: false,
      dialog: false,
      email: "",
      jumlahSoal: 0,
      jumlahPilihan: 0,
      successMessage: "",
      error: {
        isError: false,
        message: "",
      },
      rules: {
        email: (value) => !!value || "email tidak boleh kosong",
        jumlahSoalRules : [
          (value) => !!value || "Jumlah soal tidak boleh kosong",
          (value) => value>0 || "Jumlah soal harus lebih dari 0",
          (value) => value<=40 || "Jumlah soal maksimal adalah 40"
        ],
        jumlahPilihanRules : [
          (value) => !!value || "Jumlah pilihan tidak boleh kosong",
          (value) => value>1 || "Jumlah pilihan harus lebih dari 1",
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
      const isEmpty = (this.email === "")  | (this.jumlahSoal === "") | (this.jumlahPilihan === "");
      const jumlahSoalValidation = this.jumlahSoal > 0 && this.jumlahSoal <= 40
      const jumlahPilihanValidation = this.jumlahPilihan > 1 && this.jumlahPilihan<= 5
      return !isEmpty && jumlahSoalValidation && jumlahPilihanValidation;
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
      const result = await soal.generateTemplate(this.email, this.jumlahSoal, this.jumlahPilihan)
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
      this.successMessage = "Kami akan mengirim template ke " +  successEmail
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
