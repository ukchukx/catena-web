<template>
  <div class="input-group mb-3">
    <input :type="type" class="form-control" v-model="val">
    <div class="input-group-append">
      <button @click.stop.prevent="toggle()" class="btn btn-outline-secondary" type="button">
        <i :class="label"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordInput',
  data() {
    return {
      val: '',
      show: false
    };
  },
  computed: {
    label() {
      return !this.show ? 'fa fa-eye' : 'fa fa-eye-slash';
    },
    type() {
      return !this.show ? 'password' : 'text';
    }
  },
  watch: {
    val(val) {
      this.$emit('input', val);
    }
  },
  methods: {
    clear() {
      this.val = '';
    },
    toggle() {
      this.show = !this.show;
    }
  }
}
</script>
