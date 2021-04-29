<template>
  <!-- eslint-disable -->
  <i></i>
</template>
<script>
export default {
  name: 'AuthChecker',
  methods: {
    maybeLogout({ message = '' }) {
      if (message !== 'Unauthenticated') return;

      this.$store.dispatch('deleteUser');
      this.$router.replace({ name: 'Login' });
    }
  }
};
</script>

