<template>
  <!-- eslint-disable -->
  <Page>
    <HabitListLink/>
    <HabitDetails :habit="habit" />
    <Streaks :habit="habit" :today="today" />
    <div class="row mt-3">
      <div class="col">
        <v-calendar :is-expanded="true" :attributes="events"/>
      </div>
    </div>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';
import HabitListLink from '@/components/HabitListLink';
import Page from '@/components/Page';
import { habitHistory } from '@/utils/habits';
import Streaks from './Streaks';
import HabitDetails from './HabitDetails';

export default {
  name: 'HabitReport',
  components: {
    HabitListLink,
    Page,
    Streaks,
    HabitDetails
  },
  computed: {
    ...mapGetters(['habits']),
    habit() {
      const { params: { id } } = this.$route;
      return this.habits.find(h => h.id === id);
    },
    today() {
      return new Date();
    },
    events() {
      return habitHistory(this.habit, this.today);
    }
  },
  updated() {
    if (!this.habit) {
      this.$router.replace({ name: 'DueHabits' });
    }
  }
};
</script>
<style scoped>
.sub-text {
  font-size: 2rem !important;
  font-weight: 400;
}
.streak {
  font-size: 3.5rem;
  color: #999;
}
.upcoming {
  background-color: #D3D3D3;
  border-color: #8B8C8B;
  border-width: 2px;
}
</style>
