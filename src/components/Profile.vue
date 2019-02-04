<template>
  <!-- eslint-disable -->
  <div class="container-fluid">
    <div class="row mt-4">
      <div class="col-sm-10 mx-auto">
        <flash-message/>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-sm-12 col-md-3">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="offset-sm-6 col-sm-6 text-right">
                <button @click.stop.prevent="logout()" class="btn btn-secondary">Logout</button>
              </div>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input readonly disabled type="text" class="form-control" :value="user.email">
            </div>
            <form @submit.stop.prevent="handleUpdateForm()">
              <label>Username</label>
              <div class="input-group mb-3">
                <input type="text" class="form-control" v-model.trim="updateForm.username">
                <div class="input-group-append">
                  <button
                    :disabled="!updateFormOk"
                    type="submit"
                    class="btn btn-outline-secondary"
                  >Update username</button>
                </div>
              </div>
            </form>
            <hr>
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
      </div>
      <div class="col-sm-12 col-md-9">
        <div class="card">
          <div class="card-body">
            <router-view/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PasswordInput from '@/components/PasswordInput';
import Flash from '@/mixins/Flash';

export default {
  name: 'Profile',
  components: {
    PasswordInput
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
            this.showFlash(message, 'info');
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
      if (this.busy) return;
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
