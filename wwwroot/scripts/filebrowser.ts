import Path from "./path.js"
import * as signalR from "../lib/microsoft/signalr/dist/browser/signalr.js";
//const signalR = require("@microsoft/signalr");

let path: Path = new Path();

console.log(signalR);

//const connection = new signalR.HubConnectionBuilder().withUrl("/api/hubs/filebrowser").build();
const connection = new signalR.HubConnectionBuilder()
                    .withUrl("/api/hubs/filebrowser")
                    .configureLogging(signalR.LogLevel.Information)
                    .build();
connection.start().catch(err => console.error(err.toString()));

/*

connection.on("ReceiveMessage", function (message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${message}`;
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

*/