/**
 * Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';

	config.removeButtons = 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,Undo,Redo,Find,Replace,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,NumberedList,BulletedList,Outdent,Indent,Blockquote,CreateDiv,JustifyBlock,JustifyRight,JustifyCenter,JustifyLeft,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Flash,HorizontalRule,Smiley,PageBreak,Iframe,Styles,Format,Font,FontSize,TextColor,BGColor,Maximize,ShowBlocks,About,PasteFromWord';
	config.extraPlugins = 'uploadimage, image2, pastefromword, kityformula, emphasize, customerInsert, lineheight, wavy';

	config.allowedContent = {
		img: {
			attributes: [ '!src', 'alt', 'width', 'height', 'title' ],
			styles: ['vertical-align', 'float']
		},
		span: {
			styles: ['line-height', 'text-underline', 'transform']
		},

		table: {
			attributes: [ 'border', 'align', 'summary', 'cellspacing', 'cellpadding', 'style' ],
		},

		td: {
			attributes: ['colspan', 'rowspan']
		},

		th: {
			attributes: ['colspan', 'rowspan', 'scope']
		},
		$1: {
			// Use the ability to specify elements as an object.
			elements: CKEDITOR.dtd,
			attributes: 'data-*',
			styles: false,
			classes: true
		}
	};

	config.toolbarGroups= [
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
	];


	config.pasteFilter = "semantic-content";
	config.disallowedContent = "ol li div";

};

