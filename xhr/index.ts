class Xhr {

    #headers: object;
    #format: string;

    constructor() {
        this.#headers = {};
        this.#format = 'json';
        return this;
    }

    setHeaders(headers: object) {
        for (let header in headers)
            this.#headers[header] = headers[header];
        return this;
    }


    async get(url: string): Promise<any> {
        try {
            const // 
                options = {
                    method: 'get',
                    headers: this.#headers
                },
                response = await fetch(url, options);

            if (!response.ok) {
                const message = 'Error with Status Code: ' + response.status;
                throw new Error(message);
            }

            const //
                format = this.#format in response ? this.#format : 'json',
                data = await response[format]();
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    async post(url: string, obj: object): Promise<any> {
        try {
            const // 
                body = JSON.stringify(obj),
                options = {
                    method: 'post',
                    headers: this.#headers,
                    body
                },
                response = await fetch(url, options);

            if (!response.ok) {
                const message = 'Error with Status Code: ' + response.status;
                throw new Error(message);
            }

            const //
                format = this.#format in response ? this.#format : 'json',
                data = await response[format]();
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    async put(url: string, obj: object): Promise<any> {
        try {
            const // 
                body = JSON.stringify(obj),
                options = {
                    method: 'put',
                    headers: this.#headers,
                    body
                },
                response = await fetch(url, options);

            if (!response.ok) {
                const message = 'Error with Status Code: ' + response.status;
                throw new Error(message);
            }

            const //
                format = this.#format in response ? this.#format : 'json',
                data = await response[format]();
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    async delete(url: string): Promise<any> {
        try {
            const // 
                options = {
                    method: 'delete',
                    headers: this.#headers
                },
                response = await fetch(url, options);

            if (!response.ok) {
                const message = 'Error with Status Code: ' + response.status;
                throw new Error(message);
            }

            return {};

        } catch (error) {
            console.log(error);
        }
    }

};

export default Xhr;