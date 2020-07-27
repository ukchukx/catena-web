<template>
  <!--  eslint-disable -->
  <i></i>
</template>
<script>
export default {
  name: 'Flash',
  methods: {
    showFlash(message, type) {
      type = type !== 'error' ? 'default' : type;

      this.$toasted.show(message, { type });
    }
  }
};
</script>
