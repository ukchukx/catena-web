<template>
  <!-- eslint-disable -->
  <div class="row mt-4">
    <div class="col">
      <h1 class="display-4">{{ habit.title }}</h1>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HabitDetails',
  props: {
    habit: {
      required: true,
      type: Object
    }
  }
};
</script>

