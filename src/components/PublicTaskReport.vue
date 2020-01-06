<template>
  <!-- eslint-disable -->
  <div class="container-fluid">
    <div class="row mt-4">
      <div class="col-sm-12 mb-3" v-if="notFound && !fetching">
        <div class="card">
          <div class="card-body">
            <h1 class="streak text-center">Not Found.</h1>
          </div>
        </div>
      </div>

      <div class="col-sm-12 mb-3" v-if="fetching">
        <div class="card">
          <div class="card-body">
            <i class="h2 text-center" v-if="fetching">Loading...</i>
          </div>
        </div>
      </div>

      <div class="col-sm-12 mb-3" v-if="!notFound">
        <div class="card">
          <div class="card-body">
            <TaskDetails :task="task" />
            <div class="row mt-4 mb-4">
              <div class="col">
                <span class="h3">By </span>
                <span class="text-muted task-owner h3">{{ task.user.username }}</span>
              </div>
            </div>
            <Streaks :task="task" :today="today" />
            <div class="row mt-3">
              <div class="col">
                <v-calendar :is-expanded="true" :attributes="events"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-12 mb-3">
        <div class="card">
          <div class="card-body">
            <router-link :to="loginPath"><u>Sign up to create your own schedules</u></router-link>            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Streaks from './Streaks';
import TaskDetails from './TaskDetails';

export default {
  name: 'PublicTaskReport',
  components: {
    Streaks,
    TaskDetails
  },
  data() {
    return {
      fetching: true,
      notFound: true,
      loginPath: { name: 'Signup' },
      task: { schedules: [] },
      taskId: this.$route.params.id
    };
  },
  computed: {
    today() {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      return today;
    },
    events() {
      return this.task.schedules
        .map(({ id, done, due_date }) => {
          const date = new Date(due_date);
          date.setUTCHours(0, 0, 0, 0);

          const isToday = +this.today === +date && !done;
          const highlight = { fillMode: 'light' };

          if (done) { // done
            highlight.color = 'green';
          } else if (isToday) { // today
            highlight.color = 'gray';
          } else if (this.today <= date) { // upcoming
            highlight.color = 'gray';
          } else { // missed
            highlight.color = 'red';
          }

          return isToday ? { dates: date, key: id, dot: highlight } : { dates: date, key: id, highlight };
        });
    }
  },
  created() {
    if (!!this.$route.params.id) { // eslint-disable-line no-extra-boolean-cast
      this.fetchTask(this.$route.params.id)
        .then(({ success, data }) => {
          if (success) {
            this.notFound = false;
            this.fetching = false;
            this.task = data;
          }
        })
        .catch(() => {
          this.fetching = false;
        });
    }
  },
  methods: {
    ...mapActions(['fetchTask'])
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
  color: #999;
}
.task-owner {
  color: #999;
}
.upcoming {
  background-color: #D3D3D3;
  border-color: #8B8C8B;
  border-width: 2px;
}
</style>

