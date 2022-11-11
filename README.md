# condition-parser
用于执行表达式的js库

 [Demo链接](https://mayuxian.github.io/condition-parser/)  
 [源码](https://github.com/mayuxian/condition-parser)  
## Installing

Using npm:

```bash
$ npm install condition-parser
```

Using bower:

```bash
$ bower install condition-parser
```

Using yarn:

```bash
$ yarn add condition-parser
```


 ##  Demo

 ###  init data  (Vue3)  初始数据
 ``` javascript
 const conditions: Ref<Condition[] | undefined> = ref()
 function init() {
  const cond1 = new Condition()
  cond1.expressions = [
    new Expression({
      key: '1',
      label: '',
      relation: '&&',
    }),
    new Expression({ key: '2', label: '' }),
  ]
  const cond2 = new Condition()
  cond2.expressions = [
    new Expression({
      key: '3',
      label: '',
      relation: '||',
    }),
    new Expression({ label: '', key: '4' }),
  ]
  conditions.value = [cond1, cond2]
}
init()
 ``` 
### generate json    生成json数据
``` javascript
  const condiParser = new ConditionParser(conditions.value || [])
  const jsonStr = condiParser.generate()
  console.log('condiParser.generate ', jsonStr)
```

### reload and invert   加载反显
``` javascript
 const jsonStr=''; //条件json字符串
 const invertConditions: Ref<Condition[] | undefined> = ref();
 const conditionArray = condiParser.parse(jsonStr)
  invertConditions.value = conditionArray

```

### execute and check  执行校验
``` javascript
 const jsonStr=''; //条件json字符串
 const conditions = condiParser.parse(jsonStr)

 const condiParser = new ConditionParser(conditions|| [])
  const result = condiParser.execute((expr: Expression) => {
    return jsonData.find((x: any) => x.id === expr.sourceValue)?.realValue
  })
  console.log('condiParser.execute ', result)
  //每项condition.pass 来判断是会通过
```