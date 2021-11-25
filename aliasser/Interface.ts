export interface PropertyInterface {
    required?: boolean;
    type?: any;
    validate?: (arg: any) => boolean;
    format?: (prop: any, obj: object) => any;
    description?: string | ((arg: any) => string);
};

export interface SchemaInterface {
    required?: Array<string>,
    properties?: {
        [prop: string]: PropertyInterface
    }
};

export interface RequesterInterface {
    get(URL: string): Promise<unknown>;
    post(URL: string, data: object): Promise<unknown>;
    put(URL: string, data: object): Promise<unknown>;
    delete(URL: string): Promise<unknown>;
    [other: string]: any;
};

export interface TableInterface {
    table: string;
    url: string;
    schema?: SchemaInterface;
};

export interface OptionsInterface {
    requester: RequesterInterface;
    schema: {
        methods: any;
        tables: Array<TableInterface>
    };
    loader?: any;
};
