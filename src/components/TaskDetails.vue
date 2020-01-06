<template>
  <!-- eslint-disable -->
  <div class="row mt-4">
    <div class="col">
      <h1 class="task-name">{{ task.name }}</h1>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TaskDetails',
  props: {
    task: {
      required: true,
      type: Object
    }
  }
};
</script>
<style scoped>
.task-name {
  font-size: 3rem;
  font-weight: 500;
}
</style>
