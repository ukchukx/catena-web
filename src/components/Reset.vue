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
        <b-row class="mt-4">
          <b-col sm="8" class="text-center mx-auto">
            <flash-message/>
          </b-col>
          <b-col sm="12" md="6" offset-md="3">
            <b-form @submit.stop.prevent="reset()">
              <b-form-group label="Password:" label-for="password">
                <b-form-input
                  id="password"
                  type="password"
                  v-model="form.password"
                  required
                  placeholder="New password"
                ></b-form-input>
              </b-form-group>
              <b-button :disabled="!formOk" type="submit" variant="primary" block>Change password</b-button>
            </b-form>
          </b-col>
          <b-col sm="12" class="mt-3 text-center">
            <router-link :to="loginPath">Go to login</router-link>
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
  name: 'Reset',
  components: {
    FormLogo
  },
  mixins: [Flash],
  data() {
    return {
      form: {
        email: '',
        token: '',
        password: ''
      },
      loginPath: { name: 'Login' },
      busy: false
    };
  },
  computed: {
    formOk() {
      const { token, password, email } = this.form;
      return !!token.length && password.length >= 6 && /^\w+\.*\w*@\w+\.\w+/.test(email);
    }
  },
  created() {
    const { query: { token, email } } = this.$route;

    if (!token || !email) {
      this.showFlash('Invalid URL', 'error', { timeout: 10000 });
      this.$router.replace(this.loginPath);
    }

    this.form.token = token;
    this.form.email = email;
  },
  methods: {
    ...mapActions(['resetPassword']),
    reset() {
      this.resetPassword(this.form)
        .then((success) => {
          this.busy = false;

          if (!success) {
            this.showFlash('Reset failed', 'error');
            return;
          }

          this.$router.replace({ name: 'Tasks' });
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showFlash(message, 'error');
          this.$router.replace({ name: 'Login' });
        });
    }
  }
};
</script>
