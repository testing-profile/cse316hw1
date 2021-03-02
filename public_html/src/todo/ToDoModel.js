'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import RemoveItem_Transaction from './transactions/RemoveItem_Transaction.js'
import SetTask_Transaction from './transactions/SetTask_Transaction.js'
import SetDate_Transaction from './transactions/SetDate_Transaction.js'
import SetStatus_Transaction from './transactions/SetStatus_Transaction.js'
import ShiftUp_Transaction from './transactions/ShiftUp_Transaction.js'
import ShiftDown_Transaction from './transactions/ShiftDown_Transaction.js'

/**
 * ToDoModel
 * 
 * This class manages all the app data.
 */
export default class ToDoModel {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.toDoLists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST ITEM
        this.nextListItemId = 0;
    }

    /**
     * addItemToCurrentList
     * 
     * This function adds the itemToAdd argument to the current list being edited.
     * 
     * @param {*} itemToAdd A instantiated item to add to the list.
     */
    addItemToCurrentList(itemToAdd) {
        this.currentList.push(itemToAdd);
    }

    /**
     * addNewItemToCurrentList
     * 
     * This function adds a brand new default item to the current list.
     */
    addNewItemToCurrentList() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.addItemToList(this.currentList, newItem);
        return newItem;
    }

    /**
     * addItemToList
     * 
     * Function for adding a new item to the list argument using the provided data arguments.
     */
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.setDescription(initDescription);
        newItem.setDueDate(initDueDate);
        newItem.setStatus(initStatus);
        list.addItem(newItem);
        if (this.currentList) {
            this.view.refreshList(list);
        }
    }

    addItemToList(list, item, index) {
        list.addItemAtIndex(item, index);
        if (this.currentList) {
            this.view.viewList(list);
        }
    }

    /**
     * addNewItemTransaction
     * 
     * Creates a new transaction for adding an item and adds it to the transaction stack.
     */
    addNewItemTransaction() {
        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
        this.view.enableUndo();
        this.view.disableRedo();
    }

    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) {
        let newList = new ToDoList(this.nextListId++);
        if (initName)
            newList.setName(initName);
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList);
        return newList;
    }

    /**
     * Adds a brand new default item to the current list's items list and refreshes the view.
     */
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.currentList.items.push(newItem);
        this.view.viewList(this.currentList);
        return newItem;
    }

    /**
     * Makes a new list item with the provided data and adds it to the list.
     */
    loadItemIntoList(list, description, due_date, assigned_to, completed) {
        let newItem = new ToDoListItem();
        newItem.setDescription(description);
        newItem.setDueDate(due_date);
        newItem.setAssignedTo(assigned_to);
        newItem.setCompleted(completed);
        this.addItemToList(list, newItem);
    }

    /**
     * Load the items for the listId list into the UI.
     */
    loadList(listId) {
        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let listToLoad = this.toDoLists[listIndex];
            this.currentList = listToLoad;
            this.view.viewList(this.currentList);
            this.shiftLists(listIndex);
            this.view.refreshLists(this.toDoLists);
        }
        this.enableListControls();
        this.clearTps();
        this.view.disableRedo();
        this.view.disableUndo();
    }

    shiftLists(listIndex) {
        for (let i = listIndex; i > 0; i--) {
            this.toDoLists[i] = this.toDoLists[i-1];
        }
        this.toDoLists[0] = this.currentList;
    }

    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
            this.view.enableUndo();
        }
        if (!this.tps.hasTransactionToRedo()) {
            this.view.disableRedo();
        }
    }   

    removeItemTransaction(itemToRemove) {
        let transaction = new RemoveItem_Transaction(this, itemToRemove);
        this.tps.addTransaction(transaction);
        this.view.enableUndo();
        this.view.disableRedo();
    }

    /**
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.view.viewList(this.currentList);
    }

    /**
     * Finds and then removes the current list.
     */
    removeCurrentList() {
        this.view.clearDeletionPopup();
        let indexOfList = -1;
        for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
            if (this.toDoLists[i].id === this.currentList.id) {
                indexOfList = i;
            }
        }
        this.toDoLists.splice(indexOfList, 1);
        this.currentList = null;
        this.view.clearItemsList();
        this.view.refreshListsClosed(this.toDoLists);
        this.view.enableAddList();
        this.view.disableRedo();
        this.view.disableUndo();
    }

    // WE NEED THE VIEW TO UPDATE WHEN DATA CHANGES.
    setView(initView) {
        this.view = initView;
    }

    /**
     * Undo the most recently done transaction if there is one.
     */
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
            this.view.enableRedo();
        }
        if (!this.tps.hasTransactionToUndo()) {
            this.view.disableUndo();
        }
    }

    confirmListDeletion() {
        this.view.confirmListDeletion(this.currentList.getName());
    }

    cancelDelete() {
        this.view.clearDeletionPopup();
    }

    setListInput(listId) {
        let list = document.getElementById("todo-list-" + listId);
        let value = list.textContent;
        this.view.setListInput(listId, list, value);
    }

    setList(id, value) {
        let indexOfList = -1;
        for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
            if (this.toDoLists[i].id === id) {
                indexOfList = i;
            }
        }
        this.toDoLists[indexOfList].setName(value);
        this.view.setList(id, value);
    }

    setTaskInput(index) {
        let item = this.currentList.items[index];
        let value = item.getDescription();
        let id = item.getId();
        this.view.setTaskInput(id, value, index);
    }

    setTaskTransaction(index, value) {
        let transaction = new SetTask_Transaction(this, index, value)
        this.tps.addTransaction(transaction);
        this.view.enableUndo();
        this.view.disableRedo();
    }

    setTask(index, value, list) {
        list.items[index].setDescription(value);
        if (list === this.currentList) {
            this.view.viewList(this.currentList);
        }
    }

    setDateInput(index) {
        let item = this.currentList.items[index];
        let date = item.getDueDate();
        let id = item.getId();
        this.view.setDateInput(id, date, index);
    }

    setDateTransaction(index, date) {
        let transaction = new SetDate_Transaction(this, index, date)
        this.tps.addTransaction(transaction);
        this.view.enableUndo();
        this.view.disableRedo();
    }

    setDate(index, date, list) {
        list.items[index].setDueDate(date);
        if (list === this.currentList) {
            this.view.viewList(this.currentList);
        }
    }

    setStatusInput(index) {
        let item = this.currentList.items[index];
        let status = item.getStatus();
        let id = item.getId();
        this.view.setStatusInput(id, status, index);
    }

    setStatusTransaction(index, date) {
        let transaction = new SetStatus_Transaction(this, index, date)
        this.tps.addTransaction(transaction);
        this.view.enableUndo();
        this.view.disableRedo();
    }

    setStatus(index, status, list) {
        list.items[index].setStatus(status);
        if (list === this.currentList) {
            this.view.viewList(this.currentList);
        }
    }

    shiftUpTransaction(index) {
        let transaction = new ShiftUp_Transaction(this, index)
        this.tps.addTransaction(transaction);
        this.view.enableUndo();
        this.view.disableRedo();
    }

    shiftUp(index, list) {
        if (index > 0) {
            let above = list.items[index-1];
            let current = list.items[index];
            list.items[index-1] = current;
            list.items[index] = above;
            if (list === this.currentList) {
                this.view.viewList(this.currentList);
            }
        }
    }

    shiftDownTransaction(index) {
        let transaction = new ShiftDown_Transaction(this, index)
        this.tps.addTransaction(transaction);
        this.view.enableUndo();
        this.view.disableRedo();
    }

    shiftDown(index, list) {
        if (index < list.items.length-1) {
            let below = list.items[index+1];
            let current = list.items[index];
            list.items[index+1] = current;
            list.items[index] = below;
            if (list === this.currentList) {
                this.view.viewList(this.currentList);
            }
        }
    }

    clearTps() {
        this.tps.clearAllTransactions();
        this.view.disableRedo();
        this.view.disableUndo();
    }

    enableListControls() {
        this.view.enableListControls();
    }

    disableListControls() {
        this.view.disableListControls();
    }

    closeCurrentList() {
        this.currentList = null;
        this.disableListControls();
        this.clearTps();
        this.view.clearItemsList();
        this.view.disableUndo();
        this.view.disableRedo();
        this.view.enableAddList();
        this.view.refreshListsClosed(this.toDoLists);
    }

    disableAddList() {
        this.view.disableAddList();
    }

    enableAddList() {
        this.view.enableAddList();
    }
}