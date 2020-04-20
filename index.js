// @ts-check

import { session, types } from '@frusal/library-for-node';
import { Book } from './my-module.js';

const COMMON_DESCRIPTION = 'test.component.ts';

async function main() {
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
    console.assert(activeUser.name === 'Unit Test', 'Unexpected user name: ' + activeUser.name);

    const activeWorkspace = session.workspace;
    console.log('Workspace: ' + activeWorkspace.details.name);
    console.assert(activeWorkspace.details.name === 'Unit Test', 'Unexpected workspace name', activeUser, '\nAvailable workspaces: ', activeUser.workspaces.map(us => us.GUID).join(', '));

    await activeWorkspace.withTempStageAsyncExpression(stage => {
        const workspace = stage.transact(tx => tx.getSingletonInstance(types.ActualWorkspace));
        const module = workspace.modules.find(m => !m.system);
        console.log('Module: ' + module.name);

        stage.transact(tx => {
            // Delete old classes
            [...module.classes].filter(c => c.description === COMMON_DESCRIPTION).forEach(c => c.delete());
            // Create new ones
            const stringType = workspace.modules.get(0).types.find(t => t.name === 'String');
            const bookClass = tx.createEntity(types.ClassSpec);
            bookClass.name = 'Book';
            bookClass.description = COMMON_DESCRIPTION;
            const bookNameProp = tx.createEntity(types.Property);
            bookNameProp.name = 'Title';
            bookNameProp.description = 'The title of the book.';
            bookNameProp.type = stringType;
            bookNameProp.classSpec = bookClass;
            bookClass.module = module;
        });

        stage.transact(tx => {
            const book = tx.createEntity(Book);
            book.title = 'Bible';
            console.log('Book: ' + book.displayString());
        });

    });

    console.log('Done.');
}

main();
