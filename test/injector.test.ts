import 'reflect-metadata';
import { injectProps } from '../src/injector';

interface PropertyDetail {
    name: string,
    type: string
}

class TestEntity {
    readonly id?: string;
    public constructor() {
    }
}

test('injectProps injects typegoose props to prototype', () => {
    const propertyName = 'id';
    const properties: PropertyDetail[] = [
        {
            name: propertyName,
            type: 'string'
        }
    ];

    const propertyMap = new Map();

    propertyMap.set(propertyName, {
        origOptions: {},
        Type: String,
        target: TestEntity.prototype,
        key: propertyName,
        whatis: 2
    });
    injectProps(TestEntity, properties);
    expect(Reflect.getMetadata('design:type', TestEntity.prototype, 'id')).toBe(String);
    expect(Reflect.getMetadata('typegoose:properties', TestEntity.prototype)).toEqual(propertyMap);
})