import { PropertyInterface, SchemaInterface } from "./Interface";

export default class SchemaParser {

    schemas: any;

    constructor(globalSchema) {

        const // 
            { tables } = globalSchema,
            //
            exists = value => value ? true : false,
            isType = {
                string: (value: any = false) => value.constructor === "test".constructor,
                array: (value: any = false) => value.constructor === [].constructor,
                object: (value: any = false) => value.constructor === ({}).constructor,
                number: (value: any = false) => !Number.isNaN(value),
                boolean: (value: any = false) => [true, false].includes(value),
                function: (value: any = false) => typeof value === 'function',
                primitive: (value: any = false) => typeof value === 'function' && value.constructor === Function && ['String', 'Number', 'Boolean'].includes(value.name),
            },
            compose = (functions = []) => (x, o) => functions.reduceRight((acc, fn) => fn(acc, o), x);


        this.schemas = {};

        tables.forEach((table: { table: string, schema: SchemaInterface }) => {

            const { table: tablename, schema = {} } = table;

            schema.required = schema.required || [];
            schema.properties = schema.properties || {};
            this.schemas[tablename] = {};

            schema.required.forEach(field => {
                if (!schema.properties.hasOwnProperty(field))
                    schema.properties[field] = {
                        required: true
                    };
                else
                    schema.properties[field].required = schema.properties[field].required || true;
            });

            Object.entries(schema.properties).forEach(([field, constraints = {}]: [string, PropertyInterface]) => {

                const functions = [];

                if (!this.schemas[tablename].hasOwnProperty(field))
                    this.schemas[tablename][field] = [];

                // REQUIRED
                if (constraints.required)
                    functions.push(value => exists(value) ? value : { isValid: false, field, value, error: 'required' });

                // TYPE
                if (constraints.type) {
                    let type: any = '';
                    if (isType.string(constraints.type)) {
                        type = constraints.type;
                        type = type.toLowerCase();
                    } else if (isType.primitive(constraints.type)) {
                        type = constraints.type.name.toLowerCase();
                    }

                    functions.push(value => {
                        if (!constraints.required && !value)
                            return value;

                        return isType[type](value) ? value : { isValid: false, field, value, error: 'type' }
                    });
                }

                // VALIDATE
                if (constraints.validate)
                    functions.push(value => {
                        if (!constraints.required && !value)
                            return value;

                        return constraints.validate(value) ? value : { isValid: false, field, value, error: 'validate' }
                    });

                // FORMAT
                if (constraints.format)
                    functions.push((value, obj) => {
                        if (!constraints.required && !value)
                            return value;

                        return constraints.format(value, obj);
                    });

                this.schemas[tablename][field] = compose(functions);

            });

        });

        return this;

    }

}