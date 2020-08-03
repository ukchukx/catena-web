<template>
  <!-- eslint-disable -->
  <Page>
    <div class="row">
      <div v-if="hasDueTasks" class="col-sm-12">
        <ul class="list-group list-group-flush mt-3 mx-2">
          <DueTask :now="now" :task="task" v-for="task in dueTasks" :key="task.id"/>
        </ul>
      </div>
      <div v-else class="col-sm-12 mt-5 mb-5">
        <div class="text-center">
          <h3>Kudos</h3>
          <h6>Nothing to do today</h6>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DueTask from '@/components/DueTask';
import Page from '@/components/Page';
import Flash from '@/mixins/Flash';

export default {
  name: 'DueTasks',
  components: {
    DueTask,
    Page
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
            this.now <= new Date(`${date} ${to}`).getTime();
        })
      );
    },
    hasDueTasks() {
      return !!this.dueTasks.length;
    }
  },
  mounted() {
    this.fetchTasks();
    setTimeout(this.updateNow, 300000);
  },
  methods: {
    ...mapActions(['fetchTasks']),
    updateNow() {
      this.now = Date.now();
      setTimeout(this.updateNow, 300000);
    }
  }
};
</script>
