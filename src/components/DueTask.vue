<template>
  <!-- eslint-disable -->
  <li :class="listItemClasses">
    <div class="row">
      <div class="col-auto">
        <span @click.stop.prevent="mark()">
          <i v-if="busy" class="fas fa-circle-notch fa-2x fa-spin"></i>
        <i v-else :class="checkboxClasses"></i>
        </span>
      </div>
      <div class="col">
        <h5 class="text-truncate">
          <del v-if="todaySchedule.done">{{ task.name }}</del>
          <span v-else>{{ task.name }}</span>
        </h5>
      </div>
    </div>
  </li>
</template>

<script>
import { mapActions } from 'vuex';
import Flash from '@/mixins/Flash';

export default {
  name: 'DueTask',
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
  data() {
    return {
      busy: false
    };
  },
  computed: {
    listItemClasses() {
      return this.todaySchedule.done ? 'list-group-item disabled' : 'list-group-item';
    },
    checkboxClasses() {
      return this.todaySchedule.done ? 'far fa-check-square fa-2x' : 'far fa-square fa-2x';
    },
    todaySchedule() {
      return this.task.schedules
        .find(({ due_date, from, to }) => {
          const [date] = due_date.split('T');

          return new Date(`${date} ${from}`).getTime() <= this.now &&
            this.now <= new Date(`${date} ${to}`).getTime();
        });
    }
  },
  methods: {
    ...mapActions(['markTaskAsDone']),
    mark() {
      if (this.todaySchedule.done || this.busy) return;

      this.busy = true;

      this.markTaskAsDone(this.task)
        .then((success) => {
          if (success) {
            this.showFlash('Done for today', 'success');
            return;
          }

          this.showFlash('Could not complete task', 'warning');
        })
        .catch(({ message }) => this.showFlash(message, 'warning'))
        .finally(() => {
          this.busy = false;
        });
    }
  }
};
</script>
