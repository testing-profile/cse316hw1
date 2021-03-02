'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class ShiftUp_Transaction extends jsTPS_Transaction {
    constructor(initModel, index) {
        super();
        this.model = initModel;
        this.list = this.model.currentList;
        this.index = index;
    }

    doTransaction() {
        this.model.shiftUp(this.index, this.list);
    }

    undoTransaction() {
        this.model.shiftDown(this.index-1, this.list);
    }
}