import 'reflect-metadata';
import * as types from '../../common.types.generated';
import safe from '@smartlyio/safe-navigation';
import * as oas from 'openapi3-ts';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as _ from 'lodash';

const openApiFilePath = './openapi.yml';

interface Types {
    [key: string]: Function
}

interface SchemaDetail {
    name: string,
    properties: PropertyDetail[]
}

interface PropertyDetail {
    name: string,
    type: string
}

const typeDefinitions: Types = types;

export default function injectTypegooseDecorators(): void {
    const schemaDetails = fetchSchemaDetails();
    
    schemaDetails.forEach(schema => {
        injectProps(typeDefinitions[schema.name], schema.properties);
    })
}

export function injectProps(valueFunction: Function, classProperties: PropertyDetail[]) {
    const valueClass = valueFunction.prototype

    let propertyMap = new Map();
    let propMetadata;
    
    classProperties.forEach((classProperty) => {
        const propertyType = mapType(classProperty.type) || typeDefinitions[classProperty.type];
        const key = classProperty.name;
        propMetadata = {
            origOptions: {},
            Type: propertyType,
            target: valueClass,
            key: key,
            whatis: 2
        }    
        Reflect.defineMetadata('design:type', propertyType, valueClass, key);
        propertyMap.set(key, propMetadata);
    }) 
    Reflect.defineMetadata('typegoose:properties', propertyMap, valueClass);
    console.log(`Injected typegoose decorator to ${valueFunction.name}`)
}

function fetchSchemaDetails(): SchemaDetail[] {
    const file = fs.readFileSync(openApiFilePath, 'utf8');
    const spec: oas.OpenAPIObject = yaml.load(file);
    const schemas = safe(spec).components.schemas.$;

    if (!schemas) {
        return [];
    }

    const schemaDetails: any[] = Object.keys(schemas).map(key => {
        const schemaProperties = safe(schemas[key]).properties.$;
        if (!schemaProperties) {
           return [];
        }

        const schemaPropertyDetails = Object.keys(schemaProperties).map(propName => {
            const safeProps = safe(schemaProperties[propName]);
            let propType = '';

            if (!safeProps.type.$) {
                const propRef = safeProps['$ref'].$
                if (!propRef) {
                    return '';
                }
                propType = derefType(propRef)
            } else {
                propType = safeProps.type.$
            }

            return {
                name: propName,
                type: propType
            }
        })
        return {
            name: key,
            properties: schemaPropertyDetails
        };
    })

    return schemaDetails;
}

function mapType(type: string) {
    switch(type) {
        case 'string':
            return String
        case 'integer':
            return Number
        case 'object':
            return Object
        default:
            return undefined
    }
}

function derefType(propertySpec: string) {
    return propertySpec.split('schemas/')[1];
}