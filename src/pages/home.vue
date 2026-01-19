<template>
    <div>home</div>
    <el-button type="primary" @click="handleClick"></el-button>
    <div class="container" ref="container"></div>
    <div class="container1" ref="container1"></div>
    <div class="container2" ref="container2"></div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import LogicFlow from "@logicflow/core";
import "@logicflow/core/lib/style/index.css";
const container = ref(null)
const container1 = ref(null)
const container2 = ref(null)
const str = {
  "nodes": [
    {
      "id": "21",
      "type": "rect",
      "x": 500,
      "y": 100,
      "properties": {
        "width": 160,
        "height": 80
      },
      "text": {
        "x": 500,
        "y": 100,
        "value": "Origin Usage-rect"
      }
    },
    {
      "id": "50",
      "type": "circle",
      "x": 700,
      "y": 300,
      "properties": {
        "r": 60,
        "width": 120,
        "height": 120
      },
      "text": {
        "x": 700,
        "y": 300,
        "value": "Origin Usage-circle"
      }
    }
  ],
  "edges": [
    {
      "id": "e557c9f6-8963-45c2-9e86-3c1ed44abadb",
      "type": "polyline",
      "properties": {},
      "sourceNodeId": "50",
      "targetNodeId": "21",
      "sourceAnchorId": "50_0",
      "targetAnchorId": "21_1",
      "startPoint": {
        "x": 700,
        "y": 240
      },
      "endPoint": {
        "x": 580,
        "y": 100
      },
      "pointsList": [
        {
          "x": 700,
          "y": 240
        },
        {
          "x": 700,
          "y": 100
        },
        {
          "x": 580,
          "y": 100
        }
      ]
    },
  ]
}
const data = JSON.parse(JSON.stringify(str))
const demo = {
    "name": null,
    "edges": [
        {
            "code": "YtmV2",
            "name": "",
            "source": "969965421",
            "target": "2084730671"
        },
        {
            "code": "mDtdC",
            "name": "",
            "source": "2012907531",
            "target": "969965421"
        },
        {
            "code": "MQjQY",
            "name": "",
            "source": "2084730671",
            "target": "969965421"
        },
        {
            "code": "PclgX",
            "name": "",
            "source": "1443869785",
            "target": "2084730671"
        },
        {
            "code": "qHghr",
            "name": "",
            "source": "2084730671",
            "target": "1443869785"
        },
        {
            "code": "rSIub",
            "name": "",
            "source": "2012907531",
            "target": "2084730671"
        },
        {
            "code": "PqXwO",
            "name": "",
            "source": "2084730671",
            "target": "2012907531"
        }
    ],
    "nodes": [
        {
            "x": 100,
            "y": 30,
            "code": "oTrYz",
            "name": "质量问题处置流程",
            "type": "HorizontalPartitionModel",
            "width": 600,
            "height": 420,
            "children": [
                {
                    "x": 0,
                    "y": 20,
                    "code": "yYz9d",
                    "name": "生产域",
                    "type": "HorizontalPartitionFunctionModel",
                    "width": 600,
                    "height": 200,
                    "children": [
                        {
                            "x": 30,
                            "y": 80,
                            "code": "969965421",
                            "name": "零件工序生产",
                            "type": "ActionModel",
                            "width": 81,
                            "height": 43,
                            "children": null,
                            "sourceEdges": [
                                {
                                    "code": "YtmV2"
                                }
                            ],
                            "targetEdges": [
                                {
                                    "code": "mDtdC"
                                },
                                {
                                    "code": "MQjQY"
                                }
                            ],
                            "usecaseInfo": null
                        }
                    ],
                    "sourceEdges": [],
                    "targetEdges": [],
                    "usecaseInfo": null
                },
                {
                    "x": 0,
                    "y": 220,
                    "code": "E320q",
                    "name": "质量域",
                    "type": "HorizontalPartitionFunctionModel",
                    "width": 600,
                    "height": 200,
                    "children": [
                        {
                            "x": 30,
                            "y": 80,
                            "code": "1443869785",
                            "name": "合格证开具",
                            "type": "ActionModel",
                            "width": 81,
                            "height": 43,
                            "children": null,
                            "sourceEdges": [
                                {
                                    "code": "PclgX"
                                }
                            ],
                            "targetEdges": [
                                {
                                    "code": "qHghr"
                                }
                            ],
                            "usecaseInfo": null
                        },
                        {
                            "x": 130,
                            "y": 80,
                            "code": "2012907531",
                            "name": "故障处理",
                            "type": "ActionModel",
                            "width": 81,
                            "height": 43,
                            "children": null,
                            "sourceEdges": [
                                {
                                    "code": "rSIub"
                                },
                                {
                                    "code": "mDtdC"
                                }
                            ],
                            "targetEdges": [
                                {
                                    "code": "PqXwO"
                                }
                            ],
                            "usecaseInfo": null
                        },
                        {
                            "x": 230,
                            "y": 80,
                            "code": "2084730671",
                            "name": "工序检验任务执行",
                            "type": "ActionModel",
                            "width": 81,
                            "height": 43,
                            "children": null,
                            "sourceEdges": [
                                {
                                    "code": "qHghr"
                                },
                                {
                                    "code": "MQjQY"
                                },
                                {
                                    "code": "PqXwO"
                                }
                            ],
                            "targetEdges": [
                                {
                                    "code": "rSIub"
                                },
                                {
                                    "code": "YtmV2"
                                },
                                {
                                    "code": "PclgX"
                                }
                            ],
                            "usecaseInfo": null
                        }
                    ],
                    "sourceEdges": [],
                    "targetEdges": [],
                    "usecaseInfo": null
                }
            ],
            "sourceEdges": [],
            "targetEdges": [],
            "usecaseInfo": null
        }
    ]
}
const renderData = {
    // 节点数据
    nodes: [
        {
            id: '21', // 节点ID，需要全局唯一，不传入内部会自动生成一个ID
            type: 'rect', // 节点类型，可以传入LogicFlow内置的7种节点类型，也可以注册自定义节点后传入自定义类型
            x: 80, // 节点形状中心在x轴位置
            y: 40, // 节点形状中心在y轴的位置
            text: 'Origin Usage-rect1', // 节点文本
            properties: { // 自定义属性，用于存储需要这个节点携带的信息，可以传入宽高以重设节点的宽高
                width: 160,
                height: 80,
            }
        },
        {
            id: '50',
            type: 'rect',
            x: 300,
            y: 300,
            text: 'Origin Usage-rect2',
            properties: {
                width: 160,
                height: 80,
            }
        },
    ],
    // 边数据
    edges: [
        {
            id: 'rect-2-circle', // 边ID，性质与节点ID一样
            type: 'polyline', // 边类型
            sourceNodeId: '50', // 起始节点Id
            targetNodeId: '21', // 目标节点Id
        },
        {
            id: 'rect-2-circle', // 边ID，性质与节点ID一样
            type: 'polyline', // 边类型
            sourceNodeId: '21', // 起始节点Id
            targetNodeId: '50', // 目标节点Id
        }
    ],
}
onMounted(() => {
    const lf = new LogicFlow({
        container: container.value,
        grid: true
    });
    lf.render(data);
    const lf1 = new LogicFlow({
        container: container1.value,
        grid: true
    });
    lf.render(data);
    const lf2 = new LogicFlow({
        container: container2.value,
        grid: true
    });
    lf.render(data);
    //lf1.render(demo);
    lf2.render(renderData);
}
)
</script>
<style scoped>
.container {
    width: 1000px;
    height: 500px;
    border: 1px solid #ccc;
}
.container1 {
    width: 1000px;
    height: 500px;
    border: 1px solid #ccc;
}
.container2 {
    width: 1000px;
    height: 500px;
    border: 1px solid #ccc;
}
</style>