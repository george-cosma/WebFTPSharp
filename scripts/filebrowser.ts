import { connect } from "http2";
import Path from "./models/path"
import NavigationItem from "./models/navigation_item"
import NavigationItemType from "./models/navigation_item_type"





let path: Path = new Path();
const signalR = require("@microsoft/signalr");
const connection = new signalR.HubConnectionBuilder()
                    .withUrl("/api/hubs/filebrowser")
                    .build();


const fileBrowser = document.getElementById("file-browser");

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