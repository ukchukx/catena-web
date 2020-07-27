<template>
  <!-- eslint-disable -->
  <div class="row">
    <div class="col-sm-6 col-md-2">
      <router-link :to="path" class="btn btn-outline-secondary btn-sm btn-block text-left">
        <i class="fa fa-chevron-left"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskListLink',
  data() {
    return {
      path: { name: 'Tasks' }
    };
  }
};
</script>
