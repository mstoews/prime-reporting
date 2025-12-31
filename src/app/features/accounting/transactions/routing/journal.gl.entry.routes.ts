import { Routes } from '@angular/router';
import { GLJournalList } from '../general-ledger/gl-list';

export default [
    {
        path: '',
        component: GLJournalList,
        // resolve: { journal: JournalEditResolver },
    },

] as Routes;
