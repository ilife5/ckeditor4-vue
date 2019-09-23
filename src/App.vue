<template>
    <div id="app" style="text-align: left">
        <h2>inline</h2>
        <PyEditor type="inline"
                  :config="config"
                  :uploaderConfig="uploaderConfig"
                  v-model="text"/>

        <h3>上面文本框输入的内容</h3>
        <div>{{text}}</div>
        <h3>html</h3>
        <div v-html="text"></div>
        <h3>markdown</h3>
        <div>
        <pre>
            <code>
{{toMd()}}
            </code>
        </pre>
        </div>

        <h2>replace</h2>
        <PyEditor type="replace"/>

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

        <h2>checklist</h2>

        <ul style="list-style: none; text-align: left">
            <li><label>ckeditor 源码fork及打包流程串通 <input type="checkbox" checked></label></li>
            <li><label>集成jmeditor <input type="checkbox" checked></label></li>
            <li><label>ckeditor-vue 组件编写 <input type="checkbox" checked></label></li>
            <li><label>格式归一化 <input type="checkbox"></label>
                <ul style="list-style: none; text-align: left">
                    <li><label>无格式化粘贴支持 <input type="checkbox" checked></label></li>
                    <li><label>粘贴之后取消样式 <input type="checkbox" checked></label></li>
                    <li><label>公式抽取 <input type="checkbox"></label></li>
                    <li><label>公式使用占位符 <input type="checkbox" checked></label></li>
                    <li><label>图片占位符<input type="checkbox" checked></label></li>
                    <li><label>行内特殊符号占位符（准确率需要迭代优化）<input type="checkbox"></label></li>
                    <li><label>支持自定义样式（语文下面的点）<input type="checkbox"></label></li>
                </ul>
            </li>
            <li><label>单个图片上传（需要接口支持）<input type="checkbox" checked></label></li>
            <li><label>多图上传，通过拖拽<input type="checkbox" checked></label></li>
            <li><label>图文混排<input type="checkbox" checked></label></li>
            <li><label>图片处理：拖拽，大小更改<input type="checkbox" checked></label></li>
            <li><label>集成测试<input type="checkbox"></label></li>
            <li><label>编辑器默认高度<input type="checkbox" checked></label></li>
            <li><label>插入图片不同步问题<input type="checkbox" checked></label></li>
            <li><label>公式编辑 <input type="checkbox"></label>
                <ul style="list-style: none; text-align: left">
                    <li><label>选中公式可继续编辑 <input type="checkbox"></label></li>
                    <li><label>公式编辑器可以先输入文字，然后选择公式 <input type="checkbox"></label></li>
                    <li><label>第二次编辑时清空前一个公式<input type="checkbox" checked></label></li>
                </ul>
            </li>
        </ul>
    </div>

</template>

