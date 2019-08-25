<template>
    <div id="app" style="text-align: left">
        <h3>原始html</h3>
        <div v-html="html"></div>

        <h2>Editor</h2>
        <PyEditor type="inline"
                  :config="config"
                  :uploaderConfig="uploaderConfig"
                  format="md"
                  v-model="text"/>

        <h3>元数据</h3>
        <div>
        <pre>
            <code>
{{text}}
            </code>
        </pre>
        </div>

        <h3>元数据转为html</h3>
        <div :inner-html.prop="text | md2Html"></div>

        <h3>提交给后台的数据</h3>
        <div>
            <pre>
            <code>
{{toServer()}}
            </code>
        </pre>
        </div>

    </div>

</template>

<script>
    /**
     * 补充的样式，如波浪线，重点符号
     */
    import './assets/style.css';
    /**
     * 在题库的展示时需要引入ckeditor的样式
     */
    import './assets/ckeditor.css';
    /**
     * 老公式样式
     */
    import './assets/mathquill/mathquill.css';

    import PyEditor from './components/PyEditor';
    import {toMarkdown, toHtml, markdownToServer} from './portal';
    import './filter/md2Html';


    export default {
        name: 'app',
        components: {
            PyEditor
        },
        data: function () {

            let text = '%W%%E%_**<sub>微</sub>~~软~~<sup>雅</sup>~~黑   ![](http://static.xiao5market.com//test/6a941ba1-a695-11e9-91bf-f34b97ae33bd-1.png)~~**_%E% %W%  ^ ![](http://static.xiao5market.com//test/7d041bf1-a695-11e9-91bf-f34b97ae33bd-image-20190715081418-1.png) \\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_ ​​​​​​​\n' + 'abc';

            text = '<p><span data-role="wave"><span data-role="emphasize"><em><strong><sub>微</sub><del>软</del><u><sup>雅</sup><del>黑&nbsp; &nbsp;<img src="http://static.xiao5market.com//test/6a941ba1-a695-11e9-91bf-f34b97ae33bd-1.png" alt="" width="82" height="23" /></del></u></strong></em></span>&nbsp;</span>&nbsp;&nbsp;^&nbsp;<span style="line-height:3;"><img src="http://static.xiao5market.com//test/7d041bf1-a695-11e9-91bf-f34b97ae33bd-image-20190715081418-1.png" alt="" /></span>&nbsp;__________________&nbsp;<span style="line-height:4;">​​​​​​​</span></p>\n' +
                '<p>abc</p>\n' +
                '<p><span class="mathquill-rendered-math" data-latex="7\\frac{3}{4}-1.125+\\left(2.25-6\\frac{7}{8}\\right)" style="font-size:20px"><span class="textarea"><textarea></textarea></span><span mathquill-command-id="4">7</span><span class="fraction non-leaf" mathquill-command-id="5"><span class="numerator" mathquill-block-id="6"><span mathquill-command-id="9">3</span></span><span class="denominator" mathquill-block-id="7"><span mathquill-command-id="10">4</span></span><span style="display:inline-block; width:0">&nbsp;</span></span><span class="binary-operator" mathquill-command-id="11">−</span><span mathquill-command-id="12">1</span><span mathquill-command-id="13">.</span><span mathquill-command-id="14">1</span><span mathquill-command-id="15">2</span><span mathquill-command-id="16">5</span><span class="binary-operator" mathquill-command-id="17">+</span><span class="non-leaf" mathquill-command-id="18"><span class="paren scaled" style="transform:scale(1.16, 1.89)">(</span><span class="non-leaf" mathquill-block-id="19"><span mathquill-command-id="20">2</span><span mathquill-command-id="21">.</span><span mathquill-command-id="22">2</span><span mathquill-command-id="23">5</span><span class="binary-operator" mathquill-command-id="24">−</span><span mathquill-command-id="26">6</span><span class="fraction non-leaf" mathquill-command-id="27"><span class="numerator" mathquill-block-id="28"><span mathquill-command-id="31">7</span></span><span class="denominator" mathquill-block-id="29"><span mathquill-command-id="32">8</span></span><span style="display:inline-block; width:0">&nbsp;</span></span></span><span class="paren scaled" style="transform:scale(1.16, 1.89)">)</span></span></span></p>\n' +
                '<p><span class="mathquill-rendered-math" data-latex="7\\frac{3}{4}-1.125+\\left(2.25-6\\frac{7}{8}\\right)" style="font-size:20px"><span class="textarea"><textarea></textarea></span><span mathquill-command-id="4">7</span><span class="fraction non-leaf" mathquill-command-id="5"><span class="numerator" mathquill-block-id="6"><span mathquill-command-id="9">3</span></span><span class="denominator" mathquill-block-id="7"><span mathquill-command-id="10">4</span></span><span style="display:inline-block; width:0">&nbsp;</span></span><span class="binary-operator" mathquill-command-id="11">−</span><span mathquill-command-id="12">1</span><span mathquill-command-id="13">.</span><span mathquill-command-id="14">1</span><span mathquill-command-id="15">2</span><span mathquill-command-id="16">5</span><span class="binary-operator" mathquill-command-id="17">+</span><span class="non-leaf" mathquill-command-id="18"><span class="paren scaled" style="transform:scale(1.16, 1.89)">(</span><span class="non-leaf" mathquill-block-id="19"><span mathquill-command-id="20">2</span><span mathquill-command-id="21">.</span><span mathquill-command-id="22">2</span><span mathquill-command-id="23">5</span><span class="binary-operator" mathquill-command-id="24">−</span><span mathquill-command-id="26">6</span><span class="fraction non-leaf" mathquill-command-id="27"><span class="numerator" mathquill-block-id="28"><span mathquill-command-id="31">7</span></span><span class="denominator" mathquill-block-id="29"><span mathquill-command-id="32">8</span></span><span style="display:inline-block; width:0">&nbsp;</span></span></span><span class="paren scaled" style="transform:scale(1.16, 1.89)">)</span></span></span></p>\n' +
                '<p><span class="mathquill-rendered-math" data-latex="7\\frac{3}{4}-1.125+\\left(2.25-6\\frac{7}{8}\\right)" style="font-size:20px"><span class="textarea"><textarea></textarea></span><span mathquill-command-id="4">7</span><span class="fraction non-leaf" mathquill-command-id="5"><span class="numerator" mathquill-block-id="6"><span mathquill-command-id="9">3</span></span><span class="denominator" mathquill-block-id="7"><span mathquill-command-id="10">4</span></span><span style="display:inline-block; width:0">&nbsp;</span></span><span class="binary-operator" mathquill-command-id="11">−</span><span mathquill-command-id="12">1</span><span mathquill-command-id="13">.</span><span mathquill-command-id="14">1</span><span mathquill-command-id="15">2</span><span mathquill-command-id="16">5</span><span class="binary-operator" mathquill-command-id="17">+</span><span class="non-leaf" mathquill-command-id="18"><span class="paren scaled" style="transform:scale(1.16, 1.89)">(</span><span class="non-leaf" mathquill-block-id="19"><span mathquill-command-id="20">2</span><span mathquill-command-id="21">.</span><span mathquill-command-id="22">2</span><span mathquill-command-id="23">5</span><span class="binary-operator" mathquill-command-id="24">−</span><span mathquill-command-id="26">6</span><span class="fraction non-leaf" mathquill-command-id="27"><span class="numerator" mathquill-block-id="28"><span mathquill-command-id="31">7</span></span><span class="denominator" mathquill-block-id="29"><span mathquill-command-id="32">8</span></span><span style="display:inline-block; width:0">&nbsp;</span></span></span><span class="paren scaled" style="transform:scale(1.16, 1.89)">)</span></span></span></p>\n' +
                '<table><tbody><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody></table>\n' +
                '<p><img class="kfformula" src="http://static.xiao5market.com//test/1f3ed8d1-bbe8-11e9-91bf-f34b97ae33bd-image-20190811112844-1.png" data-latex="x=\\frac {-b\\pm \\sqrt {{b}^{2}-4ac}} {2a}">​左侧的图片通过公式编辑器添加<br></p>\n' +
                '<p><img src="http://static.xiao5market.com//test/569562f1-b3a4-11e9-91bf-f34b97ae33bd-1024.png" alt="" width="104" height="104" style="float: right;" />​  </p>\n' +
                '<p>右侧的图片通过图片上传添加，样式为float</p>\n' +
                '<p><a href="https://www.baidu.com">外链</a></p>\n' +
                '<p><span style="line-height:2;">该行文字设置了行高</span></p>\n' +
                '<p><span style="line-height:2;">嵌套设<span style="line-height:3;">置行</span>高</span></p>';

            return {
                // 编辑器远程下载地址（将ckeditor_4.12.0_dev.zip解压到可访问目录）
                config: {
                    editorRemoteUrl: "./ckeditor/ckeditor.js",
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
                text: text,
                html: text
            };
        },
        mounted: function () {
            window.xxx = this;
        },
        methods: {
            toMd() {
                return toMarkdown(this.text);
            },
            toHtml() {
                return toHtml(this.text)
            },
            toServer() {
                return markdownToServer(this.text);
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
