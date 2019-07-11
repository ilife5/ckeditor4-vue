/*
 Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
CKEDITOR.plugins.add("emphasize",{lang:"zh-cn",icons:"emphasize",hidpi:!0,init:function(a){var d=60,g={emphasize:[["span",function(a){return"dot"===a.styles["font-emphasize"]}]]};(function(f,h,c,b){if(b){b=new CKEDITOR.style(b);var e=g[c];e.unshift(b);a.attachStyleStateChange(b,function(b){!a.readOnly&&a.getCommand(c).setState(b)});a.addCommand(c,new CKEDITOR.styleCommand(b,{contentForms:e}));a.ui.addButton&&a.ui.addButton(f,{label:h,command:c,toolbar:"basicstyles,"+(d+=10)})}})("Emphasize",a.lang.emphasize.emphasize,
"emphasize",a.config.coreStyles_emphasize);a.setKeystroke([[CKEDITOR.CTRL+69,"emphasize"]])}});CKEDITOR.config.coreStyles_emphasize={element:"span",attributes:{"data-role":"emphasize"}};