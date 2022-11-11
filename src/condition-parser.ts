export class ConditionParser {
  conditions: Condition[] = []

  constructor(conditions: Condition[] = []) {
    this.conditions = conditions || []
  }

  /**
   * 生成条件json字符串
   * @returns
   */
  generate(): string {
    const newConditions =
      this.conditions?.map((x: Condition) => {
        const firstExpr = x.expressions.at(0)
        if (firstExpr) {
          firstExpr.relation = ''
        }
        return {
          expressions: x.expressions || [],
          matchResult: x.matchResult || [],
        }
      }) || []
    return JSON.stringify(newConditions || [])
  }

  /**
   * 反序列化  字符串转对象
   * @param jsonStr
   * @returns
   */
  parse(jsonStr: string): Condition[] {
    try {
      this.conditions = jsonStr ? JSON.parse(jsonStr) : []
    } catch (err: any) {
      this.conditions = []
      const error = new Error('转换失败')
      error.stack = err.stack
      throw error
    }
    return this.conditions
  }

  /**
   * 执行表达式得到各个条件的结果
   * Condition中pass属性，true表示比较通过，false表示比较未通过
   * Condition中matchResult属性，表示存储的条件满足时的的结果
   * @param resolveRealValue  通过表达式中的key解析返回实际数据的值
   */
  execute(resolveRealValue: (
      expression: Expression
    ) => string | number | null | undefined
  ) {
    this.conditions?.forEach((x: Condition) => {
      x.pass = this.executeCondition(x.expressions, resolveRealValue)
    })
    return this.conditions
  }

  private executeCondition(
    expressions: Expression[],
    resolveRealValue: (expression: Expression) => any
  ) {
    let conditionExp = ''
    for (let i = 0; i < expressions.length; i++) {
      const exp = expressions[i]
      const realVal = resolveRealValue(exp)
      conditionExp += ` ${i === 0 ? '' : exp.relation} ${exp.targetValue} ${
        exp.operator
      } ${realVal} `
    }
    const exprStr = `(function (){return ${conditionExp};})();`
    return eval(exprStr)
  }
}
export class Condition {
  /**
   * 表达式
   */
  expressions: Expression[]
  /**
   * 匹配成功后的结果
   */
  matchResult?: string | number|Array<string | number>
  /**
   * 目标值的选择项
   * @desc 条件中提供目标值列表选项是为了支持每项条件中 目标值下拉选择项不一致的功能
   */
  sourceOptions?: Array<SelectOption>
  /**
   * 目标值的选择项
   * @desc 条件中提供目标值列表选项是为了支持每项条件中 目标值下拉选择项不一致的功能
   */
  targetOptions?: Array<SelectOption>
  /**
   * 匹配结果的选择项
   * @desc 条件中提供目标值列表选项是为了支持每项条件中 目标值下拉选择项不一致的功能
   */
  matchOptions?: Array<SelectOption>
  /**
   * 条件是否满足，true：满足，false：不满足
   */
  pass?: boolean

  constructor(
    expressions: Expression[] = [],
    matchResult: Array<any> = [],
  ) {
    // Object.defineProperty(this, 'pass', { enumerable: false })
    // Object.defineProperty(this, 'matchOptions', { enumerable: false })
    // Object.defineProperty(this, 'targetOptions', { enumerable: false })
    this.expressions = expressions
    this.matchResult = matchResult
  }
}
export type SelectOption = {
  label: string
  value: string | number | null | undefined
}
export type OperatorType = '==' | '<' | '<=' | '>' | '>='
export type RelationType = '' | '&&' | '||'
/**
 * 表达式
 * @desc
 */
export class Expression {
  relation: RelationType = '&&'
  sourceValue: string | number = ''
  sourceName?: string  = ''
  targetValue: string | number | null | undefined
  operator: OperatorType = '=='

  constructor(opts?: {
    sourceValue: string
    sourceName: string
    targetValue?: string | number | null | undefined
    operator?: OperatorType
    relation?: RelationType
  }) {
    //属性name不可枚举，表示JSON.stringify序列化时不会输出name，name是变化的需要每次初始化时重新赋值
    // Object.defineProperty(this, 'label', { enumerable: false })
    if (!opts) {
      return
    }
    this.sourceValue = opts?.sourceValue || ''
    this.sourceName = opts?.sourceName || ''
    this.targetValue = opts?.targetValue || null
    this.operator = opts?.operator || '=='
    this.relation = opts?.relation || '&&'
  }
}
