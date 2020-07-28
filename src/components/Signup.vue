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
            <b-form @submit.stop.prevent="register()">
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
    </b-row>
  </b-container>
</template>

<script>
import { mapActions } from 'vuex';
import FormLogo from '@/components/FormLogo';
import Flash from '@/mixins/Flash';

export default {
  name: 'Signup',
  components: {
    FormLogo
  },
  mixins: [Flash],
  data() {
    return {
      signupForm: {
        password: '',
        email: ''
      },
      loginPath: { name: 'Login' },
      dueTasksPath: { name: 'DueTasks' },
      busy: false
    };
  },
  computed: {
    formOk() {
      const { email, password } = this.signupForm;
      return /^\w+\.*\w*@\w+\.\w+/.test(email) && password.length >= 6;
    }
  },
  methods: {
    ...mapActions(['signup']),
    register() {
      if (this.busy) return;
      this.busy = true;

      this.signup(this.signupForm)
        .then((success) => {
          this.busy = false;
          if (!success) {
            this.showFlash('Could not sign up', 'error');
          } else {
            this.$router.replace(this.dueTasksPath);
          }
        })
        .catch(({ message = 'Could not sign up' }) => {
          this.busy = false;
          this.showFlash(message, 'error');
        });
    }
  }
};
</script>
