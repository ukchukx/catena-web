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
          <b-form-group label="Description">
            <b-form-textarea
              :rows="3"
              v-model="form.description"
              placeholder="Task description (optional)"
            ></b-form-textarea>
          </b-form-group>
          <b-form-group>
            <button class="btn btn-sm btn-outline-secondary" @click.stop.prevent="toggleScheduleForm()">
              <i v-if="showScheduleForm" class="fa fa-chevron-up"></i>
              <i v-else class="fa fa-chevron-down"></i>
              &nbsp;
              {{ showScheduleFormLabel }}
            </button>
          </b-form-group>
          <div v-if="showScheduleForm">
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
            <!-- 
            <b-form-group label="Start time - end time">
              <div class="row">
                <div class="col">
                  <flat-pickr :config="startTimeConfig" v-model="startTime" class="form-control" />
                </div>
                <div class="col">
                  <flat-pickr :config="endTimeConfig" v-model="endTime" class="form-control" />
                </div>
              </div>
            </b-form-group> 
            -->
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
          </div>

          <b-button :disabled="!formOk" type="submit" variant="primary">Save</b-button>
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
  name: 'UpdateTask',
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
      showScheduleForm: false,
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
    showScheduleFormLabel() {
      return this.showScheduleForm ? 'Hide schedules' : 'Modify schedules';
    },
    task() {
      const { params: { id } } = this.$route;
      return this.tasks.find(t => t.id === new Number(id).valueOf());
    },
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
  created() {
    this.form.id = this.task.id;
    this.form.name = this.task.name;
    this.form.description = this.task.description;
    this.form.visibility = this.task.visibility;
  },
  methods: {
    ...mapActions(['updateTask']),
    toggleScheduleForm() {
      this.showScheduleForm = !this.showScheduleForm;
    },
    onSubmit() {
      if (this.busy) {
        this.showFlash('Busy...', 'info', { timeout: 1000 });
        return;
      }

      if (this.showScheduleForm) {
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
      }

      this.busy = true;

      const data = { ...this.form };
      data.name = data.name.trim();
      data.description = data.description.trim();
      data.description = data.description.trim();
      if (!data.schedules.length) delete data.schedules;

      this.updateTask(data)
        .then((success) => {
          this.busy = false;
          if (success) {
            this.showFlash('Task updated', 'success');
          } else {
            this.showFlash('Task not updated', 'warning');
          }
        })
        .catch(({ message }) => {
          this.busy = false;
          this.showFlash(message, 'warning');
        });
    }
  }
};
</script>
