'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class RemoveItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, item) {
        super();
        this.model = initModel;
        this.list = this.model.currentList;
        this.index = this.list.getIndexOfItem(item);
        this.item = item;
    }

    doTransaction() {
        this.model.removeItem(this.item);
    }

    undoTransaction() {
        this.model.addItemToList(this.list, this.item, this.index);
    }
}