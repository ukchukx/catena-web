<template>
  <!-- eslint-disable -->
  <span>
    <input :checked="schedule.done" :disabled="schedule.done" :id="schedule.habit_id" type="checkbox">
    <label :for="schedule.habit_id" />
  </span>
</template>
<script>
export default {
  name: 'HabitCheckbox',
  props: {
    schedule: {
      required: true,
      type: Object
    }
  }
};
</script>
<style scoped>
input[type=checkbox] {
  display: none;
}

input[type=checkbox] + label {
  display: block;
  cursor: pointer;
}

input[type=checkbox] + label:before {
  content: "\2714";
  border: 0.2em solid #7c7a7a;
  border-radius: 0.2em;
  display: inline-block;
  width: 1.7em;
  height: 1.7em;
  vertical-align: bottom;
  color: transparent;
}

input[type=checkbox]:checked + label:before {
  color: #fff;
}
</style>
