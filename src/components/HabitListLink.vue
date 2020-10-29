<template>
  <!-- eslint-disable -->
  <div class="row">
    <div class="col-sm-6 col-md-2">
      <router-link :to="path" class="text-muted text-left">
        <i class="fa fa-chevron-left"></i>
        Habits
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HabitListLink',
  data() {
    return {
      path: { name: 'Habits' }
    };
  }
};
</script>
