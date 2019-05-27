<template>
    <div id="app">
        <div class="menu">
            <div v-for="(item, index) in menu" class="m-item" :key="index">
                <div class="m-c" v-for="(l, i) in item" :key="i" @click="choose(index,l)">{{l.name}}</div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'app',
        components: {},
        data: function() {
            return {
                list: [
                    {
                        name: '黄焖鸡米饭111111111',
                        cList: [
                            { name: '二级黄焖鸡' },
                            {
                                name: 'one chicken',
                                cList: [
                                    { name: '三级黄焖鸡3333', cList: [{ name: '四级黄焖鸡' }] }
                                ]
                            }
                        ]
                    },
                    { name: '2222222222' },
                    {
                        name: '黄焖鸡米饭33333333',
                        cList: [{ name: '二级黄焖鸡' }, { name: 'one chicken' }]
                    }
                ],
                menu: []
            };
        },
        mounted: function() {
            this.menu.push(this.list.map((item) => {
                return JSON.parse(JSON.stringify(item));
            }))
        },
        methods: {
            toMd () {
            },
            choose(index, item) {
                this.menu.splice(index + 1);
                this.menu.push(item.cList.map((it) => {
                    return JSON.parse(JSON.stringify(it));
                }))
            }
        }
    }
</script>

<style lang="less">
    .menu {
        width: 400px;
        height: 200px;
        border: 1px solid yellow;
        display: flex;
        overflow: auto;

        .m-item {
            width: 100px;
            height: 100%;
            display: inline-block;
            border: 1px red solid;
            box-sizing: border-box;
            flex-shrink: 0;
        }

        .m-c {
            border: 1px solid blue;
        }
    }
</style>
