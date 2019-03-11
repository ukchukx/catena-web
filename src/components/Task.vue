<template>
  <!-- eslint-disable -->
  <li class="list-group-item">
    <div class="row">
      <div class="col-md-9 col-sm-12">
        <h5>
          <router-link :class="nameClasses" :to="taskRoute">{{ task.name }}</router-link>
        </h5>
      </div>
      <div class="col-md-3 col-sm-12 text-right">
        <button
          v-if="canMark"
          class="btn btn-sm btn-outline-primary"
          @click.stop.prevent="toggleScheduleForm()"
        >
          <i class="fa fa-check"></i> Done
        </button>
        <button class="btn btn-sm btn-outline-secondary" @click.stop.prevent="toggleForm()">
          Edit
        </button>
        <button class="btn btn-sm btn-outline-danger" @click.stop.prevent="doDelete()">Delete</button>
      </div>
    </div>
    <hr v-if="showForm || showScheduleForm">
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
    <div class="row" v-if="showScheduleForm">
      <div class="col-md-6 col-sm-12">
        <b-form @submit.stop.prevent="mark()">
          <b-form-group label="Remarks (optional)">
            <b-form-textarea :rows="3" v-model="scheduleForm.remarks" placeholder="Remarks"/>
          </b-form-group>
          <b-button type="submit" variant="primary">Mark as done</b-button>
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
      scheduleForm: {
        id: 0,
        remarks: ''
      },
      remarks: '',
      showForm: false,
      showScheduleForm: false,
      busy: false
    };
  },
  computed: {
    ...mapGetters(['tasks']),
    formOk() {
      const { form: { name, description } } = this;
      return name.trim().length >= 3 || description.trim() !== this.task.description;
    },
    nameClasses() {
      return this.canMark ? '' : 'text-muted';
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
  created() {
    if (this.todaySchedule) this.scheduleForm.id = this.todaySchedule.id;
  },
  methods: {
    ...mapActions(['deleteTask', 'updateTask', 'markTaskAsDone', 'updateSchedule']),
    toggleForm() {
      this.showForm = !this.showForm;
    },
    toggleScheduleForm() {
      this.showScheduleForm = !this.showScheduleForm;
    },
    resetScheduleForm() {
      this.scheduleForm.remarks = '';
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
    mark() {
      this.markTaskAsDone(this.task)
        .then((success) => {
          if (success) {
            if (this.scheduleForm.remarks.length) this.updateSchedule(this.scheduleForm);
            this.resetScheduleForm();
            this.toggleScheduleForm();
            this.showFlash('Done for today', 'success');
            return;
          }
          this.showFlash('Could not complete task', 'warning');
          this.resetScheduleForm();
        })
        .catch(({ message }) => this.showFlash(message, 'warning'));
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
