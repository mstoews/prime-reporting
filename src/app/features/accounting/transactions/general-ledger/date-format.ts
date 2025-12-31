import { MatDateFormats } from '@angular/material/core';

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY', // Format for parsing user input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // Format for displaying the date in the input field
    monthYearLabel: 'MMMM YYYY', // Format for the month/year label in the calendar header
    dateA11yLabel: 'LL', // Format for accessibility label of the date
    monthYearA11yLabel: 'MMMM YYYY', // Format for accessibility label of the month/year
  },
};
