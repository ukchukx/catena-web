<template>
  <!-- eslint-disable -->
  <li class="list-group-item">
    <div class="row">
      <div class="col-md-9 col-sm-12">
        <h5>{{ task.name }}</h5>
      </div>
      <div class="col-md-3 col-sm-12 text-right">
        <button class="btn btn-sm btn-outline-primary" @click.stop.prevent="mark()">
          <i class="fa fa-check"></i> Done
        </button>
      </div>
    </div>
  </li>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Flash from '@/mixins/Flash';

export default {
  name: 'Task',
  mixins: [Flash],
  props: {
    task: {
      required: true,
      type: Object
    },
    now: {
      required: true,
      type: Number
    }
  },
  computed: {
    ...mapGetters(['tasks']),
    todaySchedule() {
      return this.task.schedules
        .find(({ due_date, from, to, done }) => {
          const [date] = due_date.split('T');

          return new Date(`${date} ${from}`).getTime() <= this.now && 
            this.now <= new Date(`${date} ${to}`).getTime() && 
            !done;
        });
    }
  },
  methods: {
    ...mapActions(['markTaskAsDone']),
    mark() {
      this.markTaskAsDone(this.task)
        .then((success) => {
          if (success) {
            this.showFlash('Done for today', 'success');
            return;
          }
          
          this.showFlash('Could not complete task', 'warning');
        })
        .catch(({ message }) => this.showFlash(message, 'warning'));
    }
  }
};
</script>
