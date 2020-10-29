<template>
  <!-- eslint-disable -->
  <div class="row mt-5 mb-5">
    <div class="col-sm-12 text-center">
      <h3>First step: create a habit</h3>
      <button class="btn btn-primary" @click.stop.prevent="createNewHabit()">
        &plus; Add a new habit
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyHabitView',
  methods: {
    createNewHabit() {
      this.$router.push({ name: 'CreateHabit' });
    }
  }
};
</script>
