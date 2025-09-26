/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ColumnDef,
  ColumnFiltersState,
  ColumnSizingState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";
import { Button } from "./Button";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "./Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./Select";
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./DropDownMenu";
import { ColumnDataSource } from "./tableUtils/ColumnsFactory";
import { ColumnResizer } from "./tableUtils/ColumnResizer";
import { TableActionsWebEditorContent } from "@/providers/webEditor/webEditor-provider";
import { range } from "@/lib/utils";
import { useUser } from "@/providers/user/use-user";
import { useWebEditor } from "@/providers/webEditor/use-webEditor";
import { useParams } from "react-router-dom";
import { useCompiler } from "@/providers/compiler/use-compiler";
import { Label } from "./Label";
import { TableTabsMenu } from "./tableUtils/TableTabsMenu";

export interface DataTableProps<TData, TValue> {
  styles: React.CSSProperties;
  title: string;
  columns: ColumnDef<TData, TValue>[];
  dataSource: TData[];
  rowsPerPage: number;
  currentPage: number;
  hiddenColumns?: VisibilityState;
  totalRows: number;
  handleChangePage: (page: number) => void;
  //setRowsPerPage: Dispatch<SetStateAction<number>>;
  enableSearch: boolean;
  searchCreteria: string[];
  enablePagination: boolean;
  actions: TableActionsWebEditorContent;
  orderBy: Record<string, string>;
  setOrderBy: Dispatch<SetStateAction<Record<string, string>>>;
  orderByCols: string[];
}

//   export function multiSelectFilter<T extends object>(
//   rows: Row<T>[],
//   columnId: keyof T,
//   filterValue: string[]
// ) {
//   return filterValue.length === 0
//     ? rows
//     : rows.filter((row) =>
//         filterValue.includes(String(row.original[columnId]))
//       );
// }

