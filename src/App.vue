<template>
  <div id="app" style="text-align: left">
    <h1>PyEditor 示例</h1>

    <h2>使用方式</h2>

    <ul style="list-style: decimal;">
      <li>将ckeditor_4.12.0_dev.zip解压到可访问目录</li>
      <li>设置editorRemoteUrl参数为上一步的绝对/相对地址</li>
      <li>可在vue中引入PyEditor.vue，使用示例如下所示</li>
    </ul>

    <h2>图片上传</h2>

    <p>通过如下属性设置图片上传</p>
<pre><code>
uploaderConfig: {
  // 上传链接
  url: "/api/upload",
  // 上传接口自定义参数
  params: {
    sessionId: "123"
  },
  // 上传图片的属性名
  key: "upload"
}
</code></pre>

<p>服务端的返回格式需要做特殊处理</p>
<pre><code>
// 错误时请返回
{
    "uploaded": 0,
    "error": {
        "message": "The file is too big."
    }
}
</code></pre>

<pre><code>
// 正确时请返回
{
    "uploaded": 1,
    "fileName": "foo.jpg",
    "url": "/files/foo.jpg"
}
</code></pre>

    <h2>inline</h2>
    <PyEditor type="inline"
              :config="config"
              :uploaderConfig="uploaderConfig"
              v-model="text"/>

    <h2>上面文本框输入的内容</h2>
    <div>{{text}}</div>

    <h2>replace</h2>
    <PyEditor type="replace"/>

    <h2>checklist</h2>

    <ul style="list-style: none; text-align: left">
      <li><label>ckeditor 源码fork及打包流程串通 <input type="checkbox" checked></label></li>
      <li><label>集成jmeditor <input type="checkbox" checked></label></li>
      <li><label>ckeditor-vue 组件编写 <input type="checkbox" checked></label></li>
      <li><label>格式归一化  <input type="checkbox"></label>
        <ul style="list-style: none; text-align: left">
          <li><label>无格式化粘贴支持 <input type="checkbox" checked></label></li>
          <li><label>粘贴之后取消样式 <input type="checkbox" checked></label></li>
          <li><label>公式抽取 <input type="checkbox"></label></li>
          <li><label>需要doc文档进行测试 <input type="checkbox" checked></label></li>
        </ul>
      </li>
      <li><label>单个图片上传（需要接口支持）<input type="checkbox" checked></label></li>
      <li><label>word中的图片粘贴上传，可以参考顺成的浏览器插件对编辑器进行整合<input type="checkbox"></label></li>
      <li><label>图文混排<input type="checkbox" checked></label></li>
      <li><label>图片处理：拖拽，大小更改<input type="checkbox" checked></label></li>
      <li><label>集成测试<input type="checkbox"></label></li>
    </ul>
  </div>

</template>

<script>
import PyEditor from './components/PyEditor';

export default {
  name: 'app',
  components: {
    PyEditor
  },
  data: function() {
    return {
      // 编辑器远程下载地址（将ckeditor_4.12.0_dev.zip解压到可访问目录）
      config: {
        editorRemoteUrl: "https://www.xiao5market.com/resources/ckeditor/ckeditor.js"
      },
      uploaderConfig: {
        // 上传链接
        url: "/api/upload",
        // 上传接口自定义参数
        params: {
          sessionId: "123"
        },
        // 上传图片的属性名
        key: "upload"
      },
      text: ``
    };
  },
  mounted: function() {}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
