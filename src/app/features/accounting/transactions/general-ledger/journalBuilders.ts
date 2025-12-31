import { inject } from "@angular/core";
import { Detail, IJournalDetail, IJournalDetailUpdate, IJournalTemplate, IJournalTransactions } from "app/models/journals";
import { IJournalHeader } from "app/models/journals";
import { ToastrService } from "ngx-toastr";

export const onModifyJournal = (
  journalHeader: IJournalHeader,
  userName: string,
  journalDetails: IJournalDetail[],
  template: IJournalTemplate,
  currentPrd: number,
  currentYear: number,
  nextJournalId: number
): IJournalTransactions => {

  
  
  const updateDate = new Date().toISOString().split('T')[0];
  let party_id = '';

  if (journalHeader.due_date === undefined || journalHeader.due_date === null) {
    journalHeader.due_date = '';
  }

  if (journalHeader.party_id === undefined || journalHeader.party_id === null) {
    party_id = '';
  } else {
    party_id = journalHeader.party_id;
  }

  if (journalHeader.transaction_date === undefined || journalHeader.transaction_date === null) {
    return null
    
  }

  if (journalHeader.description === undefined || journalHeader.description === null || journalHeader.description.trim() === '') {
    
    return null;
  }

  if (template === undefined || template === null) {
    
    return null;
  }

  if (template.journal_type === undefined || template.journal_type === null || template.journal_type.trim() === '') {
    
    return null;
  }

  if (nextJournalId === undefined || nextJournalId === null || nextJournalId === 0) {
    
    return null;
  }

  journalHeader.journal_id = nextJournalId;
  journalHeader.period = currentPrd;
  journalHeader.period_year = currentYear;
  journalHeader.type = template.journal_type;
  journalHeader.template_ref = template.template_ref;

  if (journalHeader.due_date === undefined || journalHeader.due_date === null || journalHeader.due_date === "") {
      journalHeader.due_date = new Date().toISOString().substring(0, 10);
  }

  var count = 1;
  var sumDebits = 0;
  var sumCredits = 0;

  let details: IJournalDetailUpdate[] = [];

  journalDetails.sort((a, b) => (a.journal_subid! > b.journal_subid! ? 1 : -1));

  journalDetails.forEach((dtl) => {
    var journalDetail: IJournalDetailUpdate = {
      journal_id: nextJournalId,
      journal_subid: count,
      account: Number(dtl.account),
      child: Number(dtl.child),
      description: dtl.description,
      create_date: updateDate,
      create_user: userName,
      sub_type: dtl.sub_type,
      debit: Number(dtl.debit),
      credit: Number(dtl.credit),
      reference: dtl.reference,
      fund: dtl.fund,
      child_desc: dtl.child_desc,
    }

    details.push(journalDetail);
    count = count + 1;
    sumDebits += journalDetail.debit;
    sumCredits += journalDetail.credit;

  });


  if (sumDebits !== sumCredits) {
    
    return null;
  }

  if (details.length === 0) {
    
    return null;
  }

  journalHeader.amount = sumDebits;

  if (journalHeader.amount === 0 || journalHeader.amount === null || journalHeader.amount === undefined) {
    
    return null;
  }

  const detail: Detail[] = details;
    let journalArray: IJournalTransactions;
    journalArray = {
        ...journalHeader,
        details: {detail: detail},
    };

  return journalArray;

}

