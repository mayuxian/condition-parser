import { assert, expect, test } from 'vitest'
import { ConditionParser, Condition, Expression } from '../src/condition-parser';

const conditions = [
    new Condition([
        {
            key: 'age',
            targetValue: 30,
            operator: '==',
            relation: ''
        },
        {
            key: 'score',
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
const conds = condiParser.generate()

test('data:{age:30,score:90} calc {age=30&&score=90} expect:true', () => {
    condiParser.conditions[0].expressions[1].relation = "&&"
    const data = {
        age: 30,
        score: 90
    }
    condiParser.execute((expr: Expression) => {
        return data[expr.key]
    })
    const pass = condiParser.conditions.at(0)?.pass
    expect(pass).toBe(true)
})

test('data:{age:30,score:90} calc {age=30&&score=99} expect:false', () => {
    condiParser.conditions[0].expressions[1].relation = "&&"
    const data = {
        age: 30,
        score: 99
    }
    condiParser.execute((expr: Expression) => {
        return data[expr.key]
    })
    const pass = condiParser.conditions.at(0)?.pass
    expect(pass).toBe(false)
})
test('data:{age:30,score:90} calc {age=30||score=99}  expect:true', () => {
    condiParser.conditions[0].expressions[1].relation = "||"
    const data = {
        age: 30,
        score: 99
    }
    condiParser.execute((expr: Expression) => {
        return data[expr.key]
    })
    const pass = condiParser.conditions.at(0)?.pass
    expect(pass).toBe(true)
})