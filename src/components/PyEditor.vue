<template>
    <div :class="`${type==='inline'?'editor-wrapper':''}`">
        <textarea ref="editor" style="height: 100px;"></textarea>
    </div>
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

        extraPlugins: 'jme, uploadimage, image2',

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

        removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,NumberedList,BulletedList,Outdent,Indent,Blockquote,CreateDiv,JustifyBlock,JustifyRight,JustifyCenter,JustifyLeft,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Flash,HorizontalRule,Smiley,PageBreak,Iframe,Styles,Format,Font,FontSize,TextColor,BGColor,Maximize,ShowBlocks,About',
        pasteFilter: "semantic-content",
        //pasteFilter: "plain-text",
        disallowedContent: "ol li",

        editorRemoteUrl: "https://www.xiao5market.com/resources/ckeditor/ckeditor.js",
        placeholderRemoteSrc: "http://static.xiao5market.com//test/5cc9b850-7fb6-11e9-a2d3-9be340027365-image.png"
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
                    editorRemoteUrl: "https://www.xiao5market.com/resources/ckeditor/ckeditor.js"
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
                    disallowedContent: 'ol; li; script; *[on*]'
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

                editor.on( 'focus', evt => {
                    this.$emit( 'focus', evt, editor );
                });

                editor.on( 'blur', evt => {
                    this.$emit( 'blur', evt, editor );
                } );

                editor.on( 'paste', evt => {
                    evt.data.dataValue = evt.data.dataTransfer.getData( 'text/html' )
                        .replace(/<p\s+[^>]*>\s*<span[^>]*>\s*<\/span>\s*<br>\s*<\/p>/g, '<p></p>')
                        .replace(/<span\s+class="Apple-converted-space">\s+<\/span>/g, 'imgPlaceHolder')
                        .replace(/<span\s+class="[^"]*">\s*<\/span>/g, 'spanPlaceHolder');
                }, null, null, 2 );

                editor.on( 'paste', evt => {

                    evt.data.dataValue = evt.data.dataValue.replace(/imgPlaceHolder/g, `<img style="height: 20px; border: 1px solid black;" src="${config.placeholderRemoteSrc}"><span>&nbsp;</span>`);
                    evt.data.dataValue = evt.data.dataValue.replace(/spanPlaceHolder/g, `<img style="height: 20px; border: 1px solid black;" src="${config.placeholderRemoteSrc}"><span>&nbsp;</span>`);

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
                        formData.append( self.uploaderConfig.key, fileLoader.file, fileLoader.fileName );

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
        border: 1px solid #d1d1d1;
        padding: 0;
        margin: 0 0 10px 0;
    }
</style>
