<template>
  <!-- eslint-disable -->
  <div class="container-fluid">
    <div class="row mt-3 mb-3">
      <div class="col-sm-12 min-vh-100">
        <slot />
      </div>
    </div>

    <nav class="navbar fixed-bottom navbar-light bg-white mt-4">
      <div class="container-fluid justify-content-center">
        <div class="row w-100">
          <div class="col-4 text-center">
            <a class="navbar-brand mx-auto" :href="dueTodosPath">
              <i :class="dueIcon"></i>
            </a>
          </div>
          <div class="col-4 text-center">
            <a class="navbar-brand mx-auto" :href="allTodosPath">
              <i :class="allIcon"></i>
            </a>
          </div>
          <div class="col-4 text-center">
            <a class="navbar-brand mx-auto" :href="accountPath">
              <i :class="accountIcon"></i>
            </a>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import Flash from '@/mixins/Flash';

export default {
  name: 'Page',
  mixins: [Flash],
  data() {
    return {
      dueTodosPath: this.$router.resolve({ name: 'DueTasks' }).href,
      allTodosPath: this.$router.resolve({ name: 'Tasks' }).href,
      accountPath: this.$router.resolve({ name: 'Profile' }).href
    };
  },
  computed: {
    currentRoute() {
      return this.$route.name;
    },
    dueIcon() {
      const common = 'fa-check-square fa-2x';
      return this.currentRoute === 'DueTasks' ? `fas ${common}` : `far ${common}`;
    },
    allIcon() {
      const common = 'fa-list-alt fa-2x';
      return this.currentRoute === 'Tasks' ? `fas ${common}` : `far ${common}`;
    },
    accountIcon() {
      const common = 'fa-user fa-2x';
      return this.currentRoute === 'Profile' ? `fas ${common}` : `far ${common}`;
    }
  }
};
</script>
