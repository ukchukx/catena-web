<template>
  <!-- eslint-disable -->
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-body">
            <ul v-if="tasks.length" class="list-group">
              <li class="list-group-item mt-1 mb-1" v-for="task in tasks" :key="task.id">
                <div class="row">
                  <div class="col-9">
                    <h5>{{ task.name }}</h5>
                  </div>
                  <div class="col-3 text-right">
                    <button class="btn btn-sm btn-info">Stuff</button>
                  </div>
                </div>
              </li>
            </ul>
            <empty-task-view v-else/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EmptyTaskView from '@/components/EmptyTaskView';

export default {
  name: 'Tasks',
  components: {
    EmptyTaskView
  },
  computed: {
    ...mapGetters(['tasks'])
  }
};
</script>
