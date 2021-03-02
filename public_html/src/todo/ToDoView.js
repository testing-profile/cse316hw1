'use strict'

// import AddNewItem_Transaction from "./transactions/AddNewItem_Transaction";

/**
 * ToDoView
 * 
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList, color) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");

        // MAKE AND ADD THE NODE
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button todo-list");
        listElement.appendChild(document.createTextNode(newList.name));
        listElement.style.display = "flex";
        listElement.style.alignItems = "center";
        listElement.style.justifyContent = "center";
        listElement.style.minHeight = "30px";
        listsElement.appendChild(listElement);
        if (color === "#ffc819") {
            listElement.style.backgroundColor = color;
        }
        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
        listElement.onmouseup = function() {
            thisController.handleLoadList(newList.id);
        }
    }

    // REMOVES ALL THE LISTS FROM THE LEFT SIDEBAR
    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            let color = ""
            if (i == 0) {color = "#ffc819"}
            this.appendNewListToView(list, color);
        }
    }

    refreshListsClosed(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
        }
    }

    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW
    viewList(list) {
        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();

        let thisController = this.controller;

        for (let i = 0; i < list.items.length; i++) {
            // NOW BUILD ALL THE LIST ITEMS
            let listItem = list.items[i];
            let color = "#8ed4f8";
            if (listItem.getStatus() === "incomplete") {
                color = "#f5bc75";
            }
            let listItemElement = "<div id='todo-list-item-" + listItem.id + "' class='list-item-card'>"
                                + "<div id='todo-item-task-"+listItem.id+"' class='task-col'>" + listItem.description + "</div>"
                                + "<div id='todo-item-date-"+listItem.id+"' class='due-date-col'>" + listItem.dueDate + "</div>"
                                + "<div id='todo-item-status-"+listItem.id+"' class='status-col' style='color:" + color + "'>" + listItem.status + "</div>"
                                + "<div class='list-controls-col'>"
                                + " <div id='todo-item-up-"+listItem.id+"' class='list-item-control material-icons'>keyboard_arrow_up</div>"
                                + " <div id='todo-item-down-"+listItem.id+"' class='list-item-control material-icons'>keyboard_arrow_down</div>"
                                + " <div id='todo-item-close-"+listItem.id+"' class='list-item-control material-icons'>close</div>"
                                + "</div>";
            itemsListDiv.insertAdjacentHTML("beforeend",listItemElement);
            if (i == 0) {
                let element = document.getElementById("todo-item-up-"+listItem.id);
                element.style.opacity = "50%";
                element.style.width = "20%";
                element.setAttribute("class", "material-icons");
            }
            if (i == list.items.length-1) {
                let element = document.getElementById("todo-item-down-"+listItem.id);
                element.style.opacity = "50%";
                element.style.width = "20%";
                element.setAttribute("class", "material-icons");
            }
            thisController.setItem(listItem.id, i, list.items.length);
        }
    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }

    confirmListDeletion(listIndex) {
        let popup = document.getElementById("confirm-delete-container-hidden");
        popup.setAttribute("id","confirm-delete-container");
        let text = "<p>Are you sure you want to delete " + listIndex + "?</p?";
        document.getElementById("confirm-message").innerHTML = text;
    }

    clearDeletionPopup() {
        let popup = document.getElementById("confirm-delete-container");
        popup.setAttribute("id","confirm-delete-container-hidden");
    }

    setTaskInput(id, value, index) {
        let item = document.getElementById("todo-item-task-"+id);
        let newItem = document.createElement("input");
        newItem.setAttribute("id","todo-item-task-"+id);
        newItem.setAttribute("class", "task-col");
        newItem.setAttribute("value",value);
        item.parentNode.replaceChild(newItem,item);
        document.getElementById("todo-item-task-"+id).focus();
        document.getElementById("todo-item-task-"+id).select();
        this.controller.setTaskInput(id, index);
    }

    setDateInput(id, date, index) {
        let item = document.getElementById("todo-item-date-"+id);
        let newItem = document.createElement("input");
        newItem.setAttribute("id","todo-item-date-"+id);
        newItem.setAttribute("class", "due-date-col");
        newItem.setAttribute("value", date);
        newItem.setAttribute("type","date");
        item.parentNode.replaceChild(newItem,item);
        document.getElementById("todo-item-date-"+id).focus();
        document.getElementById("todo-item-date-"+id).select();
        this.controller.setDateInput(id, index);
    }

    setStatusInput(id, status, index) {
        let item = document.getElementById("todo-item-status-"+id);
        let newItem = document.createElement("select");
        newItem.setAttribute("id","todo-item-status-"+id);
        newItem.setAttribute("class", "status-col");
        let option = 0;
        if (status === "incomplete") {option = 1}
        let complete = document.createElement("option");
        complete.text = "complete";
        complete.style.color = "#8ed4f8";
        let incomplete = document.createElement("option");
        incomplete.text = "incomplete";
        incomplete.style.color = "#f5bc75";
        newItem.appendChild(complete);
        newItem.appendChild(incomplete);
        item.parentNode.replaceChild(newItem,item);
        document.getElementById("todo-item-status-"+id).focus();
        document.getElementById("todo-item-status-"+id).selectedIndex=option;
        this.controller.setStatusInput(id, index);
    }

    enableListControls() {
        document.getElementById("list-controls").style.opacity = "100%";
        document.getElementById("add-item-button").style.width = "20%";
        document.getElementById("delete-list-button").style.width = "20%";
        document.getElementById("close-list-button").style.width = "20%";
        document.getElementById("add-item-button").setAttribute("class","list-control material-icons todo_button" );
        document.getElementById("delete-list-button").setAttribute("class","list-control material-icons todo_button" );
        document.getElementById("close-list-button").setAttribute("class","list-control material-icons todo_button" );
        this.controller.enableListControls();
    }

    disableListControls() {
        let controls = document.getElementById("list-controls").innerHTML;
        document.getElementById("list-controls").innerHTML = controls;
        document.getElementById("list-controls").style.opacity = "50%";
        document.getElementById("add-item-button").style.width = "15%";
        document.getElementById("delete-list-button").style.width = "15%";
        document.getElementById("close-list-button").style.width = "15%";
        document.getElementById("add-item-button").setAttribute("class","list-control material-icons" );
        document.getElementById("delete-list-button").setAttribute("class","list-control material-icons" );
        document.getElementById("close-list-button").setAttribute("class","list-control material-icons" );
    }

    enableAddList() {
        document.getElementById("add-list-button").style.opacity = "100%";
        document.getElementById("add-list-button").setAttribute("class","material-icons todo_button" );
        this.controller.enableAddList();
    }

    disableAddList() {
        let button = document.createElement("span");
        button.setAttribute("id", "add-list-button");
        button.setAttribute("class", "material-icons");
        button.appendChild(document.createTextNode("add_box"));
        button.style.opacity = "50%";
        let oldButton = document.getElementById("add-list-button");
        oldButton.replaceWith(button);
    }

    enableUndo() {
        document.getElementById("undo-button").style.opacity = "100%";
        document.getElementById("undo-button").setAttribute("class","material-icons todo_button" );
        this.controller.enableUndo();
    }

    disableUndo() {
        let button = document.createElement("span");
        button.setAttribute("id", "undo-button");
        button.setAttribute("class", "material-icons");
        button.appendChild(document.createTextNode("undo"));
        button.style.opacity = "50%";
        let oldButton = document.getElementById("undo-button");
        oldButton.replaceWith(button);
    }

    enableRedo() {
        document.getElementById("redo-button").style.opacity = "100%";
        document.getElementById("redo-button").setAttribute("class","material-icons todo_button" );
        this.controller.enableRedo();
    }

    disableRedo() {
        let button = document.createElement("span");
        button.setAttribute("id", "redo-button");
        button.setAttribute("class", "material-icons");
        button.appendChild(document.createTextNode("redo"));
        button.style.opacity = "50%";
        let oldButton = document.getElementById("redo-button");
        oldButton.replaceWith(button);
    }
}