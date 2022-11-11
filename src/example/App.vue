<template>
  <div style="display: inline-block; text-align: center">
    <v-ace-editor
      v-model:value="jsonDataStr"
      @init="jsonFormat"
      lang="json"
      theme="chrome"
      style="height: 600px; width: 500px"
    />
    <el-button type="primary" @click="onUpdateJson">更新JSON</el-button>
  </div>
  <div
    style="
      margin-left: 20px;
      display: inline-block;
      vertical-align: top;
      margin-left: 50px;
    "
  >
    <h3
      >条件组件 ConditionCell.vue （github中源码代码中查看）<a
        href="https://github.com/mayuxian/condition-parser/blob/main/src/example/ConditionCell.vue"
        >点击跳转链接</a
      ></h3
    >
    <ConditionCell
      :condition="conditions?.at(0)"
      :source-options="sourceOptions"
      :target-options="targetOptions"
      :match-options="matchOptions"
      style="display: inline-block"
    />
    <div
      v-if="conditions?.at(0)?.pass != undefined"
      style="display: inline-block; margin-left: 50px"
    >
      校验结果：{{ conditions?.at(0)?.pass ? '成功' : '失败' }}
    </div>
    <div style="margin-bottom: 10px"
      >说明：设置sourceOptions、targetOptions、matchOptions则会对应展示源下拉框、目标值下拉框、匹配结果下拉框
    </div>
    <ConditionCell
      :condition="conditions?.at(1)"
      style="display: inline-block"
    />
    <div
      v-if="conditions?.at(1)?.pass != undefined"
      style="display: inline-block; margin-left: 50px"
    >
      校验结果：{{ conditions?.at(1)?.pass ? '成功' : '失败' }}
    </div>
    <ul style="margin-bottom: 10px">说明：
      <li> 1. 未设置targetOptions、matchOptions则已输入框展示</li>
      <li> 2. 设置了expression.sourceName则直接展示文本</li>
    </ul>
    <el-button type="primary" @click="onSave">保存并反显</el-button>
    <el-button type="primary" @click="onCheck">判断校验</el-button>
    <el-divider></el-divider>
    <h3>反显</h3>
    <ConditionCell
      v-for="(item, index) in invertConditions"
      :condition="item"
      :source-options="sourceOptions"
      :target-options="index == 0 ? targetOptions : undefined"
      :match-options="index == 0 ? matchOptions : undefined"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, Ref } from 'vue'
import ConditionCell from './ConditionCell.vue'
import { VAceEditor } from 'vue3-ace-editor'
import { ConditionParser, Condition, Expression } from '../condition-parser'
let jsonData = [
  {
    id: '1',
    realValue: 1,
    label: '数据1',
  },
  {
    id: '2',
    realValue: 2,
    label: '数据2',
  },
  {
    id: '3',
    realValue: 3,
    label: '数据3',
  },
  {
    id: '4',
    realValue: 4,
    label: '数据4',
  },
  {
    id: '5',
    realValue: 5,
    label: '数据5',
  },
  {
    id: '6',
    realValue: 6,
    label: '数据6',
  },
]
const sourceOptions = ref()
const targetOptions = ref([
  {
    label: '目标值=1',
    value: '1',
  },
  {
    label: '目标值=2',
    value: '2',
  },
])
const matchOptions = ref([
  { label: '匹配值=1', value: '1' },
  { label: '匹配值=2', value: '2' },
  { label: '匹配值=3', value: '3' },
])

const jsonDataStr = ref('')
function jsonFormat() {
  try {
    const data = JSON.stringify(jsonData, null, 2)
    jsonDataStr.value = data
    return data
  } catch (e) {
    console.error(e)
  }
}

const conditions: Ref<Condition[] | undefined> = ref()
const invertConditions: Ref<Condition[] | undefined> = ref()

function init() {
  updateSource()

  const cond1 = new Condition()
  cond1.expressions = [
    new Expression({
      sourceValue: '1',
      sourceName: '',
      relation: '&&',
    }),
    new Expression({
      sourceValue: '2',
      sourceName: '',
    }),
  ]
  const cond2 = new Condition()
  cond2.expressions = [
    new Expression({
      sourceValue: '3',
      sourceName: '数据3',
      relation: '||',
    }),
    new Expression({
      sourceValue: '4',
      sourceName: '数据4',
    }),
  ]
  conditions.value = [cond1, cond2]
}
init()
function updateSource() {
  sourceOptions.value = jsonData.map((x: any) => ({
    label: x.label,
    value: x.id,
  }))
}
function onSave() {
  const condiParser = new ConditionParser(conditions.value || [])
  const jsonStr = condiParser.generate()
  console.log('condiParser.generate ', jsonStr)
  const conditionArray = condiParser.parse(jsonStr)
  invertConditions.value = conditionArray
}
function onCheck() {
  const condiParser = new ConditionParser(conditions.value || [])
  const result = condiParser.execute((expr: Expression) => {
    return jsonData.find((x: any) => x.id === expr.sourceValue)?.realValue
  })
  console.log('condiParser.execute ', result)
}
function onUpdateJson() {
  if (jsonDataStr.value) {
    jsonData = JSON.parse(jsonDataStr.value)
    updateSource()
  }
}
</script>

<style scoped lang="scss"></style>
