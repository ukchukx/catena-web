<template>
  <!-- eslint-disable -->
  <li class="list-group-item mt-1 mb-1">
    <div class="row">
      <div class="col-md-9 col-sm-12">
        <h5>
          <router-link :to="taskRoute">{{ task.name }}</router-link>
        </h5>
      </div>
      <div class="col-md-3 col-sm-12 text-right">
        <button class="btn btn-sm btn-outline-info" @click.stop.prevent="toggleForm()">
          Edit
          <i class="fa fa-chevron-down"></i>
        </button>
        <button
          v-if="canMark"
          class="btn btn-sm btn-outline-info"
          @click.stop.prevent="mark(task)"
        >Mark as done</button>
        <button class="btn btn-sm btn-outline-danger" @click.stop.prevent="doDelete(task)">Delete</button>
      </div>
    </div>
    <hr v-if="showForm">
    <div class="row" v-if="showForm">
      <div class="col-md-6 col-sm-12">
        <b-form @submit.stop.prevent="update()">
          <b-form-group label="Name">
            <input type="text" v-model="form.name" class="form-control">
          </b-form-group>
          <b-form-group label="Description">
            <b-form-textarea :rows="3" v-model="form.description" placeholder="Description"/>
          </b-form-group>
          <b-button :disabled="!formOk" type="submit" variant="primary">Save</b-button>
        </b-form>
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
    }
  },
  data() {
    return {
      form: {
        name: this.task.name,
        description: this.task.description,
        id: this.task.id
      },
      showForm: false,
      busy: false
    };
  },
  computed: {
    ...mapGetters(['tasks']),
    formOk() {
      const { form: { name, description } } = this;
      return name.length >= 3 &&
        !this.tasks.some(t => name === t.name && t.description === description);
    },
    taskRoute() {
      return { name: 'TaskReport', params: { id: this.task.id } };
    },
    canMark() {
      return !!this.todaySchedule && !this.todaySchedule.done;
    },
    todaySchedule() {
      const today = new Date();
      today.setUTCHours(12, 0, 0, 0);

      return this.task.schedules
        .find(({ due_date }) => {
          const dueDate = new Date(due_date);
          return today.getFullYear() === dueDate.getFullYear() &&
            today.getMonth() === dueDate.getMonth() &&
            today.getDate() === dueDate.getDate();
        });
    }
  },
  methods: {
    ...mapActions(['deleteTask', 'updateTask', 'markTaskAsDone']),
    toggleForm() {
      this.showForm = !this.showForm;
    },
    doDelete(task) {
      if (this.busy) return;
      if (!confirm('Are you sure?')) return; // eslint-disable-line no-alert

      this.busy = true;

      this.deleteTask(task)
        .then((success) => {
          this.busy = false;
          if (success) {
            this.showFlash('Task deleted', 'success');
          } else {
            this.showFlash('Task not deleted', 'warning');
          }
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showFlash(message, 'warning');
        });
    },
    mark(task) {
      this.markTaskAsDone(task)
        .then((success) => {
          if (success) {
            this.showFlash('Done for today', 'success');
            return;
          }
          this.showFlash('Could not complete task', 'warning');
        })
        .catch(({ message }) => this.showFlash(message, 'warning'));
    },
    update() {
      if (this.busy) return;
      this.busy = true;

      this.updateTask(this.form)
        .then((success) => {
          this.busy = false;
          if (success) {
            this.showFlash('Task updated', 'success');
          } else {
            this.showFlash('Task not updated', 'warning');
          }
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showFlash(message, 'warning');
        });
    }
  }
};
</script>
