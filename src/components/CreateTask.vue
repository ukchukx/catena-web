<template>
  <!-- eslint-disable -->
  <div>
    <div class="row">
      <div class="col-sm-6 col-md-2">
        <router-link :to="profilePath" class="btn btn-outline-secondary btn-sm btn-block text-left">
          <i class="fa fa-chevron-left"></i>
        </router-link>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-sm-12 col-md-6 mx-auto">
        <b-form @submit.stop.prevent="onSubmit()">
          <b-form-group label="Name">
            <b-form-input type="text" v-model="form.name" required placeholder="Name"></b-form-input>
          </b-form-group>
          <b-form-group label="Description">
            <b-form-textarea :rows="3" v-model="form.description" placeholder="Description"></b-form-textarea>
          </b-form-group>
          <b-form-group>
            <b-form-checkbox-group v-model="selectedDays" :options="dayOptions"/>
          </b-form-group>

          <b-button :disabled="!formOk" type="submit" variant="primary">Create</b-button>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Flash from '@/mixins/Flash';
import dateGenerator from '@/utils/dateGenerator';

export default {
  name: 'CreateTask',
  mixins: [Flash],
  data() {
    return {
      profilePath: { name: 'Tasks' },
      form: {
        name: 'Test',
        description: '',
        schedules: []
      },
      selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      dayOptions: [
        { text: 'Monday', value: 'Mon' },
        { text: 'Tuesday', value: 'Tue' },
        { text: 'Wednesday', value: 'Wed' },
        { text: 'Thursday', value: 'Thu' },
        { text: 'Friday', value: 'Fri' },
        { text: 'Saturday', value: 'Sat' },
        { text: 'Sunday', value: 'Sun' }
      ]
    };
  },
  computed: {
    ...mapGetters(['user', 'tasks']),
    formOk() {
      const { form: { name }, selectedDays } = this;
      return !!selectedDays.length &&
        name.length >= 3 &&
        this.tasks.every(t => name !== t.name);
    }
  },
  methods: {
    ...mapActions(['createTask']),
    onSubmit() {
      if (this.busy) return;
      this.busy = true;

      this.form.schedules = [...dateGenerator([...this.selectedDays])]
        .map(date => ({ due_date: date.toISOString() }));
      if (!this.form.schedules.length) {
        this.busy = false;
        this.showFlash('No schedules can be created from your selection', 'warning');
        return;
      }

      this.createTask(this.form)
        .then(({ success, message }) => {
          this.busy = false;
          if (success) {
            this.showFlash(message, 'success');
            this.$router.push(this.profilePath);
            return;
          }
          this.showFlash(message, 'warning');
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showFlash(message, 'warning');
        });
    },
    generateDates(p) {
      return dateGenerator(p);
    }
  }
};
</script>
