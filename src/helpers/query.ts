import {
  getFilterValues,
  sanitizeFields,
  sanitizeFilter,
  sanitizeJoin,
} from "./sqlSelectSanitizer";
import pg from "@/config/db";

export type PostgresQueryClass = typeof PostgresQuery;

interface FilterCondition {
  active: boolean;
  field_condition: string;
  field_name: string;
  condition: string;
  field_value?: string;
}

export interface Where {
  active?: boolean;
  field_name: string;
  condition: string;
  field_value?: string;
  sub_query?: FilterCondition[];
}

interface JoinCondition {
  field_condition: string;
  field_name: string;
  condition: string;
  field_value: string;
}

export interface Join {
  table: string;
  field_name?: string;
  condition?: string;
  field_value?: string;
  sub_query?: JoinCondition[];
}

export interface ReturnField {
  field_name: string;
  return_field_name?: string;
}

interface PostgresSelectOptions {
  where?: Where;
  return_fields?: ReturnField[];
  join?: Join[];
  order_by?: string;
}

// interface PostgresInsertOptions {
//   field_names: string[];
//   values: string[];
//   returnFields: string[];
// }

export class PostgresQuery {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  async select(args?: PostgresSelectOptions) {
    if (args === undefined) {
      return await pg.query(`SELECT * FROM ${this.table}`);
    }
    const { return_fields = [], where, join = [], order_by } = args;
    const returnFields = sanitizeFields(return_fields);
    const returnFilter = sanitizeFilter(where);
    const returnJoin = sanitizeJoin(join);
    const filterValues = getFilterValues(where);
    const returnOrder = order_by === undefined ? "" : order_by;
    const finalQuery = `SELECT ${returnFields} FROM ${this.table} ${returnJoin} ${returnFilter} ${returnOrder}`;
    console.log(finalQuery);
    return await pg.query(finalQuery, filterValues);
  }

  // async insert(args?: PostgresInsertOptions) {
  //   if (args === undefined) {
  //     return;
  //   }
  //   const { return } = args;
  //   const finalQuery = "";
  //   const insertValues = [] as string[];
  //   return await pg.query(finalQuery, insertValues);
  // }
}
