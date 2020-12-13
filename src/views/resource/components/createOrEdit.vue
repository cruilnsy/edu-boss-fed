<template>
  <div class="resource-create-or-edit">
    <el-button @click="openAddResourceDialog">添加</el-button>
    <el-button @click="$router.push({ name: 'resource-category' })">资源分类</el-button>
    <el-dialog title="添加资源" :visible.sync="dialogFormAddResource">
      <el-form :model="formAddResource">
        <el-form-item label="资源名称:" :label-width="formLabelWidth">
          <el-input v-model="formAddResource.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源路径:" :label-width="formLabelWidth">
          <el-input v-model="formAddResource.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源分类:" :label-width="formLabelWidth">
          <el-select v-model="formAddResource.categoryId" placeholder="请选择资源">
            <el-option :value="-1" label="无资源"></el-option>
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称:" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="formAddResource.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAddResource = false">取 消</el-button>
        <el-button type="primary" @click="addResource">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createOrUpdateResource } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'

export default Vue.extend({
  name: 'ResourceCreateOrEdit',
  data () {
    return {
      isEdit: false,
      item: {},
      dialogFormAddResource: false,
      dialogResourceCategory: false,
      formAddResource: {
        name: '',
        url: '',
        categoryId: -1,
        description: ''
      },
      categoryList: [],
      formLabelWidth: '100px'
    }
  },
  created () {
    console.log('createorupdate component: ', this.isEdit, this.item)
  },
  methods: {
    async openAddResourceDialog () {
      this.dialogFormAddResource = true
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.categoryList = data.data
      }
    },
    async addResource () {
      const { data } = await createOrUpdateResource(this.formAddResource)
      if (data.code === '000000') {
        this.$message.success('提交成功')
      }
      this.dialogFormAddResource = false
    }
  }
})
</script>

<style lang="scss" scoped>
.el-form-item {
  .el-select {
    width: 100%
  }
}
</style>
