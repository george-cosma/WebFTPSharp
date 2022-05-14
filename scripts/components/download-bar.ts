import { html, css, LitElement } from 'lit';
import { customElement, property, queryAsync } from 'lit/decorators.js';

@customElement('download-bar')
export class DownloadBarElement extends LitElement {

    @property()
    percentage = 0;

    render() {
        return html`
            <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${this.percentage}%">${this.percentage}%</div>
            </div>
        `;
    }
    createRenderRoot() {
        return this;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "download-bar": DownloadBarElement;
    }
}