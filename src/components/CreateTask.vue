<template>
  <!-- eslint-disable -->
  <div>
    <ProfileLink/>
    <div class="row mt-4">
      <div class="col-sm-12 col-md-6 mx-auto">
        <b-form @submit.stop.prevent="onSubmit()">
          <b-form-group label="Name">
            <b-form-input type="text" v-model="form.name" required placeholder="Task name..."></b-form-input>
          </b-form-group>
          <b-form-group label="Description">
            <b-form-textarea
              :rows="3"
              v-model="form.description"
              placeholder="Task description (optional)"
            ></b-form-textarea>
          </b-form-group>
          <b-form-group>
            <b-form-radio-group v-model="selectedType" :options="typeOptions"/>
          </b-form-group>
          <b-form-group v-if="isDaily">
            <b-form-checkbox-group v-model="selectedDays" :options="dayOptions"/>
          </b-form-group>
          <b-form-group v-if="isMonthly" label="Choose day (1-28)">
            <b-form-input :min="1" :max="28" v-model.number="selectedDate" type="number"/>
          </b-form-group>
          <b-form-group label="Start date - end date">
            <p class="text-muted">{{ dateRange.start | date('Do MMMM, YYYY') }} to {{ dateRange.end | date('Do MMMM, YYYY') }}</p>
            <v-date-picker
              mode="range"
              is-inline
              :show-day-popover="false"
              is-expanded
              :min-date="new Date()"
              :max-date="endOfYear"
              v-model="dateRange"
            />
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
import Filters from '@/mixins/Filters';
import ProfileLink from '@/components/ProfileLink';
import dateGenerator from '@/utils/dateGenerator';

export default {
  name: 'CreateTask',
  components: {
    ProfileLink
  },
  mixins: [Flash, Filters],
  data() {
    const endDate = new Date();
    endDate.setMonth(11);
    endDate.setDate(31);
    const endOfYear = new Date(endDate);

    return {
      form: {
        name: '',
        description: '',
        schedules: []
      },
      endOfYear,
      dateRange: {
        start: new Date(),
        end: endDate
      },
      selectedType: 'daily',
      selectedDate: 1,
      typeOptions: [
        { text: 'Daily', value: 'daily' },
        { text: 'Monthly', value: 'monthly' }
      ],
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
    isDaily() {
      return this.selectedType === 'daily';
    },
    isMonthly() {
      return this.selectedType === 'monthly';
    },
    formOk() {
      const { isDaily, form: { name }, selectedDays, selectedDate, dateRange: { end } } = this;
      const basicCondition = name.length >= 3 && end !== null;

      return isDaily ? (!!selectedDays.length && basicCondition) :
        basicCondition && (selectedDate >= 1 && selectedDate <= 28);
    }
  },
  methods: {
    ...mapActions(['createTask']),
    onSubmit() {
      if (this.busy) {
        this.showFlash('Busy...', 'info', { timeout: 1000 });
        return;
      }

      this.busy = true;
      const selectedDays = this.isDaily ? [...this.selectedDays] : [];
      let schedules = [...dateGenerator(Object.assign({ selectedDays }, this.dateRange))];

      if (this.isMonthly) { // Filter out the unneeded dates
        schedules = schedules.filter(date => date.getDate() === this.selectedDate);
      }

      this.form.schedules = schedules.map(date => ({ due_date: date.toISOString() }));

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
            this.$router.push({ name: 'Tasks' });
            return;
          }
          this.showFlash(message, 'warning');
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showFlash(message, 'warning');
        });
    }
  }
};
</script>
