<template>
  <!-- eslint-disable -->
  <div class="row" v-if="tasks.length">
    <div class="col-sm-12">
      <button class="btn btn-primary mb-3" @click.stop.prevent="createNewTask()">&plus; Add task</button>
    </div>
    <div class="col-sm-12">
      <ul class="list-group">
        <Task :task="task" v-for="task in dueTasks" :key="task.id"/>
        <Task :task="task" v-for="task in notDueTasks" :key="task.id"/>
      </ul>
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
        .some(({ due_date }) => {
          const dueDate = new Date(due_date);
          return today.getFullYear() === dueDate.getFullYear() &&
            today.getMonth() === dueDate.getMonth() &&
            today.getDate() === dueDate.getDate();
        })
      );
    },
    notDueTasks() {
      return this.tasks.filter(({ id }) => this.dueTasks.every(task => task.id !== id));
    }
  },
  methods: {
    createNewTask() {
      this.$router.push({ name: 'CreateTask' });
    }
  }
};
</script>
