<template>
  <!-- eslint-disable -->
  <b-container fluid class="pl-0 pr-0">
    <b-row>
      <b-col md="6" sm="12">
        <b-row class="mt-4">
          <b-col sm="12" class="text-center">
            <h3 class="logo font-weight-bold">Catena</h3>
          </b-col>
        </b-row>
        <b-row class="mt-4">
          <b-col sm="12" md="6" offset-md="3">
            <b-form @submit.stop.prevent="login()">
              <b-form-group label="Email address:" label-for="loginEmail">
                <b-form-input
                  id="loginEmail"
                  type="email"
                  v-model="loginForm.email"
                  required
                  placeholder="Enter email"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Password:" label-for="loginPassword">
                <b-form-input
                  id="loginPassword"
                  type="password"
                  v-model="loginForm.password"
                  required
                  placeholder="Enter password"
                ></b-form-input>
              </b-form-group>
              <b-button :disabled="!formOk" type="submit" variant="primary" block>Login</b-button>
            </b-form>
          </b-col>
          <b-col sm="12" class="mt-3 text-center">
            <router-link :to="signupPath">Signup</router-link>
          </b-col>
        </b-row>
      </b-col>
      <b-col md="6" class="d-none d-md-block">
        <img width="100%" src="/static/images/racestart.jpg" block fluid>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        password: 'password',
        email: 'test@email.com'
      },
      signupPath: { name: 'Signup' },
      profilePath: { name: 'Profile' }
    };
  },
  computed: {
    formOk() {
      const { email, password } = this.loginForm;
      return /^\w+\.*\w*@\w+\.\w+/.test(email) && password.length >= 6;
    }
  },
  methods: {
    ...mapActions(['authenticate']),
    login() {
      this.authenticate(this.loginForm)
        .then((success) => {
          if (!success) {
            alert('Could not login');
            return;
          }
          this.$router.replace(this.profilePath);
        });
    }
  }
};
</script>
