<template>
  <!-- eslint-disable -->
  <Page>
    <div class="row">
      <div v-if="hasDueHabits" class="col-sm-12 col-md-6 offset-md-3">
        <ul class="list-group list-group-flush mt-3 mx-2">
          <DueHabit
            :now="now"
            :habit="habit"
            v-for="habit in dueHabits"
            :key="habit.id"
          />
        </ul>
      </div>
      <div v-else class="col-sm-12 mt-5 mb-5">
        <EmptyHabitView v-if="!hasHabits" />
        <div v-else class="text-center">
          <h3>Kudos</h3>
          <h6>Nothing to do today</h6>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DueHabit from '@/components/DueHabit';
import EmptyHabitView from '@/components/EmptyHabitView';
import Page from '@/components/Page';
import Flash from '@/mixins/Flash';
import { isTimeContainedInDate } from '@/utils/dates';

export default {
  name: 'DueHabits',
  components: {
    DueHabit,
    EmptyHabitView,
    Page
  },
  mixins: [Flash],
  data() {
    return {
      now: Date.now()
    };
  },
  computed: {
    ...mapGetters(['habits']),
    unarchivedHabits() {
      return this.habits.filter(({ archived }) => !archived);
    },
    dueHabits() {
      return this.unarchivedHabits
        .filter(({ history }) => history.some(({ date }) => isTimeContainedInDate(date, this.now)));
    },
    hasHabits() {
      return !!this.unarchivedHabits.length;
    },
    hasDueHabits() {
      return !!this.dueHabits.length;
    }
  },
  mounted() {
    this.fetchHabits();
    setTimeout(this.updateNow, 300000);
  },
  methods: {
    ...mapActions(['fetchHabits']),
    updateNow() {
      this.now = Date.now();
      setTimeout(this.updateNow, 300000);
    }
  }
};
</script>
