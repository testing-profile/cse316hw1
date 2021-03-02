'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class SetTask_Transaction extends jsTPS_Transaction {
    constructor(initModel, index, value) {
        super();
        this.model = initModel;
        this.list = this.model.currentList;
        this.index = index;
        this.oldValue = this.list.getItemAtIndex(index).getDescription();
        this.value = value;
    }

    doTransaction() {
        this.model.setTask(this.index, this.value, this.list);
    }

    undoTransaction() {
        this.model.setTask(this.index, this.oldValue, this.list);
    }
}