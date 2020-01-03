<template>
  <!-- eslint-disable -->
  <li class="list-group-item">
    <div class="row">
      <div class="col-md-9 col-sm-12">
        <h5>
          <router-link :to="taskRoute">{{ task.name }}</router-link>
        </h5>
      </div>
      <div class="col-md-3 col-sm-12 text-right">
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-secondary" @click.stop.prevent="toggleForm()">
            Edit
          </button>
          <button class="btn btn-sm btn-outline-danger" @click.stop.prevent="doDelete()">Delete</button>
        </div>
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
    },
    now: {
      required: true,
      type: Number
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
      return name.trim().length >= 3 || description.trim() !== this.task.description;
    },
    taskRoute() {
      return { name: 'TaskReport', params: { id: this.task.id } };
    }
  },
  mounted() {
    if (this.todaySchedule && this.todaySchedule) this.form.id = this.todaySchedule.id;
  },
  methods: {
    ...mapActions(['deleteTask', 'updateTask', 'markTaskAsDone', 'updateSchedule']),
    toggleForm() {
      this.showForm = !this.showForm;
    },
    doDelete() {
      if (this.busy) return;
      if (!confirm('Are you sure?')) return; // eslint-disable-line no-alert

      this.busy = true;

      this.deleteTask(this.task)
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
    update() {
      if (this.busy) return;
      this.busy = true;
      this.form.description = this.form.description.trim();
      this.form.name = this.form.name.trim();

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
