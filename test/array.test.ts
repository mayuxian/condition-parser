import { assert, expect, test } from 'vitest'
import { ConditionParser, Condition, Expression } from '../src/condition-parser'

const conditions = [
    new Condition([
        {
            key: 'aaa',
            targetValue: 30,
            operator: '==',
            relation: ''
        },
        {
            key: 'bbb',
            targetValue: '90',
            operator: '==',
            relation: '&&'
        }
    ], [
        '1111',
        '2222'
    ]),
]
const condiParser = new ConditionParser(conditions);

test("data:[{id:'aaa',value:30},{id:'bbb',value:90},] calc {age=30 && score=90}  expect:true", () => {
    condiParser.conditions[0].expressions[1].relation = "&&"
    const arr = [{
        id: 'aaa',
        value: 30
    }, {
        id: 'bbb',
        value: 90
    }]
    condiParser.execute((expr: Expression) => {
        return arr.find((x:any)=>x.id===expr.key)?.value
    })
    const pass = condiParser.conditions.at(0)?.pass
    expect(pass).toBe(true)
})

test("data:[{id:'aaa',value:30},{id:'bbb',value:99},] calc {age=30 && score=99}  expect:false", () => {
    condiParser.conditions[0].expressions[1].relation = "&&"
    const arr = [{
        id: 'aaa',
        value: 30
    }, {
        id: 'bbb',
        value: 99
    }]
    condiParser.execute((expr: Expression) => {
        return arr.find((x:any)=>x.id===expr.key)?.value
    })
    const pass = condiParser.conditions.at(0)?.pass
    expect(pass).toBe(false)
})
test("data:[{id:'aaa',value:30},{id:'bbb',value:99},] calc {age=30 || score=99}  expect:true", () => {
    condiParser.conditions[0].expressions[1].relation = "||"
    const arr = [{
        id: 'aaa',
        value: 30
    }, {
        id: 'bbb',
        value: 99
    }]
    condiParser.execute((expr: Expression) => {
        return arr.find((x:any)=>x.id===expr.key)?.value
    })
    const pass = condiParser.conditions.at(0)?.pass
    expect(pass).toBe(true)
})