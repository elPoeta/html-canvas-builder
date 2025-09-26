import { SelectOptionType } from "@/providers/webEditor/webEditor-provider";
import { Input } from "../Input";
import { DataCol, FormValues } from "./NewCell";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../Select";
import { Textarea } from "../TextArea";

type TableInputFormProps = {
  column: DataCol;
  handleInputChange: (e: React.ChangeEvent<HTMLElement>) => void;
  formValues: FormValues;
};

export const TableInputForm: React.FC<TableInputFormProps> = ({
  column,
  handleInputChange,
  formValues,
}) => {
  switch (column.meta.format) {
    case "select":
      return (
        <Select
          value={formValues[column.key] || ""}
          onValueChange={(e) =>
            handleInputChange({
              target: { value: e, name: `ADD_${column.key}` },
            } as React.ChangeEvent<HTMLSelectElement>)
          }
        >
          <SelectTrigger className="w-[97%] m-auto text-black">
            <SelectValue placeholder="Choose an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select...</SelectLabel>
              {column.meta.options.map(
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
    case "textarea":
      return (
        <Textarea
          id={`ADD_${column.key}`}
          name={`ADD_${column.key}`}
          value={formValues[column.key] || ""}
          onChange={(e) => handleInputChange(e)}
          className="mt-1"
          rows={5}
        />
      );
    default:
      return (
        <Input
          id={`ADD_${column.key}`}
          name={`ADD_${column.key}`}
          type={column.meta.format}
          value={formValues[column.key] || ""}
          onChange={(e) => handleInputChange(e)}
          className="mt-1"
        />
      );
  }
};
