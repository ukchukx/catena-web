<template>
  <!-- eslint-disable -->
  <Page>
    <HabitListLink/>
    <div class="row mt-4">
      <div class="col-sm-12 col-md-6 mx-auto">
        <b-form @submit.stop.prevent="onSubmit()">
          <div class="row mb-3">
            <div class="col-md-10 col-sm-12">
              <inline-input 
                v-model="form.title" 
                placeholder="Add title..." 
                input-classes="display-4 w-100"
                label-classes="display-4" />
            </div>
          </div>
          
          <b-form-group>
            <b-form-checkbox v-model="isPrivate">Private</b-form-checkbox>
            <small v-show="isPrivate">No one else can see your habit report</small>
            <small v-show="!isPrivate">Anyone with the link you share can see your habit report</small>
          </b-form-group>

          <b-form-group>
            <button class="btn btn-sm btn-outline-secondary" @click.stop.prevent="toggleScheduleForm()">
              <i v-if="showScheduleForm" class="fa fa-chevron-up"></i>
              <i v-else class="fa fa-chevron-down"></i>
              &nbsp;
              {{ showScheduleFormLabel }}
            </button>
          </b-form-group>

          <HabitSchedule 
            v-show="showScheduleForm" 
            :start-date="startDate"
            @start-date-changed="updateStartDate"
            @rrule-changed="updateRrule" />

          <b-button :disabled="!formOk" type="submit" variant="primary">Save</b-button>
        </b-form>
      </div>
    </div>
  </Page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import InlineInput from 'vue-inline-input';
import Flash from '@/mixins/Flash';
import Page from '@/components/Page';
import HabitSchedule from '@/components/HabitSchedule';
import HabitListLink from '@/components/HabitListLink';

export default {
  name: 'UpdateHabit',
  components: { HabitListLink, Page, InlineInput, HabitSchedule },
  mixins: [Flash],
  data() {
    const startDate = new Date();
    startDate.setHours(1, 0, 0);

    return {
      busy: false,
      isPrivate: true,
      showScheduleForm: false,
      initialSchedule: {},
      initialHabit: {},
      startDate,
      form: {
        title: '',
        visibility: 'private',
        start_date: new Date(startDate).toISOString(),
        repeats: 'FREQ=DAILY;INTERVAL=1'
      }
    };
  },
  computed: {
    ...mapGetters(['user', 'habits']),
    showScheduleFormLabel() {
      return this.showScheduleForm ? 'Hide schedule' : 'Modify schedule';
    },
    habit() {
      const { params: { id } } = this.$route;
      return this.habits.find(h => h.id === id);
    },
    formOk() {
      return this.form.title.length >= 3;
    },
    habitChanged() {
      const { form, initialHabit: { title, visibility } } = this;

      return form.title !== title || form.visibility !== visibility;
    },
    scheduleChanged() {
      const { form, initialSchedule: { repeats, start_date } } = this;

      return form.repeats !== repeats || form.start_date !== start_date;
    }
  },
  watch: {
    isPrivate(val) {
      this.form.visibility = val ? 'private' : 'public';
    }
  },
  created() {
    this.form.id = this.habit.id;
    this.form.title = this.habit.title;
    this.form.visibility = this.habit.visibility;
    this.isPrivate = this.form.visibility === 'private';
    this.recordScheduleState();
    this.recordHabitState();
  },
  methods: {
    ...mapActions(['updateHabit', 'updateSchedule']),
    toggleScheduleForm() {
      this.showScheduleForm = !this.showScheduleForm;
    },
    updateStartDate(date) {
      this.form.start_date = date;
    },
    updateRrule(rrule) {
      this.form.repeats = rrule;
    },
    recordScheduleState() {
      this.initialSchedule = { repeats: this.form.repeats, start_date: this.form.start_date };
    },
    recordHabitState() {
      this.initialHabit = { title: this.habit.title, visibility: this.habit.visibility };
    },
    onSubmit() {
      if (this.busy) {
        this.showFlash('Busy...', 'info');
        return;
      }

      if (!this.habitChanged && !this.scheduleChanged) return;
      
      this.busy = true;
      const promises = [];

      if (this.habitChanged) promises.push(this.updateHabit(this.form));
      if (this.scheduleChanged) promises.push(this.updateSchedule(this.form));

      Promise.all(promises)
        .then((results) => {
          this.busy = false;
          
          if (results.length) {
            this.recordScheduleState();
            this.recordHabitState();
            this.showFlash('Habit updated', 'success');
          } else {
            this.showFlash('Habit not updated', 'warning');
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
