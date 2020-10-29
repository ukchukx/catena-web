<template>
  <!-- eslint-disable -->
  <i></i>
</template>
<script>
export default {
  name: 'AuthChecker',
  methods: {
    maybeLogout({ tokenExpired = false }) {
      if (!tokenExpired) return;

      this.$store.dispatch('deleteUser');
      this.$router.replace({ name: 'Login' });
    }
  }
};
</script>

