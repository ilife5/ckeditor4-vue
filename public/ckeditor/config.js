/**
 * Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';

	config.removeButtons = 'Underline,Subscript,Superscript,SpecialChar';
	config.extraPlugins = 'jme, kityformula';

	config.allowedContent = {
		$1: {
			// Use the ability to specify elements as an object.
			elements: CKEDITOR.dtd,
				attributes: true,
				styles: true,
				classes: true
		}
	};
	config.filebrowserImageUploadUrl= "/api/upload";
	config.disallowedContent= 'ol; li; script; *[on*]; h*; strong; b;';
};

