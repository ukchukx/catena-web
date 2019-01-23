<template>
  <!-- eslint-disable -->
  <div>
    <ProfileLink/>
    <div class="row mt-4">
      <div class="col-sm-12 col-md-4 mb-3">
        <h1 class="task-name">{{ task.name }}</h1>
        <p class="sub-text text-muted mt-3">
          <span class="h2">Current streak</span>
          <span class="streak font-weight-bold">{{ currentStreak }}</span>
        </p>
        <p class="sub-text text-muted">
          <span class="h2">Longest streak</span>
          <span class="streak font-weight-bold">{{ longestStreak }}</span>
        </p>
      </div>
      <div class="col-sm-12 col-md-8">
        <v-calendar :is-expanded="true" :attributes="events"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProfileLink from '@/components/ProfileLink';

export default {
  name: 'TaskReport',
  components: {
    ProfileLink
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
    currentStreak() {
      const result = [];
      /* eslint-disable no-plusplus */
      for (let d = this.streakable.length - 1; d >= 0; --d) {
        if (this.streakable[d].done) {
          result.push(this.streakable[d]);
        } else {
          break;
        }
      }

      return result.length;
    },
    longestStreak() {
      const streaks = [];
      /* eslint-disable no-plusplus */
      for (let d = 0; d < this.streakable.length; ++d) {
        const x = [];
        while (this.streakable[d] && this.streakable[d].done) {
          x.push(this.streakable[d]);
          ++d;
        }
        streaks.push(x);
      }

      return Math.max(...streaks.map(streak => streak.length));
    },
    streakable() {
      return this.task.schedules
        .filter(({ due_date, done }) => {
          const date = new Date(due_date);
          date.setUTCHours(0, 0, 0, 0);

          const isToday = +this.today === +date && !done;

          return isToday || this.today >= date;
        });
    },
    events() {
      return this.task.schedules
        .map((schedule) => {
          const date = new Date(schedule.due_date);
          date.setUTCHours(0, 0, 0, 0);

          const isToday = +this.today === +date && !schedule.done;

          let highlight;
          let dot;
          if (schedule.done) { // done
            highlight = {
              backgroundColor: '#66b3cc',
              borderColor: '#53a9c6',
              borderWidth: '2px'
            };
          } else if (isToday) { // today
            dot = {
              backgroundColor: '#8B8C8B',
              borderColor: '#333333',
              borderWidth: '2px'
            };
          } else if (this.today <= date) { // upcoming
            highlight = {
              backgroundColor: '#8B8C8B',
              borderColor: '#333333',
              borderWidth: '2px'
            };
          } else { // missed
            highlight = {
              backgroundColor: '#ff8080',
              borderColor: '#ff6666',
              borderWidth: '2px'
            };
          }

          const obj = {
            contentStyle: { color: 'white' },
            highlight,
            dates: date,
            key: schedule.id,
            customData: schedule
          };
          const highlightStyle = { highlight, contentStyle: { color: 'white' } };
          const dotStyle = { dot, contentStyle: { color: 'black' } };

          return !isToday ? Object.assign(obj, highlightStyle) : Object.assign(obj, dotStyle);
        });
    }
  }
};
</script>
<style scoped>
.task-name {
  font-size: 3.5rem;
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.sub-text {
  font-size: 2rem !important;
  font-weight: 400;
}
.streak {
  font-size: 3.5rem;
}
</style>

