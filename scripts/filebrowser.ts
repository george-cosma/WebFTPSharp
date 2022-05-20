import { connect } from "http2";
import Path from "./models/path"
import NavigationItem from "./models/navigation_item"
import NavigationItemType from "./models/navigation_item_type"
const axios = require("axios");




let path: Path = new Path();
const signalR = require("@microsoft/signalr");
const connection = new signalR.HubConnectionBuilder()
					.withUrl("/api/hubs/filebrowser")
					.build();


const fileBrowser = document.getElementById("file-browser");
const downloadBarArea = document.getElementById("download-bar-area");
const uploadBarArea = document.getElementById("upload-bar-area");

const fileNameInput = document.getElementById("input-filename") as HTMLInputElement;
const fileInput = document.getElementById("input-file") as HTMLInputElement;
const uploadSubmitButton = document.getElementById("input-submit");

// Download
connection.on("FilesUpdated", function () {
	requestFiles(path);
});

connection.on("RequestFilesResponse", function (message: Array<NavigationItem>) {
	while (fileBrowser.lastChild) {
		fileBrowser.lastChild.remove();
	}

	if (!path.isRoot()) {
		let folder = document.createElement("folder-el");
		folder.folder_name = "..";
		folder.getBody.then(el => el.addEventListener("click", function (event) {
			path.navigateBackwards();
			requestFiles(path);

			event.preventDefault();
		}));

		fileBrowser.appendChild(folder);
	}

	message.forEach(item => {
		if (item.itemType == NavigationItemType.FOLDER) {
			let folder = document.createElement("folder-el");
			folder.folder_name = item.name;

			folder.getBody.then(el => el.addEventListener("click", function (event) { 
				path.navigate(item.name);
				requestFiles(path);

				event.preventDefault();
			}));

			fileBrowser.appendChild(folder);
		}
	});

	message.forEach(item => {
		if (item.itemType == NavigationItemType.FILE) {
			let file = document.createElement("file-el");
			file.file_name = item.name;
			file.file_id = item.id;

			file.getBody.then(el => el.addEventListener("click", function (event) {

				let dlBar = document.createElement("download-bar");
				dlBar.filename = file.file_name;
				downloadBarArea.appendChild(dlBar);

				axios.request({
					method: "post",
					url: "/api/download",
					headers: {
						'Content-Type': 'application/json'
					},
					data: JSON.stringify({ id: file.file_id }),
					onDownloadProgress: (p) => {
						// https://stackoverflow.com/a/63067578
						const total = p.total;
						const current = p.loaded;
						
						dlBar.updateProgress(current, total);
					},
					responseType: "blob"
				})
				.then(res => {
					return res.data;
				})
				.then(blob => {
					// TODO: Remove this jank
					var url = window.URL.createObjectURL(blob);
					var a = document.createElement('a');
					a.href = url;
					a.download = file.file_name;
					document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
					a.click();
					a.remove();  //afterwards we remove the element again 


					dlBar.remove();
				});

				event.preventDefault();
			}));
			fileBrowser.appendChild(file);
		}
	});
});

// Refresh Files
function requestFiles(reqPath: Path): void {
	connection.invoke("RequestFiles", path.path)
		.catch(function (err) {
			return console.error(err.toString());
		});
}

// Upload
fileInput.addEventListener("change", (e) => {
	if (fileInput.files.length > 0 && fileInput.files[0].name != null) {
		fileNameInput.disabled = false;
		fileNameInput.value = fileInput.files[0].name;
	} else {
		fileNameInput.disabled = true;
		fileNameInput.value = null;
	}
})

uploadSubmitButton.addEventListener("click", (e) => {
	if (fileInput.files.length > 0 && fileInput.files[0].name != null && fileNameInput.value != null && fileNameInput.value != '') {
		let filename = fileNameInput.value;
		let file = fileInput.files[0];

		let uploadBar = document.createElement("upload-bar");
		uploadBar.filename = filename;
		uploadBarArea.appendChild(uploadBar);

		let formData = new FormData();

		for (let i = 0; i < path.path.length; i++) {
			formData.append(`path[${i}]`, path.path[i]);
		}

		formData.append("filename", filename)
		formData.append("file", file);

		axios.request({
			method: "post",
			url: "/api/upload",
			headers: {
				'Content-Type': 'multipart/form-data; boundary'
			},
			data: formData,
			onUploadProgress: (p) => {
				const total = p.total;
				const current = p.loaded;

				uploadBar.updateProgress(current, total);
			}
		})
		.catch(e => {
			uploadBar.remove();
		})
		.then(res => {
			uploadBar.remove();
		});

		fileInput.value = null;
		fileNameInput.value = null;
		fileNameInput.disabled = true;
	}



	e.preventDefault();
})

connection.start()
	.catch(err => console.error(err.toString()))
	.then(() => requestFiles(path));