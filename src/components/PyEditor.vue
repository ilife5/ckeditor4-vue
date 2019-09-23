<template>
    <div :class="`${type==='inline'?'editor-wrapper':''}`"><textarea ref="editor" style="height: 100px;"></textarea></div>
</template>

<script>
    import loadScript from 'load-script';
    import { debounce } from 'lodash-es';
    import {editorToMarkdown, toHtml, toMarkdown, log} from '../portal';

    const INPUT_EVENT_DEBOUNCE_WAIT = 300;
    let promise;

    function getEditorNamespace( editorURL ) {
        if ( typeof editorURL !== 'string' || editorURL.length < 1 ) {
            throw new TypeError( '编辑器Url必填.' );
        }

        if ( 'CKEDITOR' in window ) {
            return Promise.resolve( window.CKEDITOR );
        } else if ( !promise ) {
            promise = new Promise( ( scriptResolve, scriptReject ) => {
                loadScript( editorURL, err => {
                    if ( err ) {
                        scriptReject( err );
                    } else {
                        scriptResolve( window.CKEDITOR );
                        promise = undefined;
                    }
                } );
            } );
        }

        return promise;
    }

    const config = {
        //图片浏览地址
        uploadUrl: "/api/upload",

        //图片上传地址
        filebrowserImageUploadUrl: "/api/upload",

        extraPlugins: 'uploadimage, image2, pastefromword, kityformula, emphasize, customerInsert, lineheight, wavy',

        toolbarGroups: [
            { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
            { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
            { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
            { name: 'forms', groups: [ 'forms' ] },
            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
            { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
            { name: 'links', groups: [ 'links' ] },
            { name: 'insert', groups: [ 'insert' ] },
            { name: 'styles', groups: [ 'styles' ] },
            { name: 'colors', groups: [ 'colors' ] },
            { name: 'tools', groups: [ 'tools' ] },
            { name: 'others', groups: [ 'others' ] },
            { name: 'about', groups: [ 'about' ] }
        ],

        removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,Undo,Redo,Find,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,NumberedList,BulletedList,Outdent,Indent,Blockquote,CreateDiv,JustifyBlock,JustifyRight,JustifyCenter,JustifyLeft,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Flash,HorizontalRule,Smiley,PageBreak,Iframe,Styles,Format,Font,FontSize,TextColor,BGColor,Maximize,ShowBlocks,About,PasteFromWord',
        pasteFilter: "semantic-content",

        editorRemoteUrl: "https://www.xiao5market.com/resources/ckeditor/ckeditor.js",
        placeholderRemoteSrc: "http://static.xiao5market.com//test/169ad7b0-8164-11e9-a2d3-9be340027365-image.png",
        mathTypeRemoteSrc: "https://pyds.oss-cn-beijing.aliyuncs.com/uploads/question_img/2019-07-10/ca6752a2-3db8-4211-9d88-f53bc6070eef.png",
        language: "zh-cn",

        ossLink: "http://static.xiao5market.com",
        customConfig: ''
    };

    export default {
        name: 'PyEditor',
        props: {
            value: {
                type: String,
                default: ''
            },
            config: {
                type: Object,
                default: () => ( {
                    editorRemoteUrl: "https://www.xiao5market.com/resources/ckeditor/ckeditor.js",
                    customerResponse: "true"
                } )
            },
            uploaderConfig: {
                type: Object,
                default: () => ( {
                    params: {},
                    key: "upload"
                } )
            },
            tagName: {
                type: String,
                default: 'div'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: 'inline'
            },
            customStyle: {
                type: Object,
                default: () => ( {} )
            },
            format: {
                type: String,
                default: 'md'
            }
        },
        data: function() {
            return {
                $_lastEditorData: {
                    type: String,
                    default: ''
                }
            }
        },
        mounted: function() {

            getEditorNamespace( this.config.editorRemoteUrl ).then( CKEDITOR => {
                CKEDITOR.verbosity = 0;
                const constructor = this.type === 'inline' ? 'inline' : 'replace';
                const conf = {
                    allowedContent: {
                        img: {
                            attributes: [ '!src', 'alt', 'width', 'height', 'title', 'crossDomain' ],
                            styles: ['vertical-align', 'float']
                        },
                        span: {
                            styles: ['line-height', 'text-underline', 'transform'],
                            classes: true
                        },
                        $1: {
                            // Use the ability to specify elements as an object.
                            elements: {
                                p: true,
                                span: true,
                                img: true,
                                table: true,
                                thead: true,
                                tbody: true,
                                tr: true,
                                td: true,
                                th: true,
                                strong: true,
                                em: true,
                                u: true,
                                sub: true,
                                sup: true,
                                del: true
                            },
                            attributes: 'data-*',
                            styles: false,
                            classes: true
                        }
                    }
                };
                const finalConfig = {
                    ...config,
                    ...conf,
                    ...this.config,
                    uploadUrl: this.uploaderConfig.url?this.uploaderConfig.url:config.uploadUrl,
                    filebrowserImageUploadUrl: this.uploaderConfig.url?this.uploaderConfig.url:config.filebrowserImageUploadUrl
                };

                this.editor = CKEDITOR[ constructor ]( this.$refs.editor, finalConfig );

                this.editor.on('loaded', () => {
                    // 元数据转化为md
                    if(this.format === 'md') {
                        // 元数据设置为markdown
                        editorToMarkdown(this.value, md => {
                            this.editor.setData(toHtml(md));
                            this.$emit( 'input', md, null, this.editor );
                            this.$emit( 'ready', this.editor );
                        });

                    } else {
                        this.editor.setData(this.value);
                        this.$emit( 'ready', this.editor );
                    }

                    if ( this.customStyle && this.type !== 'inline' ) {
                        this.editor.container.setStyles( this.customStyle );
                    }

                    this.$_setUpEditorEvents();
                });

            } ).catch( window.console.error );
        },
        methods: {
            $_setUpEditorEvents() {
                const self = this;
                const editor = this.editor;
                const emitInputEvent = evt => {

                    if(this.format === 'md') {
                        const data = this.$_lastEditorData = toMarkdown(editor.getData());
                        this.$emit( 'input', data, evt, editor );
                    } else {
                        const data = this.$_lastEditorData = editor.getData();
                        this.$emit( 'input', data, evt, editor );
                    }

                };

                editor.on( 'change', debounce( emitInputEvent, INPUT_EVENT_DEBOUNCE_WAIT ));

                //event: instanceReady

                editor.on( 'fileUploadResponse', () => {
                    setTimeout(() => {
                        emitInputEvent();
                    }, INPUT_EVENT_DEBOUNCE_WAIT);
                });


                editor.on( 'focus', evt => {
                    this.$emit( 'focus', evt, editor );
                });

                editor.on( 'blur', evt => {
                    // blur for log
                    this.$emit( 'blur', evt, editor );
                    if(this.format === 'md') {
                        const data = editor.getData();
                        log(toMarkdown(data), data);
                    }
                } );

                editor.on( 'paste', evt => {

                    const ParaStart = /<m:(\w+)>/;

                    evt.data.dataValue = evt.data.dataValue.replace(/(style="[^"]*font-emphasize[^"]*:[^"]*dot[^"]*[^"]*")/g, function(m, $1){
                        return 'data-role="emphasize"' + $1;
                    });

                    let result = evt.data.dataValue.match(ParaStart);

                    while(result) {
                        let start = evt.data.dataValue.indexOf(result[0]);
                        let end = evt.data.dataValue.indexOf(result[0].replace('<', '</')) + result[0].length + 1;

                        evt.data.dataValue = evt.data.dataValue.substring(0, start)
                            + '<img data-cke-realelement border="1px" class="kfformula" title="点击面板上的公式图标进行编辑" data-role="mathType-placeholder" src="' + config.mathTypeRemoteSrc + '" ' + 'style="border: 1px solid black; height: 20px;"/>'
                            /*+ '<span data-role="mathType-placeholder" title="双击进行公式编辑">&nbsp;</span><span>&nbsp;</span>'*/
                            + evt.data.dataValue.substring(end).replace(/<img src="data:image\/emf;[^"]*[^>]*>/, '');

                        result = evt.data.dataValue.match(ParaStart);
                    }

                    evt.data.dataValue = evt.data.dataValue.replace(/<(img[^>]+)src="file:[^"]+"/g, function(m, $1) {
                        return '<' + $1 + 'border="1px" src="' + config.placeholderRemoteSrc + '"' + 'style="border: 1px solid black; height: 20px;"';
                    });

                    evt.data.dataValue = evt.data.dataValue.replace(/<u[^>]*style="[^"]*text-underline[^"]*:[^"]*wave[^"]*[^"]*"[^>]*>(.*)<\/u>/g, function(m, $1){
                        return '<span data-role="wave">' + $1 + '</span>';
                    }).replace(/<u[^>]*style='[^']*text-underline[^']*:[^']*wave[^']*[^']*'[^>]*>(.*)<\/u>/g, function(m, $1){
                        return '<span data-role="wave">' + $1 + '</span>';
                    });

                    // 多加一行方便选中，需要判断是否粘贴的为file（判断dataValue的长度是否大于0）
                    /*if(evt.data.dataValue.length > 0) {
                        evt.data.dataValue += '<p><span>&nbsp;</span></p>';
                    }*/

                });

                editor.on( 'doubleclick', function( evt ) {
                    // If the link has descendants and the last part of it is also a part of a word partially
                    // unlinked, clicked element may be a descendant of the link, not the link itself (https://dev.ckeditor.com/ticket/11956).
                    // The evt.data.element.getAscendant( 'img', 1 ) condition allows opening anchor dialog if the anchor is empty (#501).
                    var element = evt.data.element;

                    if(element.getName() === 'img' && element.getAttribute('data-latex')) {
                        evt.data.dialog = "kityformulaDialog";
                    }

                }, null, null, 5);

                editor.on( 'fileUploadRequest', function( evt ) {
                    var fileLoader = evt.data.fileLoader,
                        formData = new FormData(),
                        xhr = fileLoader.xhr;

                    xhr.open( 'POST', fileLoader.uploadUrl, true );
                    if(self.uploaderConfig.format === 'base64') {
                        var reader = new FileReader();
                        reader.onload = function () {
                            formData.append( self.uploaderConfig.key, this.result );

                            fileLoader.xhr.send( formData );
                        };
                        reader.readAsDataURL(fileLoader.file);
                    } else {
                        var fileName = fileLoader.fileName;
                        if(fileLoader.file.type === 'image/x-emf') {
                            fileName = fileName.replace(/\.\w+$/, '.emf');
                        }
                        formData.append( self.uploaderConfig.key, fileLoader.file, fileName );

                        fileLoader.xhr.send( formData );
                    }
                    const params = self.uploaderConfig.params;
                    if(params && typeof params === "object") {
                        for(let name in params) {
                            formData.append( name, params[name] );
                        }
                    }
                    evt.stop();
                }, null, null, 4 );

                if(this.config.customerResponse) {
                    editor.on( 'fileUploadResponse', function( evt ) {
                        // Prevent the default response handler.
                        evt.stop();
                        // Get XHR and response.
                        var data = evt.data,
                            xhr = data.fileLoader.xhr,
                            response = xhr.responseText.split( '|' );

                        if ( response[ 1 ] ) {
                            // An error occurred during upload.
                            data.message = response[ 1 ];
                            evt.cancel();
                        } else {
                            data.url = 'https://pyds.oss-cn-beijing.aliyuncs.com' + JSON.parse(response[ 0 ]).data;
                            data.uploaded = 1;
                        }
                    } );
                }
            }
        },
        watch: {
            value( newValue, oldValue ) {

                if(this.format === 'md') {
                    if ( newValue !== oldValue && newValue !== this.$_lastEditorData ) {
                        this.editor.setData( toHtml(newValue) );
                    }
                } else {
                    if ( newValue !== oldValue && newValue !== this.$_lastEditorData ) {
                        this.editor.setData( newValue );
                    }
                }
            },

            // Synchronize changes of #disabled.
            disabled( val ) {
                this.editor.setReadOnly(val);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .editor-wrapper {
        padding: 0;
        margin: 0 0 10px 0;
        border: 0;
    }
</style>
