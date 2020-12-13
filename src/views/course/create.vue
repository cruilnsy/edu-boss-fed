<template>
  <div class="course-create">
    <create-or-update-course />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrUpdateCourse from './components/CreateOrUpdate.vue'

export default Vue.extend({
  name: 'CourseCreate',
  components: {
    CreateOrUpdateCourse
  }
})
</script>

<style lang="scss" scoped>
</style>
