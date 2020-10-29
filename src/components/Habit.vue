<template>
  <!-- eslint-disable -->
  <li class="list-group-item">
    <div class="row">
      <div class="col-sm-12">
        <h5>
          <router-link :to="habitRoute" class="text-truncate text-muted lead">{{ habit.title }}</router-link>
        </h5>
      </div>
      <div class="col-sm-12 text-right">
        <div class="btn-group">
          <button v-if="!isPrivate" class="btn btn-sm btn-outline-secondary" @click.stop.prevent="copyToClipboard()">
            Copy link
          </button>
          <button class="btn btn-sm btn-outline-secondary" @click.stop.prevent="editForm()">
            <i class="fas fa-pen"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" @click.stop.prevent="doArchive()">
            <i class="fas fa-archive"></i>
          </button>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Flash from '@/mixins/Flash';

export default {
  name: 'Habit',
  mixins: [Flash],
  props: {
    habit: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      isPrivate: this.habit.visibility === 'private',
      busy: false
    };
  },
  computed: {
    ...mapGetters(['habits']),
    habitRoute() {
      return { name: 'HabitReport', params: { id: this.habit.id } };
    }
  },
  mounted() {
    if (this.todaySchedule && this.todaySchedule) this.form.id = this.todaySchedule.id;
  },
  methods: {
    ...mapActions(['archiveHabit', 'updateHabit', 'markHabitAsDone']),
    editForm() {
      this.$router.push({ name: 'UpdateHabit', params: { id: this.habit.id } });
    },
    resolveUrl() {
      const href = this.$router.resolve({ ...this.habitRoute, name: 'PublicHabitReport' }).href;
      return `${window.location.origin}/${href}`;
    },
    copyToClipboard() {
      const textArea = document.createElement('textarea');
      //
      // *** This styling is an extra step which is likely not required. ***
      //
      // Why is it here? To ensure:
      // 1. the element is able to have focus and selection.
      // 2. if element was to flash render it has minimal visual impact.
      // 3. less flakyness with selection and copying which **might** occur if
      //    the textarea element is not visible.
      //
      // The likelihood is the element won't even render, not even a
      // flash, so some of these are just precautions. However in
      // Internet Explorer the element is visible whilst the popup
      // box asking the user for permission for the web page to
      // copy to the clipboard.
      //
      // Place in top-left corner of screen regardless of scroll position.
      textArea.style.position = 'fixed';
      textArea.style.top = 0;
      textArea.style.left = 0;
      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      // We don't need padding, reducing the size if it does flash render.
      textArea.style.padding = 0;
      // Clean up any borders.
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      // Avoid flash of white box if rendered for any reason.
      textArea.style.background = 'transparent';
      textArea.value = this.resolveUrl();
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        if (document.execCommand('copy')) this.showFlash('Link copied to clipboard', 'info');
      } catch (err) {
        this.showFlash('Could not copy link to clipboard', 'error');
      }
      document.body.removeChild(textArea);
    },
    doArchive() {
      if (this.busy) return;
      this.busy = true;
      this.archiveHabit(this.habit)
        .then(({ success }) => {
          if (!success) {
            this.showFlash('Failed to archive habit', 'warning');
          } else {
            this.showFlash('Habit archived', 'info');
          }
        })
        .catch(({ message }) => {
          this.showFlash(message, 'warning');
        })
        .finally(() => {
          this.busy = false;
        });
    }
  }
};
</script>
