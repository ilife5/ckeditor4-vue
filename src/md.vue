<template>
    <div>
        <h1>原始html</h1>
        <div>
            {{html}}
        </div>

        <h1>turndown 处理过的</h1>
        <div>
        <pre>
            <code>
{{toMd()}}
            </code>
        </pre>
        </div>

        <h2>计划</h2>
        <ul>
            <li>周二之前出最终技术方案</li>
            <li>周四之前出demo</li>
            <li>周日之前做完</li>
        </ul>
        <h3>markdown抽取的支持</h3>
        <ul>
            <li>结构支持：p span img u（下划线）em（斜体）s（删除线）sup（上标）sub（下标）strong（加粗）table（表格）</li>
            <li>嵌套支持 span x em x s x strong x s 可以互相嵌套，嵌套关系的保留</li>
            <li>属性支持 line-height（行高）float(图片的左右对齐方式)
                data-*（扩展格式的支持，如data-latex，波浪线，加重号）
                src width height
                text-underline（下划线）</li>
            <li>特殊处理：图片src需要在提交的时候把域名处理掉，展示的时候加回来</li>
        </ul>

        <h3>工具选取</h3>
        <ul>
            <li>https://github.com/showdownjs/showdown 双向，支持plugin</li>
            <li>https://github.com/domchristie/turndown html to markdown</li>
            <li>https://github.com/markedjs/marked markdown to html</li>
            <li>https://github.com/markdown-it/markdown-it markdown to html</li>
        </ul>
        <h3>html和md的相互转化工具</h3>
        <h3>数据库中老数据清洗支持（需要后端同学）</h3>

    </div>
</template>

<script>
    import TurndownService from 'turndown';
    import showdown from 'showdown';

    const turndownService = new TurndownService();
    const converter = new showdown.Converter()

    export default {
        name: "md",
        data: function() {
            return {
                html: '<p><span data-role="wave"><span data-role="emphasize"><em><strong><sub>微</sub><s>软</s><u><sup>雅</sup><s>黑&nbsp; &nbsp;<span tabindex="-1" contenteditable="false" data-cke-widget-wrapper="1" data-cke-filter="off" class="cke_widget_wrapper cke_widget_inline cke_widget_image cke_image_nocaption" data-cke-display-name="图像" data-cke-widget-id="35" role="region" aria-label=" 图像 小部件"><img alt="" src="http://static.xiao5market.com//test/6a941ba1-a695-11e9-91bf-f34b97ae33bd-1.png" data-cke-widget-keep-attr="0" data-widget="image" class="cke_widget_element" data-cke-widget-data="%7B%22hasCaption%22%3Afalse%2C%22src%22%3A%22http%3A%2F%2Fstatic.xiao5market.com%2F%2Ftest%2F6a941ba1-a695-11e9-91bf-f34b97ae33bd-1.png%22%2C%22alt%22%3A%22%22%2C%22width%22%3A%2282%22%2C%22height%22%3A%2223%22%2C%22lock%22%3Atrue%2C%22align%22%3A%22none%22%2C%22classes%22%3Anull%7D" data-cke-saved-src="http://static.xiao5market.com//test/6a941ba1-a695-11e9-91bf-f34b97ae33bd-1.png" width="82" height="23"><span class="cke_reset cke_widget_drag_handler_container" style="background: url(&quot;http://localhost:8080/resources/ckeditor/plugins/widget/images/handle.png&quot;) rgba(220, 220, 220, 0.5); top: -15px; left: 0px; display: block;"><img class="cke_reset cke_widget_drag_handler" data-cke-widget-drag-handler="1" src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" width="15" title="点击并拖拽以移动" height="15" role="presentation" draggable="true"></span><span class="cke_image_resizer" title="点击并拖拽以改变尺寸">​</span></span></s></u></strong></em></span>&nbsp;</span>&nbsp;&nbsp;^&nbsp;<span style="line-height:3;"><img class="kfformula" src="http://static.xiao5market.com//test/7d041bf1-a695-11e9-91bf-f34b97ae33bd-image-20190715081418-1.png" data-latex="x=\\frac {-b\\pm \\sqrt {{b}^{2}-4ac}} {2a}"></span>&nbsp;__________________&nbsp;<span style="line-height:4;">​​​​​​​</span></p>'
            }
        },
        methods: {
            toMd() {
                const md = turndownService.turndown(this.html);
                return md;
            }
        }
    }
</script>

<style scoped>

</style>