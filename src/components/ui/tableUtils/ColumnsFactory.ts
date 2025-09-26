/* eslint-disable @typescript-eslint/no-explicit-any */

import { createColumnHelper } from "@tanstack/react-table";
import { TableCell, TableCellUneditable } from "./TableCell";
import { EditCell } from "./EditCell";
import { SelectAllCells, SelectCell } from "./SelectCell";

export type ColumnDataSource = {
  [key: string]: any;
};

const columnHelper = createColumnHelper<ColumnDataSource>();

export const getColumns = ({
  columns,
  //isEditable,
  enableSelect,
}: {
  columns: ColumnDataSource[];
  isEditable?: boolean;
  enableSelect?: boolean;
}) => {
  const helperColumns = [];

  if (enableSelect) {
    helperColumns.push(
      columnHelper.display({
        id: "#_Select",
        header: SelectAllCells,
        cell: SelectCell,
        enableSorting: false,
      }),
    );
  }

  columns.forEach((column) => {
    helperColumns.push(
      columnHelper.accessor(column.key, {
        header: column.name,
        cell: column.name !== "id" ? TableCell : TableCellUneditable,
        meta: column.meta,
      }),
    );
  });

  // if (isEditable) {
  helperColumns.push(
    columnHelper.display({
      id: "#_Actions",
      header: "Actions",
      cell: EditCell,
      enableSorting: false,
    }),
  );
  //}

  return helperColumns;
};
