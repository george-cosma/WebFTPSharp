import { html, css, LitElement } from 'lit';
import { customElement, property, queryAsync } from 'lit/decorators.js';

@customElement('folder-el')
export class FolderElement extends LitElement {
    static styles = css`
        .folder-item{
            display: flex;
            margin: 2px 0;
        }

        .folder-item-image {
            width: 24px;
            height: 24px;
            margin-right: 10px;
            align-self: center;
        }

        .folder-item-name {
            margin: 0;
            font-family: monospace;
            font-size: 16px;
            color: black;
            font-weight: bold;
        }

        .folder-item-name:hover {
            cursor: pointer;
        }
    `

    @property()
    folder_name = '';

    @queryAsync('.folder-item')
    getBody: Promise<HTMLElement>;


    render() {
        return html`
            <div class="folder-item">
                <img class="folder-item-image" src="/images/folder.png"/>
                <a class="folder-item-name">${this.folder_name}</a>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "folder-el": FolderElement;
    }
}