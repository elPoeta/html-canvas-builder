/* eslint-disable @typescript-eslint/no-explicit-any */

import { Checkbox } from "../Checkbox";

export const SelectAllCells = ({ table }: { table: any }) => {
  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        title="Select all"
      />
    </div>
  );
};

export const SelectCell = ({ row }: { row: any }) => {
  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={row.getToggleSelectedHandler()}
        aria-label="Select"
        title="Select"
      />
    </div>
  );
};
