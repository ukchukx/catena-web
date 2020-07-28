<template>
  <!-- eslint-disable -->
  <Page>
    <TaskListLink/>
    <TaskDetails :task="task" />
    <Streaks :task="task" :today="today" />
    <div class="row mt-3">
      <div class="col">
        <v-calendar :is-expanded="true" :attributes="events"/>
      </div>
    </div>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';
import TaskListLink from '@/components/TaskListLink';
import Page from '@/components/Page';
import Streaks from './Streaks';
import TaskDetails from './TaskDetails';

export default {
  name: 'TaskReport',
  components: {
    TaskListLink,
    Page,
    Streaks,
    TaskDetails
  },
  computed: {
    ...mapGetters(['tasks']),
    task() {
      const { params: { id } } = this.$route;
      return this.tasks.find(t => t.id === new Number(id).valueOf());
    },
    today() {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      return today;
    },
    events() {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      return this.task.schedules
        .map(({ id, done, due_date }) => {
          const date = new Date(due_date);
          date.setUTCHours(0, 0, 0, 0);

          const isToday = +today === +date && !done;
          const highlight = { fillMode: 'light' };

          if (done) { // done
            highlight.color = 'green';
          } else if (isToday) { // today
            highlight.color = 'gray';
          } else if (today <= date) { // upcoming
            highlight.color = 'gray';
          } else { // missed
            highlight.color = 'red';
          }

          return isToday ? { dates: date, key: id, dot: highlight } : { dates: date, key: id, highlight };
        });
    }
  },
  updated() {
    if (!this.task) {
      this.$router.replace({ name: 'DueTasks' });
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

