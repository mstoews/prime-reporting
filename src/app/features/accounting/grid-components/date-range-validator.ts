import {FormGroup, ValidatorFn, Validators} from '@angular/forms';

export function createJournalStartAndEndValidator (): ValidatorFn {
    return (form: FormGroup): Validators | null => {
        const start: Date = form.get("start_date").value;
        const end: Date = form.get("end_date").value;

        if (start && end) {
            const isRangeValid = (end?.getTime() - start?.getTime() > 0);
            return isRangeValid ? null : {selectionPeriod: true}
        }
        return null;
    }
}