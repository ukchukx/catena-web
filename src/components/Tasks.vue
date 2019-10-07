<template>
  <!-- eslint-disable -->
  <div class="row" v-if="tasks.length">
    <div class="col-sm-12">
      <button
        class="btn btn-outline-primary mb-3"
        @click.stop.prevent="createNewTask()"
      >&plus; Add task</button>
    </div>

    <div class="col-sm-12">
      <b-tabs content>
        <b-tab title="Due tasks">
          <ul v-if="hasDueTasks" class="list-group mt-3">
            <Task :task="task" v-for="task in dueTasks" :key="task.id"/>
          </ul>
          <div v-else class="row mt-5 mb-5">
            <div class="col-sm-12 text-center">
              <h3>Kudos</h3>
              <h6>No due tasks</h6>
            </div>
          </div>
        </b-tab>

        <b-tab title="Other tasks">
          <ul class="list-group mt-3">
            <Task :task="task" v-for="task in otherTasks" :key="task.id"/>
          </ul>
        </b-tab>

        <b-tab title="Archived tasks" disabled></b-tab>
      </b-tabs>
    </div>
  </div>
  <empty-task-view v-else/>
</template>

<script>
import { mapGetters } from 'vuex';
import EmptyTaskView from '@/components/EmptyTaskView';
import Task from '@/components/Task';
import Flash from '@/mixins/Flash';

export default {
  name: 'Tasks',
  components: {
    EmptyTaskView,
    Task
  },
  mixins: [Flash],
  computed: {
    ...mapGetters(['tasks']),
    dueTasks() {
      const today = new Date();
      today.setUTCHours(12, 0, 0, 0);

      return this.tasks.filter(({ schedules }) => schedules
        .some(({ due_date, done }) => {
          const dueDate = new Date(due_date);
          return today.getFullYear() === dueDate.getFullYear() &&
            today.getMonth() === dueDate.getMonth() &&
            today.getDate() === dueDate.getDate() &&
            !done;
        })
      );
    },
    otherTasks() {
      return this.tasks.filter(({ id }) => this.dueTasks.every(task => task.id !== id));
    },
    hasDueTasks() {
      return !!this.dueTasks.length;
    }
  },
  methods: {
    createNewTask() {
      this.$router.push({ name: 'CreateTask' });
    }
  }
};
</script>
