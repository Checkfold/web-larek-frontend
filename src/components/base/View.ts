export class View<T> {
    constructor(protected readonly container: HTMLElement) {}

    switchClass(cssClass: string) {
        this.container.classList.toggle(cssClass);
    }

    protected updateTextContent(element: HTMLElement, content: unknown) {
        if (element) {
            element.textContent = String(content);
        }
    }

    protected changeImageSource(imgElement: HTMLImageElement, source: string) {
        if (imgElement) {
            imgElement.src = source;
        }
    }

    render(data?: T): HTMLElement {
        if (data) {
            Object.assign(this, data);
        }
        return this.container;
    }
}