export function DataTable<TData, TValue>({
  styles,
  title,
  columns,
  dataSource,
  rowsPerPage,
  currentPage,
  totalRows,
  hiddenColumns,
  handleChangePage,
  //setRowsPerPage,
  enableSearch,
  searchCreteria,
  enablePagination,
  actions,
  orderBy,
  setOrderBy,
  orderByCols,
}: DataTableProps<TData, TValue>) {
  const { pageId } = useParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(hiddenColumns || {});

  const [dataSrc, setDataSrc] = useState<typeof dataSource>([]);
  const [backupData, setBackupData] = useState<typeof dataSource>([]);
  const [originalData, setOriginalData] = useState<typeof dataSource>([]);

  const [editedRows, setEditedRows] = useState({});
  const [validRows, setValidRows] = useState({});

  const [searchBy, setSearchBy] = useState<string>(
    searchCreteria.length ? searchCreteria[0] : "id",
  );

  const [colSizing, setColSizing] = useState<ColumnSizingState>({});

  const [pagination, setPagination] = useState({
    pageIndex: currentPage - 1,
    pageSize: rowsPerPage,
  });

  const { userState } = useUser();
  const { state } = useWebEditor();
  const { compilerState } = useCompiler();

  const lastOrderColRef = useRef(Object.keys(orderBy)[0]);
  const lastOrderByRef = useRef("ASC");

  const [orderCol, setOrderCol] = useState(lastOrderColRef.current);
  const [orderDirection, setOrderDirection] = useState(lastOrderByRef.current);

  useEffect(() => {
    if (!dataSource.length) return;
    setDataSrc([...dataSource]);
    setOriginalData([...dataSource]);
    setPagination((prev) => ({
      ...prev,
      pageIndex: currentPage - 1,
    }));
  }, [dataSource]);

  const table = useReactTable({
    data: dataSrc,
    columns,
    pageCount: Math.ceil(totalRows / rowsPerPage),
    rowCount: rowsPerPage,
    manualPagination: true,
    manualFiltering: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onColumnSizingChange: setColSizing,
    getRowId: (originalRow, index) =>
      (originalRow as ColumnDataSource)?.id?.toString() || index,
    //filterFns: {},
    autoResetPageIndex: false,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnSizing: colSizing,
      //rowSelection,
      pagination,
    },
    meta: {
      editedRows,
      setEditedRows,
      validRows,
      setValidRows,
      actions,
      revertData: (id: string | number) => {
        setDataSrc((old) =>
          old.map((row) => {
            if (id.toString() === (row as ColumnDataSource).id.toString()) {
              const original = originalData.find(
                (r) => (r as ColumnDataSource).id.toString() === id.toString(),
              );
              if (!original) return row;
              return original;
            }
            return row;
          }),
        );
      },
      updateRow: (id: string | number) => {
        setOriginalData((old) =>
          old.map((row) => {
            if (id.toString() === (row as ColumnDataSource).id.toString()) {
              const current = dataSrc.find(
                (r) => (r as ColumnDataSource).id.toString() === id.toString(),
              );

              if (!current) return row;
              return current;
            }
            return row;
          }),
        );
      },
      // updateData: (
      //   rowIndex: number,
      //   columnId: string,
      //   value: string,
      //   isValid: boolean,
      // ) => {
      //   setData((old) =>
      //     old.map((row, index) => {
      //       if (index === rowIndex) {
      //         return {
      //           ...old[rowIndex],
      //           [columnId]: value,
      //         };
      //       }
      //       return row;
      //     }),
      //   );

      //   setValidRows((old: any) => ({
      //     ...old,
      //     [rowIndex]: { ...old[rowIndex], [columnId]: isValid },
      //   }));
      // },
      updateData: (
        id: string | number,
        columnId: string,
        value: string,
        isValid: boolean,
      ) => {
        setDataSrc((old) =>
          old.map((row) => {
            if (id.toString() === (row as ColumnDataSource).id.toString()) {
              return {
                ...row,
                [columnId]: value,
              };
            }
            return row;
          }),
        );

        setValidRows((old: any) => ({
          ...old,
          [id.toString()]: { ...old[id.toString()], [columnId]: isValid },
        }));
      },
      addRow: (id: string, newRow: TData) => {
        const rowToAdd = { ...newRow, ...{ id } };
        const setFunc = (old: TData[]) => [...old, rowToAdd];
        setDataSrc(setFunc);
        setOriginalData(setFunc);
      },
      removeRow: (id: string | number) => {
        setBackupData(dataSrc);

        const setFilterFunc = (old: ColumnDataSource[]) =>
          old.filter(
            (row: ColumnDataSource) => row.id.toString() !== id.toString(),
          );

        setDataSrc(setFilterFunc as () => TData[]);

        setOriginalData(setFilterFunc as () => TData[]);
      },
      restoreBackupRow: () => {
        setDataSrc(backupData);
        setOriginalData(backupData);
      },
      removeSelectedRows: (selectedRows: number[]) => {
        selectedRows.forEach((rowIndex) => {
          //deleteRow(data[rowIndex].id);
          console.log(
            "deleteRow-selected",
            (dataSrc[rowIndex] as ColumnDataSource).id,
          );
        });
      },
    },
  });

  const renderNewCellComponent = (table: any) => {
    if (!state.editor.liveMode || state.editor.previewMode) {
      return (
        <TableTabsMenu
          table={table}
          tabs={{ newCell: actions.insert, sync: actions.sync }}
        />
      );
    }
    const currentPage = state.pages.find(
      (pageBuilder) => pageBuilder.page.name === pageId,
    );
    if (actions.insert.enable || actions.sync.enable) {
      if (
        actions.insert.access === "public" ||
        actions.sync.access === "public"
      ) {
        return (
          <TableTabsMenu
            table={table}
            tabs={{ newCell: actions.insert, sync: actions.sync }}
          />
        );
      }
      if (!currentPage) {
        return null;
      }
      if (currentPage.page.accessType === "public") {
        if (
          userState &&
          compilerState.projectOwner &&
          userState.email === compilerState.projectOwner.email
        ) {
          return (
            <TableTabsMenu
              table={table}
              tabs={{ newCell: actions.insert, sync: actions.sync }}
            />
          );
        }
      }
      if (
        userState &&
        compilerState.projectOwner &&
        userState.email === compilerState.projectOwner.email
      ) {
        return (
          <TableTabsMenu
            table={table}
            tabs={{ newCell: actions.insert, sync: actions.sync }}
          />
        );
      }
      if (currentPage.page.allowed.length > 0) {
        if (userState) {
          const allowedUser = currentPage.page.allowed.find(
            (u) => u.user.email === userState.email,
          );
          if (allowedUser) {
            if (!allowedUser.readonly) {
              return (
                <TableTabsMenu
                  table={table}
                  tabs={{ newCell: actions.insert, sync: actions.sync }}
                />
              );
            }
          }
        }
      }
    }
    return null;
  };

  return (
    <div className="border px-2 w-full">
      <h3 className="w-full text-left text-3xl py-2">{title}</h3>
      <div className="flex items-center justify-between py-4">
        {enableSearch && (
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder={`Search by ${searchBy}...`}
              value={
                (table.getColumn(searchBy)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(searchBy)?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            {searchCreteria.length > 0 && (
              <div className="flex self-end gap-2">
                <Select value={searchBy} onValueChange={(e) => setSearchBy(e)}>
                  <SelectTrigger className="w-[180px] m-auto text-black">
                    <SelectValue placeholder="Choose search criteria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Criteria...</SelectLabel>
                      {searchCreteria.map((criteria: string, key: number) => (
                        <SelectItem key={`${key}_${criteria}`} value={criteria}>
                          {criteria}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
        {enablePagination && orderByCols.length > 0 && (
          <div className="flex gap-2">
            <div className="flex self-end flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Order By</Label>
              <Select
                value={orderCol}
                onValueChange={(e) => {
                  lastOrderColRef.current = e;
                  setOrderCol(e);
                  setOrderBy(() => ({
                    [e]: lastOrderByRef.current,
                  }));
                }}
              >
                <SelectTrigger className="w-[180px] m-auto text-black">
                  <SelectValue placeholder="Choose order by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select order by...</SelectLabel>
                    {orderByCols.map((orderCol: string, key: number) => (
                      <SelectItem key={`${key}_${orderCol}`} value={orderCol}>
                        {orderCol}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex self-end flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Asc/Desc</Label>
              <Select
                value={orderDirection}
                onValueChange={(e) => {
                  lastOrderByRef.current = e;
                  setOrderDirection(e);
                  setOrderBy(() => ({
                    [lastOrderColRef.current]: e,
                  }));
                }}
              >
                <SelectTrigger className="w-[180px] m-auto text-black">
                  <SelectValue placeholder="Choose direction order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select order direction...</SelectLabel>
                    <SelectItem value="ASC">ASC</SelectItem>
                    <SelectItem value="DESC">DESC</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <div className="flex self-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  if (column.id === "#_Actions") {
                    const some =
                      actions.details.enable ||
                      actions.insert.enable ||
                      actions.remove.enable ||
                      actions.update.enable;
                    if (!some) {
                      return null;
                    }
                  }
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table
          style={{
            ...styles,
            width: table.getTotalSize(),
            minWidth: "100%",
          }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="relative"
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center justify-between"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: (
                              <span>
                                <ArrowUp />
                              </span>
                            ),
                            desc: (
                              <span>
                                <ArrowDown />
                              </span>
                            ),
                          }[header.column.getIsSorted() as string] ??
                            (header.column.getCanSort() ? (
                              <ArrowDownUp className="h-4 w-4 ml-1 stroke-muted-foreground" />
                            ) : null)}
                        </div>
                      )}
                      <ColumnResizer header={header} />
                      {/* {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
                        ) : null}   */}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {enablePagination && (
        <div className="flex items-center justify-between p-2">
          <div className="flex-1 text-sm text-muted-foreground">
            showing{" "}
            {(currentPage - 1) * rowsPerPage +
              Math.min(
                rowsPerPage,
                totalRows - (currentPage - 1) * rowsPerPage,
              )}{" "}
            of {totalRows} row(s) .
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Pages</p>
              <Select
                value={`${currentPage}`}
                onValueChange={(value) => {
                  handleChangePage(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={currentPage} />
                </SelectTrigger>
                <SelectContent side="top">
                  {range({
                    start: 1,
                    stop: Math.ceil(totalRows / rowsPerPage),
                    step: 1,
                  }).map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handleChangePage(1)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handleChangePage(currentPage - 1)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handleChangePage(currentPage + 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handleChangePage(table.getPageCount())}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      {renderNewCellComponent(table)}
    </div>
  );
}
/*

<tfoot>
  <tr>
    <th colSpan={table.getCenterLeafColumns().length} align="right">
      <FooterCell table={table} />
    </th>
  </tr>
</tfoot>

const FooterCell = ({ table }: { table: any }) => {
  const meta = table.options.meta;
  const selectedRows = table.getSelectedRowModel().rows;
  const removeRows = () => {
    meta.removeSelectedRows(
      table.getSelectedRowModel().rows.map((row: any) => row.index),
    );
    table.resetRowSelection();
  };
  return (
    <div className="footer-buttons">
      {selectedRows.length > 0 ? (
        <Button variant="destructive" onClick={removeRows}>
          Remove Selected x
        </Button>
      ) : null}
      <Button variant="default" onClick={meta?.addRow}>
        Add New +
      </Button>
    </div>
  );
};
*/
// function Filter({ column }: { column: Column<any, unknown> }) {
//   const columnFilterValue = column.getFilterValue()
//   const { filterVariant } = column.columnDef.meta ?? {}

//   return filterVariant === 'range' ? (
//     <div>
//       <div className="flex space-x-2">
//         {/* See faceted column filters example for min max values functionality */}
//         <DebouncedInput
//           type="number"
//           value={(columnFilterValue as [number, number])?.[0] ?? ''}
//           onChange={value =>
//             column.setFilterValue((old: [number, number]) => [value, old?.[1]])
//           }
//           placeholder={`Min`}
//           className="w-24 border shadow rounded"
//         />
//         <DebouncedInput
//           type="number"
//           value={(columnFilterValue as [number, number])?.[1] ?? ''}
//           onChange={value =>
//             column.setFilterValue((old: [number, number]) => [old?.[0], value])
//           }
//           placeholder={`Max`}
//           className="w-24 border shadow rounded"
//         />
//       </div>
//       <div className="h-1" />
//     </div>
//   ) : filterVariant === 'select' ? (
//     <select
//       onChange={e => column.setFilterValue(e.target.value)}
//       value={columnFilterValue?.toString()}
//     >
//       {/* See faceted column filters example for dynamic select options */}
//       <option value="">All</option>
//       <option value="complicated">complicated</option>
//       <option value="relationship">relationship</option>
//       <option value="single">single</option>
//     </select>
//   ) : (
//     <DebouncedInput
//       className="w-36 border shadow rounded"
//       onChange={value => column.setFilterValue(value)}
//       placeholder={`Search...`}
//       type="text"
//       value={(columnFilterValue ?? '') as string}
//     />
//     // See faceted column filters example for datalist search suggestions
//   )
// }

// // A typical debounced input react component
// function DebouncedInput({
//   value: initialValue,
//   onChange,
//   debounce = 500,
//   ...props
// }: {
//   value: string | number
//   onChange: (value: string | number) => void
//   debounce?: number
// } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
//   const [value, setValue] = React.useState(initialValue)

//   React.useEffect(() => {
//     setValue(initialValue)
//   }, [initialValue])

//   React.useEffect(() => {
//     const timeout = setTimeout(() => {
//       onChange(value)
//     }, debounce)

//     return () => clearTimeout(timeout)
//   }, [value])

//   return (
//     <input {...props} value={value} onChange={e => setValue(e.target.value)} />
//   )
// }
