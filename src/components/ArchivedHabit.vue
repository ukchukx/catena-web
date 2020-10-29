<template>
  <!-- eslint-disable -->
  <li class="list-group-item">
    <div class="row">
      <div class="col-md-9 col-sm-12">
        <h5 class="text-truncate lead">{{ habit.title }}</h5>
      </div>
      <div class="col-md-3 col-sm-12 text-right">
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-secondary" @click.stop.prevent="doRestore()">
            <i class="fas fa-angle-double-left"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" @click.stop.prevent="doDelete()">
            <i class="far fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { mapActions } from 'vuex';
import Flash from '@/mixins/Flash';

export default {
  name: 'ArchivedHabit',
  mixins: [Flash],
  props: {
    habit: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      busy: false
    };
  },
  methods: {
    ...mapActions(['restoreHabit', 'deleteHabit']),
    doRestore() {
      if (this.busy) return;

      this.busy = true;

      this.restoreHabit(this.habit)
        .then(({ success }) => {
          if (!success) {
            this.showFlash('Restore failed', 'warning');
          } else {
            this.showFlash('Habit restored', 'info');
          }
        })
        .catch(({ message }) => {
          this.showFlash(message, 'warning');
        })
        .finally(() => {
          this.busy = false;
        });
    },
    doDelete() {
      if (this.busy) return;
      if (!confirm('Are you sure?')) return; // eslint-disable-line no-alert

      this.busy = true;

      this.deleteHabit(this.habit)
        .then((success) => {
          if (!success) {
            this.showFlash('Delete failed', 'warning');
          } else {
            this.showFlash('Habit deleted', 'info');
          }
        })
        .catch(({ message }) => {
          this.showFlash(message, 'warning');
        })
        .finally(() => {
          this.busy = false;
        });
    }
  }
};
</script>
