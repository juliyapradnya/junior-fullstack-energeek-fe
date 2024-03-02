<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Candidate</h3>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          clearable
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search"
        ></v-text-field>

        <v-spacer></v-spacer>
        <v-btn color="green" fab dark small @click="dialog = true">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table :headers="headers" :items="candidate" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn v-if="item.deleted_at == null" color="blue" fab dark x-small @click="editHandler(item)">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-btn>

          <v-btn v-if="item.deleted_at == null" color="red" fab dark x-small @click="deleteHandler(item.id)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>

          <v-btn v-if="item.deleted_at != null" class="text-subtitle-2 white--text" color="red">
            Candidate Tidak Aktif
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Candidate</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <div class="black--text text-darken-1 mb-2">Apply Lamaran</div>
            <v-text-field
              v-model="form.name"
              label="Nama Lengkap"
              outlined
              :rules="nameRules"
              required
            ></v-text-field>
            <v-select
              v-model="form.job_id"
              :items="jobs"
              item-text="job_name"
              item-value="id"
              label="Jabatan"
              outlined
              :rules="jobRules"
              required
            ></v-select>
            <v-text-field
              v-model="form.phone"
              label="Telepon"
              outlined
              :rules="teleponRules"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.email"
              label="Email"
              outlined
              :rules="emailRules"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.year"
              label="Year"
              outlined
              :rules="yearRules"
              required
            ></v-text-field>
            <v-select
              v-model="form.skill_id"
              :items="skills"
              item-text="skill_name"
              item-value="id"
              label="Skill Set"
              outlined
              :rules="skillRules"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>

          <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menghapus data candidate ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
<script>
export default {
  name: "List",
  data() {
    return {
      inputType: "Add",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      menu1: false,
      menuMot: false,
      menuRfl: false,
      menuLS: false,
      headers: [
        { text: "Nama Lengkap", value: "name" },
        { text: "Jabatan", value: "job_name" },
        { text: "Telepon", value: "phone" },
        { text: "Email", value: "email" },
        { text: "Tahun Lahir", value: "year" },
        { text: "Skill Set", value: "skill_name" },
        { text: "Actions", value: "actions" , width:"20px"},
      ],
      candidates: new FormData(),
      candidate: [],
      jobs: [],
      skills: [],
      form: {
        name: null,
        job_id: null,
        phone: null,
        email: null,
        year: null,
        skill_id: null,
      },
      nameRules: [(v) => !!v || "Name must be required"],
      jobRules: [(v) => !!v || "Jabatan must be required"],
      teleponRules: [(v) => !!v || "Telepon must be required"],
      emailRules: [(v) => !!v || "Emailmust be required"],
      yearRules: [(v) => !!v || "Year must be required"],
      skillRules: [(v) => !!v || "Skill must be required"],
      deleteId: "",
      editId: "",
    };
  },
  watch: {
    menu(val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },

  methods: {
    setForm() {
      if (this.inputType === "Add") {
        this.save();
      } else {
        this.update();
      }
    },

    saveYear(year) {
      this.$refs.menu.save(year);

      // Reset activePicker to type YEAR
      this.$refs.picker.activePicker = "YEAR";

      // Close the menu/datepicker
      this.menu = false;
    },
    //read data
    readData() {
      var url = this.$api + "/candidate";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.candidate = response.data.data;
        });
    },

    readDataJob() {
      var url = this.$api + "/job";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.jobs = response.data.data;
        });
    },

    readDataSkill() {
      var url = this.$api + "/skill";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.skills = response.data.data;
        });
    },
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        this.candidates.append("job_id", this.form.job_id);
        this.candidates.append("name", this.form.name);
        this.candidates.append("email", this.form.email);
        this.candidates.append("phone", this.form.phone);
        this.candidates.append("year", this.form.year);
        this.candidates.append("skill_id", this.form.skill_id);
        var url = this.$api + "/candidate";
        this.load = true;
        this.$http
          .post(url, this.candidates, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((response) => {
            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.close();
            this.readData(); //mengambil data
            this.readDataJob();
            this.readDataSkill();
            this.resetForm();
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          });
      }
    },
    //ubah
    update() {
      let newData = {
        job_id: this.form.job_id,
        name: this.form.name,
        email: this.form.email,
        phone: this.form.phone,
        year: this.form.year,
        skill_id: this.form.skill_id,
      };
      var url = this.$api + "/candidate/" + this.editId;
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.readDataJob();
          this.readDataSkill();
          this.resetForm();
          this.inputType = "Add";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    //hapus
    deleteData() {
      //mengahapus data
      var url = this.$api + "/candidate/" + this.deleteId;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData();
          this.readDataJob();
          this.readDataSkill();
          this.resetForm();
          this.inputType = "Add";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    editHandler(item) {
      this.inputType = "Update";
      this.editId = item.id;
      this.form.job_id = item.job_id;
      this.form.name = item.name;
      this.form.email = item.email;
      this.form.phone = item.phone;
      this.form.year = item.year;
      this.form.skill_id = item.skill_id;
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
      this.dialogConfirm = false;
      this.inputType = "Add";
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Add";
    },
    resetForm() {
      this.$refs.form.reset();
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
    this.readDataJob();
    this.readDataSkill();
  },
};
</script>
