<template>
  <!-- eslint-disable -->
  <div>
    <ProfileLink/>
    <div class="row mt-4">
      <div class="col-sm-12 col-md-6 mx-auto">
        <b-form @submit.stop.prevent="onSubmit()">
          <b-form-group label="Title">
            <b-form-input type="text" v-model="form.name" required placeholder="Schedule title..."></b-form-input>
          </b-form-group>
          <b-form-group>
            <b-form-checkbox v-model="isPrivate">Private</b-form-checkbox>
            <small v-if="isPrivate">No one else can see your task report</small>
            <small v-else>Anyone with the link you share can see your task report</small>
          </b-form-group>
          <!-- <b-form-group label="Description">
            <b-form-textarea
              :rows="3"
              v-model="form.description"
              placeholder="Task description (optional)"
            ></b-form-textarea>
          </b-form-group> -->
          <b-form-group>
            <b-form-radio-group v-model="selectedMode" :options="typeOptions"/>
          </b-form-group>
          <b-form-group v-if="isDaily" label="Choose days">
            <b-form-checkbox-group stacked v-model="selectedDays" :options="dayOptions"/>
          </b-form-group>
          <b-form-group v-if="isCustom" label="Choose dates">
            <v-date-picker
              mode="multiple"
              is-inline
              :show-day-popover="false"
              is-expanded
              :min-date="new Date()"
              :max-date="endOfYear"
              v-model="customDates"
            />
          </b-form-group>
          <!-- <b-form-group label="Start time - end time">
            <div class="row">
              <div class="col">
                <flat-pickr :config="startTimeConfig" v-model="startTime" class="form-control" />
              </div>
              <div class="col">
                <flat-pickr :config="endTimeConfig" v-model="endTime" class="form-control" />
              </div>
            </div>
          </b-form-group> -->
          <b-form-group label="Start date - end date">
            <p class="text-muted">
              <i>{{ dateRange.start | date('Do MMMM, YYYY') }} to {{ dateRange.end | date('Do MMMM, YYYY') }}</i>
            </p>
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
import flatPickr from 'vue-flatpickr-component';
import Flash from '@/mixins/Flash';
import Filters from '@/mixins/Filters';
import ProfileLink from '@/components/ProfileLink';
import dateGenerator from '@/utils/dateGenerator';

export default {
  name: 'CreateTask',
  components: {
    ProfileLink,
    flatPickr
  },
  mixins: [Flash, Filters],
  data() {
    const endDate = new Date();
    endDate.setMonth(11);
    endDate.setDate(31);
    const endOfYear = new Date(endDate);

    return {
      busy: false,
      isPrivate: true,
      form: {
        name: '',
        description: '',
        visibility: 'private',
        schedules: []
      },
      endOfYear,
      dateRange: {
        start: new Date(),
        end: endDate
      },
      selectedMode: 'daily',
      typeOptions: [
        { text: 'Daily', value: 'daily' },
        { text: 'Custom', value: 'custom' }
      ],
      customDates: [],
      selectedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      dayOptions: [
        { text: 'Monday', value: 'Mon' },
        { text: 'Tuesday', value: 'Tue' },
        { text: 'Wednesday', value: 'Wed' },
        { text: 'Thursday', value: 'Thu' },
        { text: 'Friday', value: 'Fri' },
        { text: 'Saturday', value: 'Sat' },
        { text: 'Sunday', value: 'Sun' }
      ],
      startTimeConfig: {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        minDate: '00:00',
        maxDate: '23:59',
        time_24hr: true
      },
      endTimeConfig: {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i',
        minDate: '00:00',
        maxDate: '23:59',
        time_24hr: true
      },
      startTime: '00:00',
      endTime: '23:59'
    };
  },
  computed: {
    ...mapGetters(['user', 'tasks']),
    isDaily() {
      return this.selectedMode === 'daily';
    },
    isCustom() {
      return this.selectedMode === 'custom';
    },
    formOk() {
      const { isDaily, form: { name }, selectedDays, customDates, dateRange: { end } } = this;

      return name.length >= 3 && !!end && (isDaily ? !!selectedDays.length : !!customDates.length);
    }
  },
  watch: {
    startTime(_) {
      this.endTimeConfig.minDate = this.startTime;
    },
    endTime(_) {
      this.startTimeConfig.maxDate = this.endTime;
    },
    isPrivate(val) {
      this.form.visibility = val ? 'private' : 'public';
    }
  },
  methods: {
    ...mapActions(['createTask']),
    onSubmit() {
      if (this.busy) {
        this.showFlash('Busy...', 'info', { timeout: 1000 });
        return;
      }

      if (this.isDaily) {
        this.form.schedules = [...dateGenerator(Object.assign({ selectedDays: this.selectedDays }, this.dateRange))]
          .map(date => ({ due_date: date.toISOString(), from: this.startTime, to: this.endTime }));
      } else {
        this.form.schedules = this.customDates
          .map((date) => {
            date.setUTCHours(12, 0, 0, 0);
            date.setDate(date.getDate() + 1); // Datepicker returns previous day
            return { due_date: date.toISOString(), from: this.startTime, to: this.endTime };
          });
      }

      if (!this.form.schedules.length) {
        this.showFlash('No schedules can be created from your selection', 'warning');
        return;
      }

      this.busy = true;

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
