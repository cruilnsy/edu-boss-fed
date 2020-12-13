<template>
  <div class="menu-edit">
    <create-or-edit :is-edit="true"></create-or-edit>
  </div>
</template>

<script>
import Vue from 'vue'
import CreateOrEdit from './component/createOrEdit.vue'

export default Vue.extend({
  name: 'MenuEdit',
  components: {
    CreateOrEdit
  },
  data () {
    return {}
  }
})
</script>

<style lang="scss" scoped></style>
