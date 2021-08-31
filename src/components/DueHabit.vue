<template>
  <!-- eslint-disable -->
  <li :class="listItemClasses">
    <div class="row">
      <div class="col-auto">
        <span @click.stop.prevent="mark()">
          <i v-if="busy" class="fas fa-circle-notch fa-2x fa-spin"></i>
          <HabitCheckbox v-else :schedule="todaySchedule" />
        </span>
      </div>
      <div class="col">
        <h5 class="text-truncate">
          <del class="lead" v-if="todaySchedule.done">{{ habit.title }}</del>
          <span class="lead" v-else>{{ habit.title }}</span>
        </h5>
      </div>
    </div>
  </li>
</template>

<script>
import { mapActions } from 'vuex';
import { isTimeContainedInDate } from '@/utils/dates';
import Flash from '@/mixins/Flash';
import HabitCheckbox from '@/components/HabitCheckbox';

export default {
  name: 'DueHabit',
  components: {
    HabitCheckbox
  },
  mixins: [Flash],
  props: {
    habit: {
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
    todaySchedule() {
      const { title, history } = this.habit;
      const item = history.find(({ date }) => isTimeContainedInDate(date, this.now));
      return { ...item, title };
    }
  },
  methods: {
    ...mapActions(['markPendingHabit']),
    mark() {
      if (this.todaySchedule.done || this.busy) return;

      this.busy = true;

      this.markPendingHabit(this.habit)
        .then((success) => {
          if (!success) {
            this.showFlash('Could not complete habit', 'error');
          }
        })
        .catch(({ message }) => this.showFlash(message, 'warning'))
        .finally(() => {
          this.busy = false;
        });
    }
  }
};
</script>
