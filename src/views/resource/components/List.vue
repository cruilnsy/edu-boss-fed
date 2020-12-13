<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="form" :model="form" class="form-search">
          <el-form-item
            prop="name"
            label="资源名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item
            prop="url"
            label="资源路径">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item
            prop="categoryId"
            label="资源分类">
            <el-select
              v-model="form.categoryId"
              placeholder="请选择活动区域"
              clearable>
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              :disabled="isLoading"
            >查询搜索</el-button>
            <el-button
              @click="onReset"
              :disabled="isLoading"
            >重置</el-button>
          </el-form-item>
        </el-form>
        <resource-create-or-edit :is-edit="isEdit" :item="editItem" />
      </div>
      <el-table
        :data="resources"
        v-loading="isLoading"
        style="width: 100%; margin-bottom: 20px">
        <el-table-column
          label="编号"
          type="index"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源路径"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间"
          width="150">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[5, 10, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import ResourceCreateOrEdit from './createOrEdit.vue'
import { getResourcePages } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      resources: [],
      categories: [],
      form: {
        name: '',
        url: '',
        categoryId: null,
        current: 1,
        size: 5
      },
      totalCount: 0,
      isLoading: true,
      isEdit: false,
      editItem: {}
    }
  },
  created () {
    this.loadResourcePages()
    this.loadResourceCategories()
  },
  components: {
    ResourceCreateOrEdit
  },
  methods: {
    async loadResourcePages () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
      }
      this.isLoading = false
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.categories = data.data
      }
    },
    onSubmit () {
      this.form.current = 1
      this.loadResourcePages()
    },
    onReset () {
      (this.$refs['form'] as Form).resetFields()
      this.form.current = 1
      this.loadResourcePages()
    },
    handleEdit (item: any) {
      console.log('edit', item)
      this.isEdit = true
      this.editItem = item
    },
    handleDelete (item: any) {
      console.log('delete', item)
    },
    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1
      this.loadResourcePages()
    },
    handleCurrentChange (val: number) {
      this.form.current = val
      this.loadResourcePages()
    }
  }
})
</script>

<style lang="scss" scoped></style>
