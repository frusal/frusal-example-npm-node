// @ts-check
/// <reference types="./my-module.rt" />

/* GENERATED STUB, remove this comment and take over development of this code. */

import { session } from '@frusal/library-for-node';

/** my definition of the book */
export class Book {
    /** my own display string */
    displayString() {
        return this.title;
    }
}
session.factory.registerUserClass(Book);
