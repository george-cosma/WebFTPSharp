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
						let percentCompleted = Math.floor(current / total * 100)

						dlBar.percentage = percentCompleted;
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

function requestFiles(reqPath: Path): void {
	connection.invoke("RequestFiles", path.path)
		.catch(function (err) {
			return console.error(err.toString());
		});
}

connection.start()
	.catch(err => console.error(err.toString()))
	.then(() => requestFiles(path));