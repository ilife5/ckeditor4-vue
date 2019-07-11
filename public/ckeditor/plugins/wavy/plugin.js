/*
 Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
CKEDITOR.plugins.add("wavy",{lang:"zh-cn",icons:"wavy",hidpi:!0,init:function(a){var d=80,g={wavy:[["span",function(a){return"wave"===a.styles["text-underline"]}]]};(function(f,h,c,b){if(b){b=new CKEDITOR.style(b);var e=g[c];e.unshift(b);a.attachStyleStateChange(b,function(b){!a.readOnly&&a.getCommand(c).setState(b)});a.addCommand(c,new CKEDITOR.styleCommand(b,{contentForms:e}));a.ui.addButton&&a.ui.addButton(f,{label:h,command:c,toolbar:"basicstyles,"+(d+=10)})}})("Wavy",a.lang.wavy.wavy,"wavy",
a.config.coreStyles_wavy)}});CKEDITOR.config.coreStyles_wavy={element:"span",attributes:{"data-role":"wave"}};