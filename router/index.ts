interface routes {
    [path: string]: any;
}

const isFunc = obj => ({}.toString.call(obj) === '[object Function]');

export default class Router {

    #vars;
    #path;
    #separator;
    #routes;
    #routesNames;
    #match;
    ouput;

    constructor(routes: routes) {

        this.#separator = routes.separator || '/';
        this.#routes = routes;
        this.#routesNames = Object.keys(routes);

        return this;
    }

    compare(path) {

        this.#path = path;
        this.#match = this.#routesNames.find(route => {

            const // 
                vars = {},
                joker = `[^${this.#separator}]*`,
                pathparts = this.#path.split(this.#separator),
                routeparts = route.split(this.#separator),
                routeformat = routeparts.map((part, index) => {
                    if (!part)
                        return '';
                    if (part === "*")
                        return joker;
                    if (part.charAt(0) === ':') {
                        const varname = part.slice(1);
                        vars[varname] = pathparts[index];
                        return joker;
                    }
                    return part;
                }).join(this.#separator),
                route_re = new RegExp(`^${routeformat}$`),
                match = route_re.test(this.#path);
            if (match) {
                this.#path.split(this.#separator);
                this.#vars = vars;
            }

            return match;
        });

        const // 
            routeparams = this.#routes[this.#match],
            output = isFunc(routeparams) ? routeparams(this.#vars) : routeparams,
            outputWithVars = { ...this.#vars, ...output,route_vars: this.#vars,path:this.#path,separator:this.#separator,route:this.#match };
            this.ouput = outputWithVars;


        return this.ouput;

    }

}