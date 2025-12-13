export interface IParty {
    party_id: string;
    name: string;
    party_type: string;
    address_id: number;
    create_date: string;
    create_user: string;
    update_date: string;
    update_user: string;
  }

  export interface IVendor {
    id           : string
    name         : string,
    short_name   : string,
    address1     : string,
    address2     : string,
    address3     : string,
    postal_code  : string,
    phone        : string,
    fax          : string,
    account      : number,
    child        : number,
    vat_account  : number,
    vat_child    : number,
    ap_account   : number,
    ap_child     : number,
    description  : string,
    contact      : string,
    type         : string,
    status       : string,
    vendor_terms : number,    
    create_date  : Date,
    create_user  : string,
    update_date  : Date,
    update_user  : string
  }
  
  