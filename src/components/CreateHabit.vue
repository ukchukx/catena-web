<template>
  <!-- eslint-disable -->
  <Page>
    <HabitListLink />
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

          <HabitSchedule 
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
import flatPickr from 'vue-flatpickr-component';
import InlineInput from 'vue-inline-input';
import Flash from '@/mixins/Flash';
import AuthChecker from '@/mixins/AuthChecker';
import HabitListLink from '@/components/HabitListLink';
import Page from '@/components/Page';
import HabitSchedule from '@/components/HabitSchedule';

export default {
  name: 'CreateHabit',
  components: { HabitListLink, InlineInput, Page, flatPickr, HabitSchedule },
  mixins: [Flash, AuthChecker],
  data() {
    const startDate = new Date();
    startDate.setHours(1, 0, 0);

    return {
      busy: false,
      isPrivate: true,
      startDate,
      form: {
        title: '',
        visibility: 'private',
        start_date: startDate.toISOString(),
        repeats: 'FREQ=DAILY;INTERVAL=1'
      }
    };
  },
  computed: {
    ...mapGetters(['user', 'habits']),
    formOk() {
      return this.form.title.length >= 3;
    }
  },
  watch: {
    isPrivate(val) {
      this.form.visibility = val ? 'private' : 'public';
    }
  },
  methods: {
    ...mapActions(['createHabit']),
    updateStartDate(date) {
      this.form.start_date = date;
    },
    updateRrule(rrule) {
      this.form.repeats = rrule;
    },
    onSubmit() {
      if (this.busy) {
        this.showFlash('Busy...', 'info');
        return;
      }

      this.busy = true;

      this.createHabit(this.form)
        .then(({ success, message }) => {
          this.busy = false;
          if (success) {
            this.showFlash(message, 'success');
            this.$router.push({ name: 'Habits' });
            return;
          }
          this.showFlash(message, 'warning');
        })
        .catch((data) => {
          this.maybeLogout(data);

          this.busy = false;
          this.showFlash(data.message, 'warning');
        });
    }
  }
};
</script>
