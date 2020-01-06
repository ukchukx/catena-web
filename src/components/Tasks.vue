<template>
  <!-- eslint-disable -->
  <div class="row" v-if="tasks.length">
    <div class="col-sm-12">
      <button
        class="btn btn-outline-primary mb-3"
        @click.stop.prevent="createNewTask()"
      >&plus; New schedule</button>
    </div>

    <div class="col-sm-12">
      <b-tabs content>
        <b-tab title="Today">
          <ul v-if="hasDueTasks" class="list-group mt-3">
            <DueTask :now="now" :task="task" v-for="task in dueTasks" :key="task.id"/>
          </ul>
          <div v-else class="row mt-5 mb-5">
            <div class="col-sm-12 text-center">
              <h3>Kudos</h3>
              <h6>Nothing to do today</h6>
            </div>
          </div>
        </b-tab>

        <b-tab title="All">
          <ul class="list-group mt-3">
            <Task :task="task" v-for="task in otherTasks" :key="task.id"/>
          </ul>
        </b-tab>

        <b-tab title="Archived">
          <ul class="list-group mt-3">
            <ArchivedTask :task="task" v-for="task in archivedTasks" :key="task.id"/>
          </ul>
        </b-tab>
      </b-tabs>
    </div>
  </div>
  <empty-task-view v-else/>
</template>

<script>
import { mapGetters } from 'vuex';
import EmptyTaskView from '@/components/EmptyTaskView';
import Task from '@/components/Task';
import DueTask from '@/components/DueTask';
import ArchivedTask from '@/components/ArchivedTask';
import Flash from '@/mixins/Flash';

export default {
  name: 'Tasks',
  components: {
    ArchivedTask,
    DueTask,
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
    hasDueTasks() {
      return !!this.dueTasks.length;
    },
    archivedTasks() {
      return this.tasks.filter(({ deleted_at }) => !!deleted_at);
    },
    otherTasks() {
      const dueIds = this.dueTasks.map(({ id }) => id);

      return this.tasks.filter(({ deleted_at, id }) => !deleted_at && !dueIds.includes(id));
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
