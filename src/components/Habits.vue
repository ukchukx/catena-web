<template>
  <!-- eslint-disable -->
  <Page>
    <div class="row" v-if="habits.length">
      <div class="col-sm-12">
        <button class="btn btn-outline-primary mb-3" @click.stop.prevent="createNewHabit()">
          <i class="fas fa-plus"></i>
          New habit
        </button>
      </div>

      <div class="col-sm-12 col-md-6 offset-md-3">
        <b-tabs fill content>
          <b-tab title="All">
            <ul class="list-group list-group-flush mt-3">
              <Habit :habit="habit" v-for="habit in activeHabits" :key="habit.id"/>
            </ul>
          </b-tab>

          <b-tab title="Archived">
            <ul v-if="archivedHabits.length" class="list-group list-group-flush mt-3">
              <ArchivedHabit :habit="habit" v-for="habit in archivedHabits" :key="habit.id"/>
            </ul>
            <div v-else class="col-sm-12 text-center pt-4 mt-4">
              <h6 class="display-4">Nothing in your archives</h6>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
    <empty-habit-view v-else/>
  </Page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import EmptyHabitView from '@/components/EmptyHabitView';
import Habit from '@/components/Habit';
import ArchivedHabit from '@/components/ArchivedHabit';
import Page from '@/components/Page';
import Flash from '@/mixins/Flash';
import AuthChecker from '@/mixins/AuthChecker';

export default {
  name: 'Habits',
  components: {
    ArchivedHabit,
    EmptyHabitView,
    Page,
    Habit
  },
  mixins: [Flash, AuthChecker],
  data() {
    return {
      now: Date.now()
    };
  },
  computed: {
    ...mapGetters(['habits']),
    archivedHabits() {
      return this.habits.filter(({ archived }) => archived);
    },
    activeHabits() {
      return this.habits.filter(({ archived }) => !archived);
    }
  },
  mounted() {
    this.fetchHabits().catch(data => this.maybeLogout(data));
  },
  methods: {
    ...mapActions(['fetchHabits']),
    createNewHabit() {
      this.$router.push({ name: 'CreateHabit' });
    },
    updateNow() {
      this.now = Date.now();
      setTimeout(this.updateNow, 300000);
    }
  }
};
</script>
