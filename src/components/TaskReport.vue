<template>
  <!-- eslint-disable -->
  <div>
    <ProfileLink/>
    <div class="row mt-4">
      <div class="col-sm-12">
        <h3>{{ task.name }}</h3>
      </div>
      <!-- <div class="col-sm-12 mt-3">
        <h6>Current streak: 0</h6>
        <h6>Longest streak: 0</h6>
      </div>-->
      <div class="col-sm-12 col-md-6 mx-auto mt-4">
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
    events() {
      return this.task.schedules
        .map((schedule) => {
          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);

          const date = new Date(schedule.due_date);
          date.setUTCHours(0, 0, 0, 0);

          let highlight;
          if (schedule.done) { // done
            highlight = {
              backgroundColor: '#66b3cc',
              borderColor: '#53a9c6',
              borderWidth: '2px'
            };
          } else if (today <= date) { // upcoming
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

          return {
            contentStyle: { color: 'white' },
            highlight,
            dates: date,
            key: schedule.id,
            customData: schedule
          };
        });
    }
  }
};
</script>

