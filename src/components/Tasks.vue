<template>
  <!-- eslint-disable -->
  <Page>
    <div class="row" v-if="tasks.length">
      <div class="col-sm-12">
        <button
          class="btn btn-outline-primary mb-3"
          @click.stop.prevent="createNewTask()">
          <i class="fas fa-plus"></i>
          New schedule
        </button>
      </div>

      <div class="col-sm-12">
        <b-tabs fill content>
          <b-tab title="All">
            <ul class="list-group list-group-flush mt-3">
              <Task :task="task" v-for="task in activeTasks" :key="task.id"/>
            </ul>
          </b-tab>

          <b-tab title="Archived">
            <ul v-if="archivedTasks.length" class="list-group list-group-flush mt-3">
              <ArchivedTask :task="task" v-for="task in archivedTasks" :key="task.id"/>
            </ul>
            <div v-else class="col-sm-12 text-center pt-4 mt-4">
              <h3>Nothing in your archives</h3>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
    <empty-task-view v-else/>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';
import EmptyTaskView from '@/components/EmptyTaskView';
import Task from '@/components/Task';
import ArchivedTask from '@/components/ArchivedTask';
import Page from '@/components/Page';
import Flash from '@/mixins/Flash';

export default {
  name: 'Tasks',
  components: {
    ArchivedTask,
    EmptyTaskView,
    Page,
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
    archivedTasks() {
      return this.tasks.filter(({ deleted_at }) => !!deleted_at);
    },
    activeTasks() {
      const archivedIds = this.archivedTasks.map(({ id }) => id);

      return this.tasks.filter(({ deleted_at, id }) => !deleted_at && !archivedIds.includes(id));
    }
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
