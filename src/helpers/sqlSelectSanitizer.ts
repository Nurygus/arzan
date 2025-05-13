import { Join, ReturnField, Where } from "./query";

export function sanitizeFilter(where: Where | undefined) {
  if (!where) {
    return "";
  }

  const prefix = "WHERE";

  let valueIndex = 0;

  if (!where.sub_query) {
    if (!where.active) {
      return "";
    }
    valueIndex += 1;
    return `${prefix} ${where.field_name} ${where.condition} $${valueIndex}`;
  }

  if (!where.active) {
    const query = where.sub_query.reduce((acc: string, curValue) => {
      if (!curValue.active) {
        return acc;
      }

      if (valueIndex === 0) {
        return (
          acc + ` ${curValue.field_name} ${curValue.condition} $${valueIndex}`
        );
      }

      valueIndex += 1;

      return (
        acc +
        ` ${curValue.field_condition} ${curValue.field_name} ${curValue.condition} $${valueIndex}`
      );
    }, prefix);
    return query;
  }

  valueIndex += 1;
  const query = `${prefix} ${where.field_name} ${where.condition} $${valueIndex}`;
  const subQuery = where.sub_query.reduce((acc: string, curValue) => {
    if (!curValue.active) {
      return acc;
    }

    valueIndex += 1;

    return (
      acc +
      ` ${curValue.field_condition} ${curValue.field_name} ${curValue.condition} $${valueIndex}`
    );
  }, "");

  return `${query}${subQuery}`;
}

export function sanitizeFields(fields: ReturnField[]) {
  if (fields.length === 0) {
    return "*";
  }

  const query = fields.reduce((acc, curValue, curIndex) => {
    if (!curValue.return_field_name) {
      return (
        acc +
        curValue.field_name +
        `${curIndex < fields.length - 1 ? ", " : ""}`
      );
    }
    return (
      acc +
      `${curValue.field_name} as ${curValue.return_field_name}${
        curIndex < fields.length - 1 ? ", " : ""
      }`
    );
  }, "");

  return query;
}

export function sanitizeJoin(join: Join[]) {
  if (join.length === 0) {
    return "";
  }

  const prefix = "JOIN";

  const query = join.reduce((acc, joinTable) => {
    if (!joinTable.sub_query) {
      return (
        acc +
        ` ${prefix} ${joinTable.table} ON ${joinTable.field_name} ${joinTable.condition} ${joinTable.field_value}`
      );
    }

    const query = `${prefix} ${joinTable.table} ${joinTable.field_name} ${joinTable.condition} ${joinTable.field_value}`;
    const subQuery = joinTable.sub_query.reduce((acc, curValue) => {
      return (
        acc +
        ` ${curValue.field_condition} ${curValue.field_name} ${curValue.condition} ${curValue.field_value}`
      );
    }, "");

    return acc + query + subQuery;
  }, "");

  return query;
}

export function getFilterValues(where: Where | undefined) {
  if (!where) {
    return [];
  }

  if (!where.sub_query) {
    if (!where.active || where.field_value === undefined) {
      return [];
    }
    return [`${where.field_value}`];
  }

  if (!where.active) {
    const arr = where.sub_query.reduce((acc: string[], curValue) => {
      if (!curValue.active || curValue.field_value === undefined) {
        return acc;
      }
      return [...acc, curValue.field_value];
    }, []);
    return arr;
  }

  const arr = where.sub_query.reduce((acc: string[], curValue) => {
    if (!curValue.active || curValue.field_value === undefined) {
      return acc;
    }
    return [...acc, curValue.field_value];
  }, []);

  return [`${where.field_value}`, ...arr];
}
