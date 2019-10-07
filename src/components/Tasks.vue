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
            <Task :now="now" :task="task" v-for="task in dueTasks" :key="task.id"/>
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
            <Task :now="now" :task="task" v-for="task in otherTasks" :key="task.id"/>
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
  data() {
    return {
      now: Date.now()
    };
  },
  computed: {
    ...mapGetters(['tasks']),
    dueTasks() {
      return this.tasks.filter(({ schedules }) => schedules
        .some(({ due_date, done, from, to }) => {
          const [date] = due_date.split('T');

          return new Date(`${date} ${from}`).getTime() <= this.now && 
            this.now <= new Date(`${date} ${to}`).getTime() && 
            !done;
        })
      );
    },
    otherTasks() {
      const dueTasks = this.dueTasks.map(({ id }) => id);

      return this.tasks.filter(({ id }) => !dueTasks.includes(id));
    },
    hasDueTasks() {
      return !!this.dueTasks.length;
    }
  },
  mounted() {
    setTimeout(this.updateNow, 300000);
  },
  methods: {
    createNewTask() {
      this.$router.push({ name: 'CreateTask' });
    },
    updateNow() {
      this.now = Date.now();
      setTimeout(this.updateNow, 300000);
    }
  }
};
</script>
