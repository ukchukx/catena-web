<template>
  <!-- eslint-disable -->
  <div class="row mt-5 mb-5">
    <div class="col-sm-12 text-center">
      <h3>One easy step to complete your next task</h3>
      <button class="btn btn-primary" @click.stop.prevent="createNewTask()">&plus; Add a new task</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyTaskView',
  methods: {
    createNewTask() {
      this.$router.push({ name: 'CreateTask' });
    }
  }
};
</script>
