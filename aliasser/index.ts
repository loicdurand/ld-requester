import { RequesterInterface, OptionsInterface } from "./Interface";

import SchemaParser from './schema-parser';

const // 
    isFunc = fn => typeof fn === 'function',
    isObj = (value = false) => value && value.constructor === ({}).constructor,
    isValid = (data, schema) => {

        let // 
            formattedData = {},
            invalidFields = [],
            isValidObj = true;

        for (let prop in schema) {
            if (schema && schema[prop]) {
                const // 
                    value = schema[prop](data[prop], data),
                    isValidProp = isObj(value) && value.hasOwnProperty('isValid') ? value.isValid : true;
                isValidObj = !isValidObj ? false : isValidProp;
                if (isValidProp) {
                    formattedData[prop] = value;
                } else {
                    const // 
                        { value: _value } = value,
                        { value: val, field, error } = _value || value;
                    invalidFields.push({ field, value: val, error });
                }
            } else {
                formattedData[prop] = data[prop];
            }
        }
        return [isValidObj, formattedData, invalidFields];
    };

export default class Aliasser {

    requester: RequesterInterface;
    loader;

    constructor(options: OptionsInterface) {

        const // 
            { requester, schema, loader = {
                loading: false
            } } = options;

        this.requester = requester;
        this.loader = loader;

        if (schema) {
            this.schema = schema;
        }

        return this;

    }

    set schema(schema) {
        const // 
            schemaParser = new SchemaParser(schema),
            { schemas } = schemaParser;
        this.setTables(schema, schemas);
    }

    setTables(schema, schemas) {

        const { methods: methodsGetter, tables } = schema;

        tables.forEach(({ table, url, schema }) => {

            const // 
                { events = {} } = schema || {},
                loader = this.loader,
                loaderContainer = loader.element || document.getElementById(loader.spinnerId),
                showLoader = (method) => {

                    if (loaderContainer && isFunc(events[method])) {
                        events[method](loaderContainer);
                        loader.loading = true;
                    }
                },

                requester = {

                    get: async (url) => {

                        showLoader('get');

                        try {
                            const result = await this.requester.get(url);
                            loader.loading = false;
                            return result;
                        } catch (error) {
                            loader.loading = false;
                            return error;
                        }


                    },

                    post: async (url, data) => {

                        showLoader('post');

                        try {
                            const [isValidObj, postedObj = {}, invalidFields = []] = isValid(data, schemas[table]);

                            if (isValidObj) {
                                const result = await this.requester.post(url, postedObj);
                                loader.loading = false;
                                return result;
                            }
                            loader.loading = false;
                            return { isValid: isValidObj, fields: invalidFields };
                        } catch (error) {
                            loader.loading = false;
                            return error;
                        }

                    },

                    put: async (url, data) => {

                        showLoader('put');

                        try {
                            const [isValidObj, postedObj = {}, invalidFields = []] = isValid(data, schemas[table]);

                            if (isValidObj) {
                                const result = await this.requester.put(url, postedObj);
                                loader.loading = false;
                                return result;
                            }
                            loader.loading = false;
                            return { isValid: isValidObj, fields: invalidFields };
                        } catch (error) {
                            loader.loading = false;
                            return error;
                        }

                    },

                    delete: async (url) => {

                        showLoader('delete');

                        try {
                            const result = await this.requester.delete(url);
                            loader.loading = false;
                            return result;
                        } catch (error) {
                            loader.loading = false;
                            return error;
                        }

                    }

                },
                methods = methodsGetter(url, requester);

            this[table] = methods;

        });

        return this;

    }

}