/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "../Input";
import { Textarea } from "../TextArea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../Select";
import { SelectOptionType } from "@/providers/webEditor/webEditor-provider";

export const TableCell = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(() => initialValue);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    displayValidationMessage(e);
    tableMeta?.updateData(
      row.id,
      // row.index,
      column.id,
      value,
      e.target.validity.valid,
    );
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    displayValidationMessage(e);
    setValue(e.target.value);
    tableMeta?.updateData(
      row.id,
      // row.index,
      column.id,
      e.target.value,
      e.target.validity.valid,
    );
  };

  const displayValidationMessage = <
    T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  >(
    e: ChangeEvent<T>,
  ) => {
    if (columnMeta?.validate) {
      const isValid = columnMeta.validate(e.target.value);
      if (isValid) {
        e.target.setCustomValidity("");
        setValidationMessage("");
      } else {
        e.target.setCustomValidity(columnMeta.validationMessage);
        setValidationMessage(columnMeta.validationMessage);
      }
    } else if (e.target.validity.valid) {
      setValidationMessage("");
    } else {
      setValidationMessage(e.target.validationMessage);
    }
  };

  if (tableMeta?.editedRows[row.id]) {
    switch (columnMeta?.format) {
      case "select":
        return (
          <Select
            value={value}
            onValueChange={(e) =>
              onSelectChange({
                target: { value: e, validity: { valid: true } },
              } as ChangeEvent<HTMLSelectElement>)
            }
          >
            <SelectTrigger className="w-[97%] m-auto text-black">
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select...</SelectLabel>
                {columnMeta?.options?.map(
                  (option: SelectOptionType, key: number) => (
                    <SelectItem
                      key={`${key}_${option.value}`}
                      value={option.value}
                    >
                      {option.text}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        );

      case "text":
      case "number":
      case "range":
      case "date":
      case "color":
      case "password":
      case "email":
      case "time":
        return (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            type={columnMeta?.type || "text"}
            required={columnMeta?.required}
            pattern={columnMeta?.pattern}
            title={validationMessage}
            disabled={columnMeta?.disabled}
          />
        );
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            required={columnMeta?.required}
            title={validationMessage}
            disabled={columnMeta?.disabled}
          />
        );
      default:
        return <span>{value}</span>;
    }
  }
  return <div className="max-h-40 overflow-y-auto">{value}</div>;
};

export const TableCellUneditable = ({ getValue }: any) => {
  return <span>{getValue()}</span>;
};
