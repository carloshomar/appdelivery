export interface Additional {
  ID: number;
  Name: string;
  Price: number;
}

export interface Item {
  Additional: any;
  Price: number;
}
