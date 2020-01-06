<template>
  <!-- eslint-disable -->
  <li class="list-group-item">
    <div class="row">
      <div class="col-md-9 col-sm-12">
        <h5>{{ task.name }}</h5>
      </div>
      <div class="col-md-3 col-sm-12 text-right">
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-secondary" @click.stop.prevent="doRestore()">
            Restore
          </button>
          <button class="btn btn-sm btn-outline-danger" @click.stop.prevent="doDelete()">Delete</button>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { mapActions } from 'vuex';
import Flash from '@/mixins/Flash';

export default {
  name: 'ArchivedTask',
  mixins: [Flash],
  props: {
    task: {
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
    ...mapActions(['restoreTask', 'deleteTask']),
    doRestore() {
      if (this.busy) return;

      this.busy = true;

      this.restoreTask(this.task)
        .then(({ success }) => {
          this.busy = false;
          if (!success) this.showFlash('Restore failed', 'warning');
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showFlash(message, 'warning');
        });
    },
    doDelete() {
      if (this.busy) return;
      if (!confirm('Are you sure?')) return; // eslint-disable-line no-alert

      this.busy = true;

      this.deleteTask(this.task)
        .then((success) => {
          this.busy = false;
          if (!success) this.showFlash('Delete failed', 'warning');
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showFlash(message, 'warning');
        });
    }
  }
};
</script>
