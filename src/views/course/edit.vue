<template>
  <div class="course-create">
    <create-or-update-course is-edit :course-id="courseId" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrUpdateCourse from './components/CreateOrUpdate.vue'

export default Vue.extend({
  name: 'CourseEdit',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }

  },
  components: {
    CreateOrUpdateCourse
  }
})
</script>

<style lang="scss" scoped>
</style>
