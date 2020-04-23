/* GENERATED FILE - DO NOT EDIT */

import { types } from '@frusal/library-for-node';

declare module './my-module' {

    /** test.component.ts */
    interface Book extends types.Entity {
        /** The title of the book. */
        title: string;
        readonly title_val: types.PrimitiveValue<string>;
    }
    namespace Book {
        /** ClassSpec ID for 'Book' (b0k2f0). */
        const id: string;
        const title_prop: types.TProperty;
    }
}
