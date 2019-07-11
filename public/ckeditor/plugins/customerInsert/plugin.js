/*
 Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
CKEDITOR.plugins.add("customerInsert",{icons:"uplus",hidpi:!0,init:function(a){a.addCommand("uplus",{exec:function(a){a.insertHtml("__________________")}});a.ui.addButton("uplus",{label:"增加下划线",command:"uplus",toolbar:"insert"})}});