<script>
    import './assets/style.css';
    import PyEditor from './components/PyEditor';
    import {toMarkdown} from './portal';
    import './assets/mathquill/mathquill.css';


    export default {
        name: 'app',
        components: {
            PyEditor
        },
        data: function () {

            let text = '%W%%E%_**<sub>微</sub>~~软~~<sup>雅</sup>~~黑   ![](http://static.xiao5market.com//test/6a941ba1-a695-11e9-91bf-f34b97ae33bd-1.png?_ts=1568195574603)~~**_%E% %W%  ^ ![](http://static.xiao5market.com//test/7d041bf1-a695-11e9-91bf-f34b97ae33bd-image-20190715081418-1.png) \\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_ ​​​​​​​\n' + 'abc';

            text = '<p><span data-role="wave"><span data-role="emphasize"><em><strong><sub>微</sub><del>软</del><u><sup>雅</sup><del>黑&nbsp; &nbsp;<img src="http://static.xiao5market.com//test/6a941ba1-a695-11e9-91bf-f34b97ae33bd-1.png" alt="" width="82" height="23" /></del></u></strong></em></span>&nbsp;</span>&nbsp;&nbsp;^&nbsp;<span style="line-height:3;"><img src="http://static.xiao5market.com//test/7d041bf1-a695-11e9-91bf-f34b97ae33bd-image-20190715081418-1.png" alt="" /></span>&nbsp;__________________&nbsp;<span style="line-height:4;">​​​​​​​</span></p>\n' +
                '<p>abc</p>\n' +
                '<p><span class="mathquill-rendered-math" data-latex="7\\frac{3}{4}-1.125+\\left(2.25-6\\frac{7}{8}\\right)" style="font-size:20px"><span class="textarea"><textarea></textarea></span><span mathquill-command-id="4">7</span><span class="fraction non-leaf" mathquill-command-id="5"><span class="numerator" mathquill-block-id="6"><span mathquill-command-id="9">3</span></span><span class="denominator" mathquill-block-id="7"><span mathquill-command-id="10">4</span></span><span style="display:inline-block; width:0">&nbsp;</span></span><span class="binary-operator" mathquill-command-id="11">−</span><span mathquill-command-id="12">1</span><span mathquill-command-id="13">.</span><span mathquill-command-id="14">1</span><span mathquill-command-id="15">2</span><span mathquill-command-id="16">5</span><span class="binary-operator" mathquill-command-id="17">+</span><span class="non-leaf" mathquill-command-id="18"><span class="paren scaled" style="transform:scale(1.16, 1.89)">(</span><span class="non-leaf" mathquill-block-id="19"><span mathquill-command-id="20">2</span><span mathquill-command-id="21">.</span><span mathquill-command-id="22">2</span><span mathquill-command-id="23">5</span><span class="binary-operator" mathquill-command-id="24">−</span><span mathquill-command-id="26">6</span><span class="fraction non-leaf" mathquill-command-id="27"><span class="numerator" mathquill-block-id="28"><span mathquill-command-id="31">7</span></span><span class="denominator" mathquill-block-id="29"><span mathquill-command-id="32">8</span></span><span style="display:inline-block; width:0">&nbsp;</span></span></span><span class="paren scaled" style="transform:scale(1.16, 1.89)">)</span></span></span></p>\n' +
                '<table><tbody><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody></table>\n' +
                '<p><img src="http://static.xiao5market.com//test/16a03f81-b3a4-11e9-91bf-f34b97ae33bd-image-20190731230134-1.png" alt="" />左侧的图片通过公式编辑器添加  </p>\n' +
                '<p><img src="http://static.xiao5market.com//test/569562f1-b3a4-11e9-91bf-f34b97ae33bd-1024.png" alt="" width="104" height="104" style="float: right;" />​  </p>\n' +
                '<p>右侧的图片通过图片上传添加，样式为float</p>\n' +
                '<p><span style="line-height:2;">该行文字设置了行高</span></p>\n' +
                '<p><span style="line-height:1;">设置行高</span></p>\n' +
                '<p><span style="line-height:2;">嵌套设<span style="line-height:3;">置行</span>高</span></p>';

            //text = '';
            return {
                // 编辑器远程下载地址（将ckeditor_4.12.0_dev.zip解压到可访问目录）
                config: {
                    editorRemoteUrl: "./ckeditor/ckeditor.js",
                    //editorRemoteUrl: "http://localhost:63343/ckeditor-dev/ckeditor.js",
                    height: 400,
                  //  customerResponse: true,
                    notification_duration: 1000
                },
                uploaderConfig: {
                    // 上传链接
                    url: "/api/upload",
                    //url: "/task/uploadImg",
                    // 上传接口自定义参数
                    params: {
                        sessionId: "123"
                    },
                    // 上传图片的属性名
                    //key: "img",
                    key: "upload"
                    //format: 'base64'
                },
                text: text
            };
        },
        mounted: function () {
        },
        methods: {
            toMd() {
                return toMarkdown(this.text);
            }
        }
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

    /*设置textarea高度*/
    .cke_textarea_inline {
        min-height:100px;
    }
</style>
