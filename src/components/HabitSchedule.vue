<template>
  <!-- eslint-disable -->
  <div>
    <b-form-group>
      <div class="row">
        <div class="col-6">
          <flat-pickr :config="startDateConfig" v-model="form.startDate" class="form-control" />
        </div>
        <div class="col-6">
          <inline-input
            v-model="form.schedule"
            type="select"
            :options="scheduleOptions"
            input-classes="form-control"
            label-classes="lead" />
        </div>
      </div>
    </b-form-group>

    <b-form-group v-show="isCustom">
      <div class="row">
        <div class="col-4">Repeat every</div>
        <div class="col-3">
          <input v-model.number="form.every" type="number" class="form-control">
        </div>
        <div class="col-5">
          <div class="input-group">
            <div class="input-group-append">
              <inline-input
                v-model="form.which"
                type="select"
                :options="selectedModes"
                input-classes="form-control"
                label-classes="lead" />
            </div>
          </div>
        </div>
      </div>
    </b-form-group>

    <b-form-group v-show="isCustomWeekly">
      <div class="row">
        <div class="col-sm-12">Repeat on</div>
        <div class="col-sm-12">
          <b-form-checkbox-group v-model="form.selectedDays" :options="dayOptions" />
        </div>
      </div>
    </b-form-group>

    <b-form-group v-show="isCustomMonthly">
      <div class="row">
        <div class="col-sm-12 col-md-6">
          <inline-input
            v-model.number="form.selectedDay"
            type="select"
            :options="monthDays"
            input-classes="form-control"
            label-classes="lead" />
        </div>
      </div>
    </b-form-group>

    <b-form-group class="mt-3" label="Ends" v-show="!doesNotRepeat">
      <div class="row mb-2">
        <div class="col-12">
          <b-form-radio v-model="form.end" name="some-radios" value="never">Never</b-form-radio>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-3">
          <b-form-radio v-model="form.end" name="some-radios" value="on">On</b-form-radio>
        </div>
        <div class="col-6">
          <flat-pickr v-if="endsOnSelected" :config="startDateConfig" v-model="form.until" class="form-control" />
          <span class="text-muted" v-else>{{ form.until | date("Do MMMM, YYYY") }}</span>
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          <b-form-radio v-model="form.end" name="some-radios" value="after">After</b-form-radio>
        </div>
        <div class="col-6">
          <div class="input-group mb-3">
            <input :disabled="!endsAfterSelected" type="number" v-model.number="form.after" class="form-control">
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">occurrences</span>
            </div>
          </div>
        </div>
      </div>
    </b-form-group>
  </div>
</template>
<script>
import moment from 'moment-mini';
import InlineInput from 'vue-inline-input';
import flatPickr from 'vue-flatpickr-component';
import Filters from '@/mixins/Filters';
import { dateString, dayFullName } from '@/utils/dates';

