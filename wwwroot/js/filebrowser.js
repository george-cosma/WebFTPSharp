import Path from "./path.js";
let path = new Path();
//const connection = new signalR.HubConnectionBuilder().withUrl("/api/hubs/filebrowser").build();
const connection = new window.signalR.HubConnectionBuilder()
    .withUrl("/api/hubs/filebrowser")
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
//# sourceMappingURL=filebrowser.js.map