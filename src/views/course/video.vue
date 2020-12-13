<template>
  <div class="course-video">
    <el-card>
      <div slot="header">
        <span>课程：xxx</span><br>
        <span>阶段：xxx</span><br>
        <span>课时：xxx</span>
      </div>
      <el-form label-width="70px">
        <el-form-item label="视频上传">
          <input type="file" ref="video-file">
        </el-form-item>
        <el-form-item label="封面上传">
          <input type="file" ref="image-file">
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpload">开始上传</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
        <el-form-item>
          <p>视频上传中：{{ uploadPercent }}%</p>
          <p v-if="isUploadSuccess">视频转码中：{{ isTransCodeSuccess ? '完成' : '正在处理，请稍后'}}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  getAliyunImagUploadAddressAdnAuth,
  getAliyunVideoUploadAddressAdnAuth,
  aliyunTransCode,
  aliyunTransCodePercent
} from '../../services/aliyun-upload'

export default Vue.extend({
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      uploader: null,
      imageUrl: '',
      videoId: null,
      uploadPercent: 0,
      isUploadSuccess: false,
      isTransCodeSuccess: false
    }
  },
  computed: {
    video () {
      return this.$refs['video-file']
    },
    image () {
      return this.$refs['image-file']
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // 阿里账号ID，必须有值
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async (uploadInfo) => {
          console.log('onUploadstarted: ', uploadInfo)

          // 1. 通过我们的后端获取文件上传凭证
          let uploadAddressAndAuth
          if (uploadInfo.isImage) {
            const { data } = await getAliyunImagUploadAddressAdnAuth()
            uploadAddressAndAuth = data.data
            this.imageUrl = data.data.imageURL
          } else {
            const { data } = await getAliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageUrl
            })
            uploadAddressAndAuth = data.data
            this.videoId = uploadAddressAndAuth.videoId
          }
          // 2. 调用 uploader.setUploadAuthAndAddress 设置上传凭证
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
          // 3. 设置好上传凭证确认没有问题，上传进度开始
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
          console.log('onUploadSucceed: ', uploadInfo)
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          console.log('onUploadFailed: ', uploadInfo, code, message)
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          console.log('onUploadProgress: ', uploadInfo, totalSize, loadedPercent)
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
          console.log('onUploadTokenExpired: ', uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd: async (uploadInfo) => {
          this.isUploadSuccess = true
          console.log('onUploadEnd: ', uploadInfo)
          const { data } = await aliyunTransCode({
            sectionId: this.$route.query.sectionId,
            coverImageUrl: this.imageUrl,
            fileName: this.video.files[0].name,
            fileId: this.videoId
          })

          const timer = setInterval(async () => {
            const { data } = await aliyunTransCodePercent(this.$route.query.lessonId)
            if (data.data === 100) {
              this.isTransCodeSuccess = true
              window.clearInterval(timer)
              console.log('转码成功')
            }
          }, 3000)
        }
      })
    },
    handleUpload () {
      this.isUploadSuccess = false
      this.isTransCodeSuccess = false
      this.uploadPercent = 0

      // 获取上传文件
      const videoFile = this.video.files[0]
      const imageFile = this.image.files[0]
      const uploader = this.uploader

      // 将用户所选的文件添加到上传列表中
      // 一旦开始上传，它就会按照列表中添加的顺序开始上传
      uploader.addFile(imageFile, null, null, null, '{"Vod":{}}')
      uploader.addFile(videoFile, null, null, null, '{"Vod":{}}')

      // 开始上传，触发 onUploadStarted 事件
      uploader.startUpload()
    }
  }
})
</script>

<style lang="scss" scoped></style>
