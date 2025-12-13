import { IStartEndDate, ITBParams, ITBStartEndDate } from 'app/models/journals';
import { concatMap, pipe, switchMap, tap } from 'rxjs';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { ReportService } from '../services/reports.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

export interface ReportStateInterface {
  tb: any[];
  isLoading: boolean;
  isLoaded: boolean;
  isSettingsLoaded: boolean;
  error: string | null;
}

export const ReportStore = signalStore(
  { providedIn: 'root' },
  withState<ReportStateInterface>({
    tb: [],
    error: null,
    isLoading: false,
    isLoaded: false,
    isSettingsLoaded: false,
  }),
  withComputed((state) => ({})),
  withMethods((state,
    reportService = inject(ReportService), ) => ({
    loadTB: rxMethod<IStartEndDate>(
      pipe(
        tap(() => patchState(state, { isLoading: true })),
        concatMap((value) => {
          return reportService.readTransactionByDate (value).pipe(
            tapResponse({
              next: (tb) => patchState(state, { tb: tb }),
              error: console.error,
              finalize: () => patchState(state, { isLoading: false }),
            }));
        }))
    ),
  })),
  withHooks({
  })
);

