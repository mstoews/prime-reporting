
export interface TypeState {
  types: IType[];
  type: IType;
  error: string | null;
}

export interface IType {
  type: string,
  description: string,
  create_date: Date,
  create_user: string,
  update_date: Date,
  update_user: string
}


export interface IGLType {
  type: string,
  sub_line_item: string,
  order_by: number,
  description: string,
  create_date: string,
  create_user: string,
  update_date: string,
  update_user: string
}

export interface IValue {
  value: string;
  viewValue: string;
}

