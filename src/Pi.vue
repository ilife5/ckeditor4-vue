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
                '<p><span style="line-height:150%;">该行文字设置了行高</span></p>\n' +
                '<p><span style="line-height:15pt;">该行文字设置了行高</span></p>\n' +
                '<p><span style="line-height:15px;">该行文字设置了行高</span></p>\n' +
                '<p><span style="line-height:15.6px;">该行文字设置了行高</span></p>\n' +
                '<p><span style="line-height:2;">嵌套设<span style="line-height:3;">置行</span>高</span></p>' + `<span class="top_question">2</span>
<span class="small_question">2</span>
<span class="sub_question">3</span>

<p class='material_title'><span>4</span></p >
<p class='material_options'><span>5</span></p >
<p class='material_options'>6</p >
<span class='top-sequence'>7</span>
<span class=‘top_question'>8</span>
<span class='small_question'>9</span>
<span class='sub_question'>0</span>

<span class="outer-question-area">11<span class="question-score">12</span></span>

`;

            text = '<u>1     3  </u>解：S阴=S大半圆+S小半圆-S三\n' +
                '\n' +
                '$$%5Cfrac%7B1%7D%7B2%7D%5Ctext%7B%CF%80%7D%5Ctimes%5Cleft(%5Cfrac%7B4%7D%7B2%7D%5Cright)%5E2%2B%5Cfrac%7B1%7D%7B2%7D%5Ctext%7B%CF%80%7D%5Ctimes%5Cleft(%5Cfrac%7B2%7D%7B2%7D%5Cright)%5E2-4%5Ctimes2%5Cdiv2$$\n' +
                '\n' +
                '\\=2.5π-4\\=3.85（cm<sup>2</sup>）';

            /*text = '            \n' +
                '%W%%E%_**<sub>微</sub>~~软~~<u><sup>雅</sup>~~黑   ![](//test/6a941ba1-a695-11e9-91bf-f34b97ae33bd-1.png =82x23)~~</u>**_%E% %W%  ^ %lh(3)%![](//test/7d041bf1-a695-11e9-91bf-f34b97ae33bd-image-20190715081418-1.png)%lh% \\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_ \n' +
                '\n' +
                'abc\n' +
                '\n' +
                '$$7%5Cfrac%7B3%7D%7B4%7D-1.125%2B%5Cleft(2.25-6%5Cfrac%7B7%7D%7B8%7D%5Cright)$$\n' +
                '\n' +
                '$$7%5Cfrac%7B3%7D%7B4%7D-1.125%2B%5Cleft(2.25-6%5Cfrac%7B7%7D%7B8%7D%5Cright)$$\n' +
                '\n' +
                '$$7%5Cfrac%7B3%7D%7B4%7D-1.125%2B%5Cleft(2.25-6%5Cfrac%7B7%7D%7B8%7D%5Cright)$$\n' +
                '\n' +
                '<table><tbody><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody></table>\n' +
                '\n' +
                '$$x%3D%5Cfrac%20%7B-b%5Cpm%20%5Csqrt%20%7B%7Bb%7D%5E%7B2%7D-4ac%7D%7D%20%7B2a%7D$$​左侧的图片通过公式编辑器添加\n' +
                '\n' +
                '![](//test/569562f1-b3a4-11e9-91bf-f34b97ae33bd-1024.png =104x104){: style="float: right;"}​\n' +
                '\n' +
                '右侧的图片通过图片上传添加，样式为float\n' +
                '\n' +
                '外链\n' +
                '\n' +
                '%lh(2)%该行文字设置了行高%lh%\n' +
                '\n' +
                '%lh(150%)%该行文字设置了行高%lh%\n' +
                '\n' +
                '%lh(2)%嵌套设%lh(3)%置行%lh%高%lh%\n' +
                '\n' +
                '%C_TQ%2%C_TQ% %C_SMQ%2%C_SMQ% %C_SUQ%3%C_SUQ%\n' +
                '\n' +
                '%C_MT%4%C_MT%%C_MO%5%C_MO%%C_MO%6%C_MO%\n' +
                '\n' +
                '%C_TS%7%C_TS% 8 %C_SMQ%9%C_SMQ% %C_SUQ%0%C_SUQ% %C_OQA%11%C_QS%12%C_QS%%C_OQA%'*/

           /* text = `右侧的图片通 <br/> 过图片上传添加，样式为float<br/>

外链

<br/>

$$7%5Cfrac%7B3%7D%7B4%7D-1.125%2B%5Cleft(2.25-6%5Cfrac%7B7%7D%7B8%7D%5Cright)$$

%lh(2)%该行文字设置了行高%lh% <br/>

%lh(150%)%该行文字设置了行高%lh%`*/

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
