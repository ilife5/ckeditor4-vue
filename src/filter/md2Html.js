import Vue from 'vue';
import {toHtml} from '../portal';

Vue.filter('md2Html', function (value) {
    if (!value) return '';

    return toHtml(value);
})