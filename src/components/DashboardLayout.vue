<template>
  <div class="dashboard">
    <v-navigation-drawer
      color="#ffffff"
      v-model="drawer"
      class="fullheight"
      width="250"
      border
      app
    >
      <v-list-item>
        <v-list-item-content>
          <img
            id="logoLogin"
            src="../assets/energeek.jpeg"
            width="50"
            height="65"
            alt="Kitten"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list dense>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          link
          tag="router-link"
          :to="item.to"
        >
          <v-list-item-icon>
            <v-icon color="green">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="black--text">{{
              item.text
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
    </v-navigation-drawer>
    <v-app-bar color="#e63946" app fixed height="80px">
      <v-app-bar-nav-icon
        color="#ffffff"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <v-toolbar-items> </v-toolbar-items>
    </v-app-bar>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
    <div class="fullheight pa-5">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "Dashboard",
  data() {
    return {
      drawer: true,
      error_message: "",
      snackbar: false,
      items: [{ text: "Candidate", icon: "mdi-account", to: "/candidate" }],
    };
  },
};
</script>

<style scoped>
.fullheight {
  min-height: 100vh !important;
}

.router {
  text-decoration: none;
  color: rgb(255, 255, 255);
}

.v-list-item__title {
  color: rgb(255, 190, 71);
  font-size: 30px;
}
</style>
