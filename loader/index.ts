const //
    onReady = async (selector: string): Promise<Element> => {
        while (document.querySelector(selector) === null)
            await new Promise(resolve => requestAnimationFrame(resolve))
        return document.querySelector(selector);
    },
    sheet = document.head.appendChild(document.createElement("style")).sheet,
    insertRule = rule => sheet.insertRule(rule, sheet.cssRules.length),
    isFunc = object => ['[object AsyncFunction]', '[object Function]'].includes(({}).toString.call(object)),
    unicId = (len: number = 7): string => Math.random().toString(36).substr(2, 2 + len),
    container = document.createElement('div'),
    containerId = `loader-${unicId()}`;
container.classList.add('loader');
container.id = containerId;
container.hidden = true;

insertRule(`
    #${containerId}{
        position: fixed;
        text-align: center;
        top: 20%;
        padding: 1rem 2rem;
        background-color: rgba(0, 0, 145, 0.05);
        color: rgba(0, 0, 145, 0.7);
        border-radius: 3px;
        font-size: 18px;
        right: 20%;
    }`
);

export default class Loader {

    spinnerId: string;
    spinner: HTMLElement;
    minDuration: number = 1200;
    visibleSince: number = 0;

    constructor(minDurationMs: number) {
        onReady('body').then(body => {
            this.spinner = document.getElementById(this.spinnerId) || document.querySelector('body').appendChild(container);
        });
        this.visibleSince = 0;
        this.minDuration = minDurationMs;
        this.spinnerId = `loader-${unicId()}`;
        return this;
    }

    get element() {
        return this.spinner;
    }

    get minDurationMs() {
        return this.minDuration;
    }

    get loading() {
        return !this.spinner.hidden;
    }

    set loading(bool: boolean) {
        if (!bool) {
            let // 
                actualTimestamp = Date.now(),
                timeoutDelay = this.minDuration + this.visibleSince - actualTimestamp;

            setTimeout(() => {
                this.spinner.innerHTML = '';
                this.spinner.hidden = true;
            }, timeoutDelay > 0 ? timeoutDelay : 0);

        } else {
            this.visibleSince = Date.now();
            this.spinner.hidden = !bool;
        }
    }

    set content(content: string | HTMLElement | ((elt: any) => any)) {
        this.spinner.innerHTML = '';
        this.loading = true;
        if (typeof content === 'string')
            this.spinner.innerHTML = content;
        else if (content instanceof Element)
            this.spinner.appendChild(content);
        else if (isFunc(content))
            content(this.spinner);
    }
};