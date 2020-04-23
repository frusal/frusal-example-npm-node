#!/usr/bin/env node
// @ts-check
import { session, types } from '@frusal/library-for-node';
import { Book } from './my-module.js';

const COMMON_DESCRIPTION = 'test.component.ts';

async function main() {
    try {
        console.log('Login...');

        await session.login({ 
            loginId: 'unit.test@fruit-salad.tech', 
            password: `Here I've broken it`, 
            workspace: 'ws_001_unit_test',
            advanced: {
                baseURL: 'http://localhost:8080'
            }
        });

        const activeUser = session.user;
        console.log('User name: ' + activeUser.name);

        const activeWorkspace = session.workspace;
        console.log('Workspace: ' + activeWorkspace.details.name);

        await activeWorkspace.withTempStageAsyncExpression(async stage => {
            const workspace = stage.transact(tx => tx.getSingletonInstance(types.ActualWorkspace));
            const module = workspace.modules.find(m => !m.system);
            console.log('Module: ' + module.name);

            const entities = await stage.query({ q: 'class:'+Book.id, type: types.QPType.SOLR_QUERY }).promiseArray();
            const books = /** @type {Book[]} */ ( /** @type {*} */ (entities));

            console.log('Found the following books already exist: ' + books.map(b => b.id))

            stage.transact(tx => {
                const book = tx.createEntity(Book);
                book.title = 'Bible';
                console.log('New Book created: ' + book.displayString());
            });
        });

        console.log('Done.');

    } finally {
        session.close();
    }
}

main();
