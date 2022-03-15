<template>
  <div>
    <!-- action必写，上传地址 file-list上传文件的列表[{name: url:}..] -->
    <!-- http-request自定义上传 -->
    <el-upload
      list-type="picture-card"
      action="#"
      :on-preview="preview"
      :limit="1"
      :file-list="fileList"
      :class="{ disabled: fileLength }"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <!-- 如图片数量为1，添加disaled类名 -->
      <i class="el-icon-plus"></i>
    </el-upload>
    <!-- 进度条 -->
    <el-progress
      v-if="showProgress"
      style="width: 180px"
      :percentage="percent"
    ></el-progress>
    <!-- 监听弹层关闭 -->
    <el-dialog :visible.sync="showDialog">
      <img :src="imgUrl" alt="图片" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5";
// 通过密钥实例化对象
var cos = new COS({
  SecretId: "AKIDLUMxIM9futb6LJ1RaT5PSDiwsY0D9oDL",
  SecretKey: "sTnqc6JFuJSLyKOGrBzby6yax4wYw4wY",
});
export default {
  data() {
    return {
      fileList: [], //上传文件列表
      imgUrl: "", //图片地址
      showDialog: false,
      currentFileUid: "", //当前上传文件的id
      percent: 0, //上传进度百分比
      showProgress: false, //是否显示进度条
    };
  },
  methods: {
    // 预览图片
    preview(file) {
      // 取到图片地址
      this.imgUrl = file.url;
      // 打开弹层
      this.showDialog = true;
    },
    // 文件列表中移除文件时调用
    handleRemove(file, fileList) {
      //1.点删除的文件 2.文件列表
      this.fileList = fileList; //同步最新的文件列表
    },
    // 文件状态改变时调用，会执行多次(添加、上传成功/失败)
    changeFile(file, fileList) {
      //1.上传的文件 2.文件列表
      // 将文件列表的数据保存(对象)
      this.fileList = fileList.map((item) => item);
    },
    // 上传文件前调用
    beforeUpload(file) {
      //上传的文件
      console.log(file);
      // 文件上传类型
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      // 如上传文件的类型不是types中的终止上传
      if (!types.includes(file.type)) {
        this.$message.error("上传图片只能是 JPG、GIF、BMP、PNG 格式");
        // 终止上传
        return false;
      }
      // 检查图片大小，单位：kb
      const maxSize = 10 * 1024 * 1024;
      // 如上传的文件大小超过5M终止上传
      if (file.size > maxSize) {
        this.$message.error("图片大小最大不能超过5M");
        return false;
      }
      this.showProgress = true; //上传前显示进度条
      // 保存当前上传文件id
      this.currentFileUid = file.uid;
      return true; //一定return true继续上传
    },
    // 上传文件
    upload(params) {
      // console.log(params);
      // 如有上传文件,进行上传操作
      if (params.file) {
        cos.putObject(
          {
            Bucket: "summer-1309985653" /* 存储桶名字必须 */,
            Region: "ap-nanjing" /* 存储桶所在地域，必须字段 */,
            Key: params.file.name /* 必须,文件名 */,
            StorageClass: "STANDARD", //上传模式
            Body: params.file, // 要上传的文件对象
            onProgress: (params) => {
              //上传过程
              this.percent = params.percent * 100; //上传进度百分比(小数)
            },
          },
          (error, data) => {
            //上传后执行回调,如果上传成功
            if (!error && data.statusCode === 200) {
              // 这里的this要指向data，上面的函数要改成箭头函数
              this.fileList = this.fileList.map((item) => {
                // console.log(data);
                // 文件列表中找出上传成功的文件
                if (item.uid === this.currentFileUid) {
                  // 将上传成功的url回写(fileList)，视图才会变化
                  return { url: "http://" + data.Location, upload: true }; //upload为true表示图片已上传完(在设置url后执行已上传成功)
                }
                return item; //返回上传的文件对象
              });
              this.showProgress = false; //隐藏进度条
              this.percent = 0; //进度归零
            }
          }
        );
      }
    },
  },
  computed: {
    // 上传图片数为1
    fileLength() {
      return this.fileList.length === 1;
    },
  },
};
</script>

<style>
/* 隐藏上传按钮 */
.disabled .el-upload--picture-card {
  display: none;
}
</style>
