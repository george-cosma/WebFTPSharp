import { html, css, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('file-el')
export class FileElement extends LitElement {
    static styles = css`
        .file-item {
            display: flex;
        }

        .file-item-image {
            width: 24px;
            height: 24px;
            margin-right: 10px;
            align-self: center;
        }

        .file-item-name {
            margin: 0;
            font-family: monospace;
            font-size: 16px;
            color: black;
        }

        .file-item-name:hover {
            cursor: pointer;
        }
`

    @property()
    file_name = '';

    @property()
    file_id = '';

    @query('.file-item')
    body;


    render() {
        return html`
            <div class="file-item">
                <img class="file-item-image" src="/images/file.png"/>
                <a class="file-item-name">${this.file_name}</a>
            </div>
        `;
    }
}

declare global {
    interface FileElementTagNameMap {
        "file-el": FileElement;
    }
}