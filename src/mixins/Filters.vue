<script>
import moment from 'moment-mini';

export default {
  name: 'Filters',
  filters: {
    date(val, formatStr = '') {
      return moment(val).format(formatStr);
    }
  }
};
</script>

