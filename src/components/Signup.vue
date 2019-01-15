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
            <b-form @submit.stop.prevent="signup()">
              <b-form-group label="Email address:" label-for="loginEmail">
                <b-form-input
                  id="loginEmail"
                  type="email"
                  v-model="signupForm.email"
                  required
                  placeholder="Enter email"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Password:" label-for="loginPassword">
                <b-form-input
                  id="loginPassword"
                  type="password"
                  v-model="signupForm.password"
                  required
                  placeholder="Enter password"
                ></b-form-input>
              </b-form-group>
              <b-button :disabled="!formOk" type="submit" variant="primary" block>Signup</b-button>
            </b-form>
          </b-col>
          <b-col sm="12" class="mt-3 text-center">
            <router-link :to="loginPath">Login</router-link>
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
export default {
  name: 'Signup',
  data() {
    return {
      signupForm: {
        password: '',
        email: ''
      },
      loginPath: {
        name: 'Login'
      }
    };
  },
  computed: {
    formOk() {
      const { email, password } = this.signupForm;
      return /^\w+\.*\w*@\w+\.\w+/.test(email) && password.length >= 6;
    }
  },
  methods: {
    signup() {
      // TODO: Implement user signup
      ;
    }
  }
};
</script>
