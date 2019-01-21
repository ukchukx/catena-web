<script>
export default {
  name: 'Flash',
  methods: {
    showFlash(message, type, options = { timeout: 5000 }) {
      this.flash(message, type, options);
    }
  }
};
</script>
