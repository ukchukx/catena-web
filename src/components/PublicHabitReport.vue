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
            <HabitDetails :habit="habit" />
            <div class="row mt-4 mb-4">
              <div class="col">
                <span class="h3">By </span>
                <span class="text-muted habit-owner">{{ username }}</span>
              </div>
            </div>
            <Streaks :habit="habit" :today="today" />
            <div class="row mt-3">
              <div class="col">
                <v-calendar :is-expanded="true" :attributes="events"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-12 mb-3" v-if="!isLoggedIn">
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
import { mapActions, mapGetters } from 'vuex';
import { habitHistory } from '@/utils/habits';
import Streaks from './Streaks';
import HabitDetails from './HabitDetails';

export default {
  name: 'PublicHabitReport',
  components: {
    Streaks,
    HabitDetails
  },
  data() {
    return {
      fetching: true,
      notFound: true,
      loginPath: { name: 'Signup' },
      habit: { schedules: [] },
      habitId: this.$route.params.id
    };
  },
  computed: {
    ...mapGetters(['user']),
    username() {
      const { habit: { user: { email, username } } } = this;
      return !!username ? username : email.split('@')[0];
    },
    isLoggedIn() {
      return !!this.user.id;
    },
    today() {
      return new Date();
    },
    events() {
      return habitHistory(this.habit, this.today);
    }
  },
  created() {
    if (!!this.$route.params.id) {
      this.fetchHabit(this.$route.params.id)
        .then(({ success, data }) => {
          if (success) {
            this.notFound = false;
            this.fetching = false;
            this.habit = data;
          }
        })
        .catch(() => {
          this.fetching = false;
        });
    }
  },
  methods: {
    ...mapActions(['fetchHabit'])
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
.habit-owner {
  color: #999;
  font-size: 1.75rem;
}
.upcoming {
  background-color: #D3D3D3;
  border-color: #8B8C8B;
  border-width: 2px;
}
</style>
