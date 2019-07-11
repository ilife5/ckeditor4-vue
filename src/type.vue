<template>
    <div id="app">
        <h2>居中</h2>
        <p>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <img :src="logo" style="vertical-align: middle;">

            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
        </p>
        <h2>左对齐</h2>
        <p>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>

            <img :src="logo" style="float: left;">
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
        </p>

        <div style="clear: both;"></div>

        <h2>右对齐</h2>
        <p>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>

            <img :src="logo" style="float: right;">
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
        </p>

        <div style="clear: both;"></div>
        
        <h2>flex 布局右对齐</h2>
        <p style="display: flex; flex-wrap: wrap;">
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>

            <img :src="logo" style="float: right;">
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
            <span>12sdfjslkdjflsk jdflk 311111</span>
        </p>
    </div>
</template>

<script>

    import logo from './assets/logo.png';

    export default {
        name: 'app',
        components: {},
        mounted: function() {},
        data: function() {
            return {logo}
        }
    }
</script>

<style lang="less">
    #app {
        width: 600px;
    }
</style>
