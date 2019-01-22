<template>
  <!-- eslint-disable -->
  <div>
    <ProfileLink/>
    <div class="row mt-4">
      <div class="col-sm-12">
        <h4>{{ task.name }}</h4>
      </div>
      <div class="col-sm-12 mt-3">
        <h6>Current streak: 0</h6>
        <h6>Longest streak: 0</h6>
      </div>
      <div class="col-sm-12">
        <Vuecal
          class="vuecal--rounded-theme"
          hide-view-selector
          :time="false"
          default-view="month"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Vuecal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import ProfileLink from '@/components/ProfileLink';

export default {
  name: 'TaskReport',
  components: {
    Vuecal,
    ProfileLink
  },
  computed: {
    ...mapGetters(['tasks']),
    task() {
      const { params: { id } } = this.$route;
      return this.tasks.find(t => t.id === new Number(id).valueOf());
    }
  }
};
</script>
