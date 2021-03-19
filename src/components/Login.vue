<template>
  <!-- eslint-disable -->
  <b-container fluid class="pl-0 pr-0">
    <b-row>
      <b-col md="6" sm="12" offset-md="3">
        <b-row class="mt-4">
          <b-col sm="12" class="text-center">
            <form-logo />
          </b-col>
        </b-row>

        <b-row class="mt-4 px-4">
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
              <b-button :disabled="!formOk" type="submit" variant="primary" block>
                {{ busy ? 'Busy...' : 'Login' }}
              </b-button>
            </b-form>
          </b-col>
          <b-col sm="12" class="mt-3 text-center">
            <router-link :to="signupPath">Signup</router-link>
          </b-col>
          <b-col sm="12" class="mt-3 text-center">
            <router-link :to="forgotPath">Forgot password</router-link>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions } from 'vuex';
import FormLogo from '@/components/FormLogo';
import Flash from '@/mixins/Flash';

export default {
  name: 'Login',
  components: {
    FormLogo
  },
  mixins: [Flash],
  data() {
    return {
      loginForm: {
        password: '',
        email: ''
      },
      signupPath: { name: 'Signup' },
      forgotPath: { name: 'Forgot' },
      profilePath: { name: 'DueHabits' },
      busy: false
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
      if (this.busy) return;
      this.busy = true;
      this.authenticate(this.loginForm)
        .then((success) => {
          this.busy = false;
          if (!success) {
            this.showFlash('Could not login', 'error');
            return;
          }
          this.$router.replace(this.profilePath);
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showFlash(message, 'error');
        });
    }
  }
};
</script>
