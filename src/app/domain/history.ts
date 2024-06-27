export interface History {
  id?: any;
  transactionDate?: Date;
  name?: string;
  type?: string;
  side?: any;
  amount?: any;
  netAmount?: any;
  unit?: any;
  unitPrice?: any;
  commission?: any;
  fee?: any;
  clearingFee?: any;
  vat?: any;
  commissionRate?: any;
  vatRate?: any;
  feeRate?: any;
  dividend?: boolean;
  cashInOutId?: any;

  // only output
  realizePL?: any;
  percentPL?: any;
  unPL?: any;
  percentUnPL?: any;
  status?: any;
  periodHold?: any;
  day?: any;
  month?: any;
  year?: any;
  refPrice?: any;
  fullPrice?: string;
  totalDividend?: any;

  availUnit?: any;
  availNetAmount?: any;
  availDividend?: any;
  
  selected?: any;
  orderMatch?: any;
}