export default {
  name: 'HabitSchedule',
  components: { flatPickr, InlineInput },
  mixins: [Filters],
  props: {
    startDate: {
      type: Date,
      required: true
    }
  },
  data() {
    const dayOptions = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayDay = dayOptions.find((day, index) => index === this.startDate.getDay());
    const todayDate = this.startDate.getDate();
    const todayFullDate = dateString(this.startDate);
    const todayMonth = this.startDate.getMonth() + 1;
    const dayOptionSortOrder = dayOptions
      .map((d, i) => ({ [d]: i }))
      .reduce((acc, map) => ({ ...acc, ...map }), {});

    return {
      startDateConfig: { minDate: 'today' },
      form: {
        schedule: 'daily',
        selectedDays: [todayDay],
        startDate: todayFullDate,
        every: 1,
        selectedDay: todayDate,
        until: todayFullDate,
        month: todayMonth,
        after: 12,
        which: 'Day',
        end: 'never'
      },
      endOptions: [
        { text: 'Never', value: 'never' },
        { text: 'On', value: 'on' },
        { text: 'After', value: 'after' }
      ],
      dayOptions,
      dayOptionSortOrder
    };
  },
  computed: {
    currentStartDate() {
      return new Date(this.form.startDate);
    },
    todayDay() {
      return this.dayOptions.find((day, index) => index === this.currentStartDate.getDay());
    },
    todayDate() {
      return this.currentStartDate.getDate();
    },
    todayMonth() {
      return this.currentStartDate.getMonth() + 1;
    },
    todayFullDate() {
      return dateString(this.currentStartDate);
    },
    scheduleOptions() {
      return [
        { label: "Doesn't repeat", value: 'norepeat' },
        { label: 'Repeats daily', value: 'daily' },
        { label: `Repeats weekly on ${dayFullName(this.todayDay).toLowerCase()}s`, value: 'weekly' },
        { label: `Repeats monthly on day ${this.todayDate}`, value: 'monthly' },
        { label: `Repeats yearly on ${moment(this.todayFullDate).format('Do MMMM')}`, value: 'yearly' },
        { label: 'Custom', value: 'custom' }
      ];
    },
    selectedModes() {
      if (this.form.every === 1) {
        return [
          { label: 'Day', value: 'Day' },
          { label: 'Week', value: 'Week' },
          { label: 'Month', value: 'Month' },
          { label: 'Year', value: 'Year' }
        ];
      }

      return [
        { label: 'Days', value: 'Day' },
        { label: 'Weeks', value: 'Week' },
        { label: 'Months', value: 'Month' },
        { label: 'Years', value: 'Year' }
      ];
    },
    monthDays() {
      const days = Array
        .from({ length: 31 }, (_, i) => i + 1)
        .map(value => ({ label: `Monthly on day ${value}`, value }));
      days.push({ label: 'Monthly on the last day', value: -1 });
      return days;
    },
    endsOnSelected() {
      return this.form.end === 'on';
    },
    endsAfterSelected() {
      return this.form.end === 'after';
    },
    doesNotRepeat() {
      return this.form.schedule === 'norepeat';
    },
    isDaily() {
      return this.form.schedule === 'daily';
    },
    isWeekly() {
      return this.form.schedule === 'weekly';
    },
    isMonthly() {
      return this.form.schedule === 'monthly';
    },
    isYearly() {
      return this.form.schedule === 'yearly';
    },
    isCustomDaily() {
      return this.isCustom && this.form.which === 'Day';
    },
    isCustomWeekly() {
      return this.isCustom && this.form.which === 'Week';
    },
    isCustomMonthly() {
      return this.isCustom && this.form.which === 'Month';
    },
    isCustomYearly() {
      return this.isCustom && this.form.which === 'Year';
    },
    isCustom() {
      return this.form.schedule === 'custom';
    },
    rrule() {
      if (this.doesNotRepeat) return null;

      const parts = [];

      if (this.isDaily || this.isCustomDaily) {
        parts.push('FREQ=DAILY');
        parts.push(`INTERVAL=${this.form.every}`);
      }

      if (this.isWeekly || this.isCustomWeekly) {
        parts.push('FREQ=WEEKLY');
        parts.push(`INTERVAL=${this.form.every}`);
        const days = [...this.form.selectedDays];
        days.sort((d1, d2) => this.dayOptionSortOrder[d1] - this.dayOptionSortOrder[d2]);
        parts.push(`BYDAY=${days.map(day => day.substring(0, 2).toUpperCase()).join(',')}`);
      }

      if (this.isMonthly || this.isCustomMonthly) {
        parts.push('FREQ=MONTHLY');
        parts.push(`INTERVAL=${this.form.every}`);
        parts.push(`BYMONTHDAY=${this.form.selectedDay}`);
      }

      if (this.isYearly || this.isCustomYearly) {
        parts.push('FREQ=YEARLY');
        parts.push(`INTERVAL=${this.form.every}`);
        parts.push(`BYMONTH=${this.form.month}`);
        parts.push(`BYMONTHDAY=${this.form.selectedDay}`);
      }

      if (this.endsAfterSelected) parts.push(`COUNT=${this.form.after}`);
      if (this.endsOnSelected) parts.push(`UNTIL=${new Date(this.form.until).toISOString()}`);

      return parts.join(';');
    }
  },
  watch: {
    isWeekly(selected) {
      if (!selected) return;
      this.form.every = 1;
      this.form.selectedDays = [this.todayDay];
    },
    isMonthly(selected) {
      if (!selected) return;
      this.form.every = 1;
      this.form.selectedDay = this.todayDate;
    },
    isYearly(selected) {
      if (!selected) return;
      this.form.every = 1;
      this.form.selectedDay = this.todayDate;
    },
    rrule(val) {
      this.$emit('rrule-changed', val);
    },
    'form.startDate'(val) {
      const date = new Date(val);
      date.setHours(1, 0, 0);
      this.$emit('start-date-changed', date.toISOString());
    }
  }
};
</script>
