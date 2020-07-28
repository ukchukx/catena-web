<template>
  <!-- eslint-disable -->
  <div class="row mt-2">
    <div class="col-md-4 col-sm-12">
      <div class="row">
        <div class="col-md-12 col-sm-6 col-auto text-center text-muted">
          <span class="h2 sub-text">Current streak</span>
        </div>
        <div class="col-md-12 col-sm-6 col-auto text-center text-muted mb-2">
          <span class="streak font-weight-bold">{{ currentStreak }}</span>
        </div>
      </div>
    </div>

    <div class="col-md-4 col-sm-12">
      <div class="row">
        <div class="col-md-12 col-sm-6 col-auto text-center text-muted">
          <span class="h2 sub-text">Longest streak</span>
        </div>
        <div class="col-md-12 col-sm-6 col-auto text-center text-muted mb-2">
          <span class="streak font-weight-bold">{{ longestStreak }}</span>
        </div>
      </div>
    </div>
    <div class="col-md-4 col-sm-12">
      <div class="row">
        <div class="col-md-12 col-sm-6 col-auto text-center text-muted">
          <span class="h2 sub-text">Performance</span>
        </div>
        <div class="col-md-12 col-sm-6 col-auto text-center text-muted mb-2">
          <span class="streak font-weight-bold">{{ performance }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Streak',
  props: {
    task: {
      required: true,
      type: Object
    },
    today: {
      required: true,
      type: Date
    }
  },
  computed: {
    performance() {
      let percent = 0;

      if (this.streakable.length) {
        const completed = this.streakable.filter(({ done }) => done).length;
        percent = +((completed * 100) / this.streakable.length).toFixed(2);
      }

      return `${percent}%`;
    },
    currentStreak() {
      const result = [];
      /* eslint-disable no-plusplus */
      for (let d = this.streakable.length - 1; d >= 0; --d) {
        const date = new Date(this.streakable[d].due_date);
        date.setUTCHours(0, 0, 0, 0);

        if (this.streakable[d].done) {
          result.push(this.streakable[d]);
        } else if (+this.today !== +date) {
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

      return !streaks.length ? 0 : Math.max(...streaks.map(streak => streak.length));
    },
    streakable() {
      return this.task.schedules
        .filter(({ due_date, done }) => {
          const date = new Date(due_date);
          date.setUTCHours(0, 0, 0, 0);

          const isToday = +this.today === +date && !done;

          return isToday || this.today >= date;
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
  font-size: 1.8rem !important;
  line-height: 3rem;
  font-weight: 400;
}
.streak {
  font-size: 2.5rem;
  line-height: 3rem;
  color: #999;
}
.upcoming {
  background-color: #D3D3D3;
  border-color: #8B8C8B;
  border-width: 2px;
}
</style>
