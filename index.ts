import _Requester from './xhr';
import _Aliasser from './aliasser';
import _Loader from './loader';

export const // 
    Loader = _Loader,
    Aliasser = _Aliasser,
    Requester = _Requester;

export default class {

    aliasser;

    constructor(schema, loaderMinDurationMs=1200) {

        const // 
            loader = new Loader(loaderMinDurationMs),
            requester = new Requester()
                .setHeaders({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                });

        if (schema) {
            this.aliasser = new Aliasser({ requester, loader });
            this.aliasser.schema = schema;
            return this.aliasser
        }

        return this;

    }
}