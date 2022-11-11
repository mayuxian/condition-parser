<template>
  <div class="condidtion-cell">
    <div v-for="(expr, index) in data.expressions" style="margin: 10px 0">
      <span v-if="index === 0" class="label"></span>
      <el-select
        v-show="index !== 0"
        v-model="expr.relation"
        class="relation-select"
      >
        <el-option label="和" value="&&"></el-option>
        <el-option label="或" value="||"></el-option>
      </el-select>
      <span v-if="expr.sourceName" class="label" style="margin-left: 10px">{{
        expr.sourceName
      }}</span>
      <el-select
        v-else
        v-model="expr.sourceValue"
        filterable
        :allow-create="true"
        placeholder="请选择"
      >
        <el-option
          v-for="opt in data.sourceOptions"
          :label="opt.label"
          :value="opt.value"
        ></el-option>
      </el-select>
      <el-select
        v-model="expr.operator"
        placeholder="请选择"
        class="operator-select"
        style="margin: 0 10px"
      >
        <el-option
          v-for="opt in operatorOptions"
          :label="opt.label"
          :value="opt.value"
        ></el-option>
      </el-select>
      <el-select
        v-if="data.targetOptions?.length"
        v-model="expr.targetValue"
        placeholder="请选择"
        class="targetvalue-select"
        filterable
        :allow-create="true"
      >
        <el-option
          v-for="opt in data.targetOptions"
          :label="opt.label"
          :value="opt.value"
        ></el-option>
      </el-select>
      <el-input
        v-else
        v-model="expr.targetValue"
        style="width: 100px"
      ></el-input>
    </div>
    <el-divider style="margin: 5px 0 0 0"></el-divider>
    <span class="label">匹配成功结果值</span>
    <el-select
      v-if="data.matchOptions?.length"
      v-model="data.matchResult"
      filterable
      :allow-create="true"
      clearable
      placeholder="请选择"
      style="width: 100%"
    >
      <el-option
        v-for="opt in data.matchOptions"
        :label="opt.label"
        :value="opt.value"
      ></el-option>
    </el-select>
    <el-input v-else v-model="data.matchResult" style="width: 100px"></el-input>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, Ref, reactive } from 'vue'
import {
  ConditionParser,
  Condition,
  Expression,
  SelectOption,
} from '../condition-parser'
const props = defineProps({
  condition: {
    type: Condition,
    default: null,
  },
  sourceOptions: {
    type: Array<SelectOption>,
    default: null,
  },
  targetOptions: {
    type: Array<SelectOption>,
    default: null,
  },
  matchOptions: {
    type: Array<SelectOption>,
    default: null,
  },
})
const data = ref(new Condition())
const operatorOptions = [
  {
    label: '=',
    value: '==',
  },
  {
    label: '>',
    value: '>',
  },
  {
    label: '>=',
    value: '>=',
  },
  {
    label: '<',
    value: '<',
  },
  {
    label: '<=',
    value: '<=',
  },
]

watch(
  () => props.condition,
  (newVal: Condition, oldVal: any) => {
    data.value = newVal || {}
  },
  {
    deep: true,
    immediate: true,
  }
)
watch(
  () => props.matchOptions,
  (newVal: any) => {
    if (!newVal) return
    data.value.matchOptions = newVal
  },
  {
    immediate: true,
  }
)
watch(
  () => props.targetOptions,
  (newVal: any) => {
    if (!newVal) return
    data.value.targetOptions = newVal
  },
  {
    immediate: true,
  }
)
watch(
  () => props.sourceOptions,
  (newVal: any) => {
    if (!newVal) return
    data.value.sourceOptions = newVal
  },
  {
    immediate: true,
  }
)
</script>

<style scoped lang="scss">
.condidtion-cell {
  font-size: 12px !important;
  margin: 20px 0;

  .label {
    min-width: 80px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
  }
}

// .targetvalue-select {
//   :deep(.el-input) {
//     width: 120px;
//   }
// }

.relation-select {
  width: 80px;
  :deep(.el-input) {
    width: 60px;
  }
}

.operator-select {
  :deep(.el-input) {
    width: 60px;
  }
}
</style>
