<template>
  <!-- eslint-disable -->
  <div class="row" v-if="tasks.length">
    <div class="col-sm-12">
      <button class="btn btn-primary mb-3" @click.stop.prevent="createNewTask()">&plus; Add task</button>
    </div>
    <div class="col-sm-12">
      <ul class="list-group">
        <Task :task="task" v-for="task in tasks" :key="task.id"/>
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
    ...mapGetters(['tasks'])
  },
  methods: {
    createNewTask() {
      this.$router.push({ name: 'CreateTask' });
    }
  }
};
</script>
