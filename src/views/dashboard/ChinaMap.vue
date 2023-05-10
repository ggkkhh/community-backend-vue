<template>
    <div>
        <div id="china-map" :style="{ height: '500px', width: '100%' }"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts/map/js/china.js';

export default {
    data() {
        return {};
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // 基于准备好的dom，初始化echarts实例
            let chinaMap = echarts.init(document.getElementById("china-map"));
            window.onresize = chinaMap.resize; // 窗口或框架被调整大小时执行chinaMap.resize
            chinaMap.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: function (e) {
                        // console.log(e.value!==e.value);
                        // console.log(Object.is(e.value, NaN));
                        return isNaN(e.value) ? e.name + "：" + '0' : e.name + "：" + e.value;
                    }
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                visualMap: {
                    min: 0,
                    max: 10000,
                    left: 10,
                    bottom: 10,
                    showLabel: !0,
                    text: ["高", "低"],
                    textStyle: {
                        color: '#000'
                    },
                    pieces: [{
                        gt: 100,
                        label: "> 100",
                        color: "#0B83FF"
                    }, {
                        gt: 50,
                        lte: 101,
                        label: "51 - 100",
                        color: "#48A1FD"
                    }, {
                        gt: 10,
                        lte: 50,
                        label: "11 - 50",
                        color: "#9ECCFC"
                    }, {
                        gt: 0,
                        lte: 10,
                        label: "1 - 10",
                        color: "#C8E3FF"
                    }, {
                        value: 0,
                        color: "#E7F3FF"
                    }],
                    show: !0
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        dataView: { readOnly: false },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                geo: {
                    map: "china",
                    roam: !1,
                    scaleLimit: {
                        min: 1,
                        max: 2
                    },
                    zoom: 1.23,
                    // top: 120,
                    label: {
                        normal: {
                            show: !0,
                            fontSize: "10",
                            color: "#000"
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 2,
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            borderColor: "rgba(0, 0, 0, 0.2)"
                        },
                        emphasis: {
                            areaColor: "#6959CD",
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            borderWidth: 2
                        }
                    }
                },
                series: [
                    {
                        type: 'map',
                        mapType: 'china',
                        roam: true,
                        geoIndex: 0,
                        label: {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data: [
                            { name: '河南', value: 120 },
                            { name: '河北', value: 80 },
                            { name: '广东', value: 30 },
                            { name: '山东', value: 6 }
                        ]
                    }
                ]
            });
        }
    }
};
</script>
  
  