<template>
  <!-- eslint-disable -->
  <Page>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="offset-sm-6 col-sm-6 text-right">
            <button @click.stop.prevent="logout()" class="btn btn-outline-secondary">Logout</button>
          </div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input readonly type="text" class="form-control-plaintext" :value="user.email">
        </div>
        <div class="form-group">
          <label>Username</label>
          <inline-input
            @blur="handleUpdateForm"
            type="text"
            input-classes="form-control"
            label-classes="form-control-plaintext"
            v-model.trim="updateForm.username" />
        </div>
      </div>
    </div>
    <div class="card mt-1">
      <div class="card-body">
        <form @submit.stop.prevent="handlePasswordForm()">
          <label>Current password</label>
          <password-input ref="pass" v-model="passwordForm.password"/>
          <label>New password</label>
          <password-input ref="newPass" v-model="passwordForm.new_password"/>
          <button
            :disabled="!passwordFormOk"
            type="submit"
            class="btn btn-outline-secondary"
          >Change password</button>
        </form>
      </div>
    </div>
  </Page>
</template>

<script>
import InlineInput from 'vue-inline-input';
import { mapGetters, mapActions } from 'vuex';
import PasswordInput from '@/components/PasswordInput';
import Page from '@/components/Page';
import Flash from '@/mixins/Flash';

export default {
  name: 'Profile',
  components: {
    PasswordInput,
    InlineInput,
    Page
  },
  mixins: [Flash],
  data() {
    return {
      updateForm: {
        username: ''
      },
      passwordForm: {
        password: '',
        new_password: ''
      },
      loginPath: { name: 'Login' },
      busy: false
    };
  },
  computed: {
    ...mapGetters(['user']),
    passwordFormOk() {
      const { password, new_password } = this.passwordForm;
      return !!password && password.length >= 6 &&
        !!new_password && new_password.length >= 6;
    },
    updateFormOk() {
      const { username } = this.updateForm;
      return !!username && username !== this.user.username;
    }
  },
  watch: {
    'user.username'(newUsername) {
      this.updateForm.username = newUsername;
    }
  },
  created() {
    this.updateForm.username = this.user.username || this.user.email;
    this.fetchTasks();
  },
  methods: {
    ...mapActions(['changePassword', 'updateProfile', 'deleteUser', 'fetchTasks']),
    handlePasswordForm() {
      if (this.busy) return;
      this.busy = true;

      this.changePassword(this.passwordForm)
        .then(({ success, message = 'Password changed' }) => {
          this.busy = false;
          if (success) {
            this.showFlash(message, 'success');
            this.passwordForm.password = '';
            this.passwordForm.new_password = '';
            this.$refs.pass.clear();
            this.$refs.newPass.clear();
            return;
          }
          this.showFlash(message, 'warning');
        })
        .catch(({ message = 'Could not change password' }) => {
          this.busy = false;
          this.showFlash(message, 'warning');
        });
    },
    handleUpdateForm() {
      if (this.busy || !this.updateFormOk) return;
      this.busy = true;

      this.updateProfile(this.updateForm)
        .then(({ success, message }) => {
          this.busy = false;
          if (success) {
            this.showFlash('Username updated', 'success');
            return;
          }
          this.showFlash(message, 'warning');
        })
        .catch(({ message = 'Could not update username' }) => {
          this.busy = false;
          this.showFlash(message, 'warning');
        });
    },
    logout() {
      this.deleteUser();
      this.$router.replace(this.loginPath);
    }
  }
};
</script>
