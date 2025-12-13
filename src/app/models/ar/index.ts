export interface ICustomers {
  customer_id: string,
  customer_name: string,
  customer_short_name: string,
  customer_address1: string,
  customer_address2: string,
  customer_address3: string,
  customer_postal_code: string,
  customer_phone: string,
  customer_fax: string,
  customer_account: number,
  customer_child: number,
  customer_vat_account: number,
  customer_vat_child: number,
  customer_ap_account: number,
  customer_ap_child: number,
  customer_description: string,
  customer_contact: string,
  customer_type: string,
  customer_status: string,
  customer_terms: number,
  create_date: Date,
  create_user: string,
  update_date: Date,
  update_user: string
}

export interface IARTransaction {
  transaction_id: string,
  customer_id: string,
  ar_cash_account: number,
  ar_cash_child: number,
  status: string,
  ar_account: number,
  ar_child: number,
  period: number,
  transaction_date: Date,
  due_date: Date,
  receipt_no: string,
  reference: string,
  description: string,
  amount: number,
  amount_received: number,
  date_paid: Date,
  adjustment_amt: number,
  remainder_amt: number,
  receipt_req: string,
  create_date: Date,
  create_user: string,
  update_date: Date,
  update_user: string
}

export interface IARPayment {
  payment_id: number,
  invoice_id: number,
  references: string
  payment_date: Date,
  payment_amount: number,
  create_date: Date,
  create_user: string,
  update_date: Date,
  update_user: string
}


