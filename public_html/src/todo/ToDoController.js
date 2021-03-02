'use strict'

/**
 * ToDoController
 * 
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 */
export default class ToDoController {    
    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;

        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmouseup = function() {
            appModel.addNewList();
        }
        document.getElementById("delete-list-button").onmouseup = function() {
            appModel.confirmListDeletion();
        }
        document.getElementById("add-item-button").onmouseup = function() {
            appModel.addNewItemTransaction();
        }
        document.getElementById("confirm-button").onmousedown = function() {
            appModel.removeCurrentList();
        }
        document.getElementById("cancel-button").onmousedown = function() {
            appModel.cancelDelete();
        }
        this.model.enableAddList();
    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        if (this.model.currentList !== null) {
            if (listId !== this.model.currentList.getId()) {
                this.model.loadList(listId);
            }
        } else if (this.model.currentList === null) {
            this.model.loadList(listId);
        }
        this.model.disableAddList();
    }

    enableAddList() {
        let appModel = this.model;
        document.getElementById("add-list-button").onmouseup = function() {
            appModel.addNewList();
        }
    }

    handleConfirm() {
        this.model.removeCurrentList();
    }

    handleCancel() {
        this.model.cancelDelete();
    }

    setItem(itemId, index, listLength) {
        this.setText(itemId, index);
        this.setDate(itemId, index);
        this.setStatus(itemId, index);
        if (index != 0) {
            this.setUp(itemId, index);
        }
        if (index != listLength) {
            this.setDown(itemId, index);
        }
        this.setClose(itemId,index);
    }
    
    setText(itemId, index) {
        let item = document.getElementById("todo-item-task-" + itemId);
        let appModel = this.model;
        item.onmouseup = function() {
            appModel.setTaskInput(index);
        }
    }

    setTaskInput(itemId, index) {
        let item = document.getElementById("todo-item-task-" + itemId);
        let appModel = this.model;
        let oldValue = document.getElementById("todo-item-task-" + itemId).value;
        item.onblur = function() {
            let newValue = document.getElementById("todo-item-task-" + itemId).value;
            if (newValue !== oldValue) {
                appModel.setTaskTransaction(index, newValue);
            } else {
                appModel.setTask(index, oldValue, appModel.currentList);
            }
        }
    }

    setDate(itemId, index) {
        let item = document.getElementById("todo-item-date-" + itemId);
        let appModel = this.model;
        item.onmouseup = function() {
            appModel.setDateInput(index);
        }
    }

    setDateInput(itemId, index) {
        let item = document.getElementById("todo-item-date-" + itemId);
        let appModel = this.model;
        let oldDate = document.getElementById("todo-item-date-" + itemId).value;
        item.onblur = function() {
            let newDate = document.getElementById("todo-item-date-" + itemId).value;
            if (newDate !== oldDate) {
                appModel.setDateTransaction(index, newDate);
            } else {
                appModel.setDate(index, oldDate, appModel.currentList);
            }
        }
    }

    setStatus(itemId, index) {
        let item = document.getElementById("todo-item-status-" + itemId);
        let appModel = this.model;
        item.onmouseup = function() {
            appModel.setStatusInput(index);
        }
    }

    setStatusInput(itemId, index) {
        let item = document.getElementById("todo-item-status-" + itemId);
        let appModel = this.model;
        let oldStatus = document.getElementById("todo-item-status-" + itemId).value;
        item.onblur = function() {
            let newStatus = document.getElementById("todo-item-status-" + itemId).value;
            if (newStatus !== oldStatus) {
                appModel.setStatusTransaction(index, newStatus);
            } else {
                appModel.setStatus(index, oldStatus, appModel.currentList);
            }
        }
    }

    setUp(itemId, index) {
        let item = document.getElementById("todo-item-up-" + itemId);
        let appModel = this.model;
        item.onmouseup = function() {
            if (index > 0) {
                appModel.shiftUpTransaction(index);
            }
        }
    }

    setDown(itemId, index) {
        let item = document.getElementById("todo-item-down-" + itemId);
        let appModel = this.model;
        item.onmouseup = function() {
            if (index < appModel.currentList.items.length-1) {
                appModel.shiftDownTransaction(index);
            }
        }
    }

    setClose(itemId, index) {
        let button = document.getElementById("todo-item-close-" + itemId);
        let item = this.model.currentList.getItemAtIndex(index);
        let appModel = this.model;
        button.onmouseup = function() {
            appModel.removeItemTransaction(item);
        }
    }

    enableListControls() {
        let appModel = this.model;
        document.getElementById("add-item-button").onmouseup = function() {
            appModel.addNewItemTransaction();
        }
        document.getElementById("delete-list-button").onmouseup = function() {
            appModel.confirmListDeletion();
        }
        document.getElementById("close-list-button").onmouseup = function() {
            appModel.closeCurrentList();
        }
    }

    enableUndo() {
        let appModel = this.model;
        document.getElementById("undo-button").onmouseup = function() {
            appModel.undo();
        }
    }

    enableRedo() {
        let appModel = this.model;
        document.getElementById("redo-button").onmouseup = function() {
            appModel.redo();
        }
    }
}