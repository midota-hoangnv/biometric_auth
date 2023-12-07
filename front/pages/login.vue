<template>
  <v-content>
    <v-card width="500" class="mx-auto mt-9">
      <v-card-title>Login form</v-card-title>
      <v-card-text>
        <v-text-field
          label="Username"
          prepend-icon="mdi-account-circle"
          v-model="username"
        />
        <v-text-field
          v-model="password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        />
      </v-card-text>

      <v-divider></v-divider>
      <v-layout justify-center>
        <v-card-actions>
          <v-btn color="info" @click="login">Login</v-btn>
        </v-card-actions>
      </v-layout>
    </v-card>
  </v-content>
</template>
<script>
export default {
  name: "LoginPage",
  layout: "blank",
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    async login() {
      try {
        const data = {
          username: this.username,
          password: this.password,
        };
        await this.$api.login(data);
        localStorage.setItem('auth', this.username)
        this.$router.push("/");
        console.log(this.$api.login, data);
      } catch (err) {}
    },
  },
};
</script>
