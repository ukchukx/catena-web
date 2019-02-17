<template>
  <!-- eslint-disable -->
  <h3 class="logo font-weight-bold">
    <router-link :to="loginPath" class="text-secondary">Catena</router-link>
  </h3>
</template>

<script>
export default {
  name: 'FormLogo',
  data() {
    return {
      loginPath: { name: 'Login' }
    };
  }
};
</script>
