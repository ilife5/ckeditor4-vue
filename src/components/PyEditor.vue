<template>
    <div :class="`${type==='inline'?'editor-wrapper':''}`"><textarea ref="editor" style="height: 100px;"></textarea></div>
</template>

<script>
    import loadScript from 'load-script';
    import { debounce } from 'lodash-es';
    import $ from 'jquery';

    window.$ = window.jQuery = $;

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

        extraPlugins: 'uploadimage, image2, pastefromword, kityformula',

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

        removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,Undo,Redo,Find,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,NumberedList,BulletedList,Outdent,Indent,Blockquote,CreateDiv,JustifyBlock,JustifyRight,JustifyCenter,JustifyLeft,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Flash,HorizontalRule,Smiley,PageBreak,Iframe,Styles,Format,Font,FontSize,TextColor,BGColor,Maximize,ShowBlocks,About,Subscript,Superscript',
        pasteFilter: "semantic-content",
        //pasteFilter: "plain-text",
        disallowedContent: "ol li",

        editorRemoteUrl: "https://www.xiao5market.com/resources/ckeditor/ckeditor.js",
        placeholderRemoteSrc: "http://static.xiao5market.com//test/169ad7b0-8164-11e9-a2d3-9be340027365-image.png",
        mathTypeRemoteSrc: "http://static.xiao5market.com//test/615b9e70-8546-11e9-a2d3-9be340027365-image.png",
        language: "zh-cn"
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
                        $1: {
                            // Use the ability to specify elements as an object.
                            elements: CKEDITOR.dtd,
                            attributes: true,
                            styles: true,
                            classes: true
                        }
                    },
                    disallowedContent: 'ol; li; script; *[on*]; strong; h*; b;'
                };
                this.editor = CKEDITOR[ constructor ]( this.$refs.editor, {
                    ...config,
                    ...conf,
                    ...this.config,
                    uploadUrl: this.uploaderConfig.url?this.uploaderConfig.url:config.uploadUrl,
                    filebrowserImageUploadUrl: this.uploaderConfig.url?this.uploaderConfig.url:config.filebrowserImageUploadUrl
                } );

                this.$_setUpEditorEvents();

                if(this.value) {
                    this.editor.setData(this.value);
                }

                if ( this.customStyle && this.type !== 'inline' ) {
                   this.editor.on( 'loaded', () => {
                       this.editor.container.setStyles( this.customStyle );
                    } );
                }

                this.$emit( 'ready', this.editor );
            } ).catch( window.console.error );
        },
        methods: {
            $_setUpEditorEvents() {
                const self = this;
                const editor = this.editor;
                const emitInputEvent = evt => {
                    const data = this.$_lastEditorData = editor.getData();
                    this.$emit( 'input', data, evt, editor );
                };

                editor.on( 'change', debounce( emitInputEvent, INPUT_EVENT_DEBOUNCE_WAIT ));

                editor.on( 'fileUploadResponse', () => {
                    setTimeout(() => {
                        emitInputEvent();
                    }, INPUT_EVENT_DEBOUNCE_WAIT);
                });


                editor.on( 'focus', evt => {
                    this.$emit( 'focus', evt, editor );
                });

                editor.on( 'blur', evt => {
                    this.$emit( 'blur', evt, editor );
                } );

                editor.on( 'paste', evt => {
                    evt.data.dataValue = evt.data.dataTransfer.getData( 'text/html' )
                        .replace(/<span\s+class="Apple-converted-space">\s+<\/span>/g, 'imgPlaceHolder')
                        .replace(/<span\s+class="[^"]*">\s*<\/span>/g, 'spanPlaceHolder');
                }, null, null, 2 );

                editor.on( 'paste', evt => {

                    const ParaStart = /<m:(\w+)>/;

                    evt.data.dataValue = evt.data.dataValue.replace(/(style="[^"]*font-emphasize[^"]*:[^"]*dot[^"]*[^"]*")/g, function(m, $1){
                        return 'data-role="dot"' + $1;
                    });

                    let result = evt.data.dataValue.match(ParaStart);

                    while(result) {
                        let start = evt.data.dataValue.indexOf(result[0]);
                        let end = evt.data.dataValue.indexOf(result[0].replace('<', '</')) + result[0].length + 1;

                        evt.data.dataValue = evt.data.dataValue.substring(0, start)
                            + '<img border="1px" data-role="mathType-placeholder" src="' + config.mathTypeRemoteSrc + '" ' + 'style="border: 1px solid black; height: 20px;"/>'
                            + evt.data.dataValue.substring(end).replace(/^<span[^>]*>(<span[^>]*>)*<img[^>]*\/>(<\/span*>)*<\/span>/, '');

                        result = evt.data.dataValue.match(ParaStart);
                    }

                    evt.data.dataValue = evt.data.dataValue.replace(/<(img[^>]+)src="file:[^"]+"/g, function(m, $1) {
                        return '<' + $1 + 'border="1px" src="' + config.placeholderRemoteSrc + '"' + 'style="border: 1px solid black; height: 20px;"';
                    });

                });

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
                if ( newValue !== oldValue && newValue !== this.$_lastEditorData ) {
                    this.editor.setData( newValue );
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
