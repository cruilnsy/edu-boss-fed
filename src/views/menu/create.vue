<template>
  <div class="menu-create">
    <create-or-edit />
  </div>
</template>

<script>
import Vue from 'vue'
import CreateOrEdit from './component/createOrEdit.vue'

export default Vue.extend({
  name: 'MenuCreate',
  components: {
    CreateOrEdit
  },
  data () {
    return {}
  }
})
</script>

<style lang="scss" scoped></style>
