import { html, css, LitElement } from 'lit';
import { customElement, property, queryAsync } from 'lit/decorators.js';

@customElement('download-bar')
export class DownloadBarElement extends LitElement {

	@property()
	public filename: string = "File.txt";

	@property()
	protected percentage = 0;

	@property()
	protected downloaded = "0 KB";
	@property()
	protected total = "0 KB";

	@property()
	protected speed = "0 KB/s";
	@property()
	protected eta = "0 seconds";

	private totalSet = false;

	private lastUpdateTime: number = -1;
	private lastUpdateBytes: number = -1;

	public updateProgress(downloadedBytes: number, totalBytes: number): void {
		if (!this.totalSet) {
			this.total = this.bytesToString(totalBytes);
			this.totalSet = true;
		}

		this.downloaded = this.bytesToString(downloadedBytes);
		this.percentage = Math.floor(downloadedBytes / totalBytes * 100);

		if (this.lastUpdateTime == -1 || this.lastUpdateBytes == -1) {
			this.speed = " 0 KB/s";
			this.eta = "?";

			this.lastUpdateBytes = downloadedBytes;
			this.lastUpdateTime = Date.now();
		} else if (Date.now() - this.lastUpdateTime >= 1000) {
			const secondsPassed = (Date.now() - this.lastUpdateTime) / 1000;
			const newBytes = downloadedBytes - this.lastUpdateBytes;
			const bytesPerSecond = newBytes / secondsPassed;

			this.speed = this.bytesToString(bytesPerSecond) + "/s";
			this.eta = this.millisToString(totalBytes / bytesPerSecond);

			this.lastUpdateBytes = downloadedBytes;
			this.lastUpdateTime = Date.now();
		}

	}

	private bytesToString(bytes: number): string
	{
		// 1 byte
		// 1.000 bytes = 1 KB
		// 1.000.000 bytes = 1 MB
		// 1.000.000.000 bytes = 1 GB

		// Truncate to GBs?
		if (bytes / 1000000000 >= 1) {
			return (Math.floor(bytes / 1000000000 * 100) / 100).toString() + " GB";
		} else if (bytes / 1000000 >= 1) {
			return (Math.floor(bytes / 1000000 * 100) / 100).toString() + " MB";
		} else if (bytes / 1000 >= 1) {
			return (Math.floor(bytes / 1000 * 100) / 100).toString() + " KB";
		} else {
			return bytes + " B";
		}
	}
	private millisToString(seconds: number): string {
		// 1 second
		// 60 seconds = 1 minute
		// 3600 seconds = 1 hour
		if (seconds / 3600 >= 1) {
			return (Math.floor(seconds / 3600 * 10) / 10).toString() + " hours";
		} else if (seconds / 60 >= 1) {
			return Math.floor(seconds / 60).toString() + " minutes";
		} else {
			return Math.floor(seconds).toString() + " seconds";
		}
	}

	render() {
		return html`
<div class="bar-holder card m-2">
	<div class="card-img-top p-1">
		<p class="bar-file-text">${this.filename}</p>
		<div class="mx-2 d-flex justify-content-between align-items-center">
			<div class="d-flex">
				<div class="pr-2">
					<p class="bar-stats-text text-right">Downloaded:</p>
					<p class="bar-stats-text text-right">Total:</p>
				</div>
				<div>
					<p class="bar-stats-text">${this.downloaded}</p>
					<p class="bar-stats-text">${this.total}</p>
				</div>
			</div>
			<div class="d-flex">
				<div class="pr-2">
					<p class="bar-stats-text text-right">Speed:</p>
					<p class="bar-stats-text text-right">ETA:</p>
				</div>
				<div>
					<p class="bar-stats-text">${this.speed}</p>
					<p class="bar-stats-text">${this.eta}</p>
				</div>
			</div>
		</div>
	</div>
	<!-- Bar -->
	<div class="d-flex align-items-center p-1">
		<div class="progress flex-fill align-content-center">
			<div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: ${this.percentage}%"></div>
		</div>
		<p class="bar-percent-text align-content-center">${this.percentage}%</p>
	</div>
</div>
`;
	}

	// Attaches this object directly to DOM, making bootstrap available to it.
	createRenderRoot() {
		return this;
	}
}


@customElement('upload-bar')
export class UploadBarElement extends DownloadBarElement {
	render() {
		return html`
<div class="bar-holder card m-2">
	<div class="card-img-top p-1">
		<p class="bar-file-text">${this.filename}</p>
		<div class="mx-2 d-flex justify-content-between align-items-center">
			<div class="d-flex">
				<div class="pr-2">
					<p class="bar-stats-text text-right">Downloaded:</p>
					<p class="bar-stats-text text-right">Total:</p>
				</div>
				<div>
					<p class="bar-stats-text">${this.downloaded}</p>
					<p class="bar-stats-text">${this.total}</p>
				</div>
			</div>
			<div class="d-flex">
				<div class="pr-2">
					<p class="bar-stats-text text-right">Speed:</p>
					<p class="bar-stats-text text-right">ETA:</p>
				</div>
				<div>
					<p class="bar-stats-text">${this.speed}</p>
					<p class="bar-stats-text">${this.eta}</p>
				</div>
			</div>
		</div>
	</div>
	<!-- Bar -->
	<div class="d-flex align-items-center p-1">
		<div class="progress flex-fill align-content-center">
			<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${this.percentage}%"></div>
		</div>
		<p class="bar-percent-text align-content-center">${this.percentage}%</p>
	</div>
</div>
`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"download-bar": DownloadBarElement;
		"upload-bar": DownloadBarElement;
	}
}