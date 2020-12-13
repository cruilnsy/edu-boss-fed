<template>
  <div class="course">
    课程管理
    <course-list />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CourseList from './components/CourseList.vue'

export default Vue.extend({
  name: 'CourseIndex',
  components: {
    CourseList
  }
})
</script>

<style lang="scss" scoped></style>
