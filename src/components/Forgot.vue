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
        </b-row>
        <b-row class="mt-4 px-4">
          <b-col sm="12" md="6" offset-md="3">
            <b-form @submit.stop.prevent="forgot()">
              <b-form-group label="Email address:" label-for="email">
                <b-form-input
                  id="email"
                  type="email"
                  v-model="form.email"
                  required
                  placeholder="Enter email address"
                ></b-form-input>
              </b-form-group>
              <b-button :disabled="!formOk" type="submit" variant="primary" block>Send reset email</b-button>
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
  name: 'Forgot',
  components: {
    FormLogo
  },
  mixins: [Flash],
  data() {
    return {
      form: {
        email: ''
      },
      loginPath: { name: 'Login' },
      busy: false
    };
  },
  computed: {
    formOk() {
      return /^\w+\.*\w*@\w+\.\w+/.test(this.form.email);
    }
  },
  methods: {
    ...mapActions(['forgotPassword']),
    forgot() {
      if (this.busy) return;
      this.busy = true;

      this.forgotPassword(this.form)
        .then(({ message, success }) => {
          this.busy = false;
          if (!success) {
            this.showFlash('Account does not exist', 'error');
            return;
          }
          this.showFlash(message, 'success');
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showFlash(message, 'error');
        });
    }
  }
};
</script>
