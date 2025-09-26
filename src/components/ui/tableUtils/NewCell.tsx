/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button } from "../Button";
import { Label } from "../Label";
import { useCompiler } from "@/providers/compiler/use-compiler";
import { OutputAsset } from "@/providers/compiler/compiler-provider";
import { getJsonEncoded } from "@/lib/utils";
import { useToast } from "@/providers/toaster/use-toast";
import { TableActionsPropsWebEditorContent } from "@/providers/webEditor/webEditor-provider";
import { useParams } from "react-router-dom";
import { TableInputForm } from "./TableInputForm";
import { TableTabContentChildrenMenuProps } from "./TableTabsMenu";
import { ALIAS_SHARE_KEY } from "@/lib/constants";
import { compilerServiceManager } from "@/lib/service/CompilerServiceManager";

export type DataCol = {
  key: string;
  header: string;
  meta: {
    format: string;
    isSelectable: boolean;
    options: [];
  };
};

export type FormValues = {
  [key in string]: string | null;
};

export const NewCell: React.FC<TableTabContentChildrenMenuProps> = ({
  table,
  tabChange,
}) => {
  const meta = table.options.meta;
  const action: TableActionsPropsWebEditorContent = meta.actions.insert;
  const { toast } = useToast();
  const { compilerState, compilerDispatch } = useCompiler();
  const [responseData, setResponseData] = useState<OutputAsset | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [columnsForm, setColumnsForm] = useState<DataCol[]>([]);
  const [formValues, setFormValues] = useState<FormValues>({});

  const { pageId } = useParams();

  useEffect(() => {
    openRowForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (compilerState.currentRunning !== `INSERT_${action.path}`) {
      return;
    }
    if (responseData !== null) return;
    const outputAssetPage = compilerState.outputAssetPage[pageId || ""];
    if (
      pageId &&
      outputAssetPage &&
      outputAssetPage.outputAsset !== null &&
      "error" in outputAssetPage.outputAsset
    ) {
      toast({
        title: "Error",
        description:
          outputAssetPage.outputAsset?.error?.messagee ||
          "An error was occured",
        variant: "destructive",
      });
      compilerDispatch({
        type: "CLEAR_COMPILER_RESULTS",
        payload: {
          outputAssetRecord: {
            pageId,
          },
        },
      });
      return;
    }
    if (
      pageId &&
      outputAssetPage &&
      outputAssetPage.outputAsset !== null &&
      action.key in outputAssetPage.outputAsset!
    ) {
      if (outputAssetPage.outputAsset![action.key].id === null) {
        toast({
          title: "Error",
          description: "An error was occured",
          variant: "destructive",
        });
        compilerDispatch({
          type: "CLEAR_COMPILER_RESULTS",
          payload: {
            outputAssetRecord: {
              pageId,
            },
          },
        });
        return;
      }
      if (
        pageId &&
        outputAssetPage &&
        outputAssetPage.outputAsset !== null &&
        action.key in outputAssetPage.outputAsset
      ) {
        setResponseData(outputAssetPage.outputAsset[action.key]);
        meta!.addRow(outputAssetPage.outputAsset[action.key].id, formValues);
        tabChange("");
        setIsFormOpen(false);
        compilerDispatch({
          type: "CLEAR_COMPILER_RESULTS",
          payload: {
            outputAssetRecord: {
              pageId,
            },
          },
        });
      }
    }
  }, [
    compilerState.outputAssetPage,
    compilerState.currentRunning,
    action.key,
    action.path,
    setResponseData,
    responseData,
    formValues,
    meta,
    compilerDispatch,
    toast,
    pageId,
    tabChange,
  ]);

  const openRowForm = () => {
    setResponseData(null);
    const columns: DataCol[] = Object.values(
      table.options.columns
        .filter((col: any) => col.id !== "#_Actions" && col.id !== "#_Select")
        .reduce(
          (acc: any, col: any) => {
            const k = col.accessorKey;
            acc[k as string] = {
              key: k,
              header: col.header,
              meta: col.meta,
            };
            return acc as Record<string, string>;
          },
          {} as Record<string, string>,
        ),
    );

    setFormValues(
      columns.reduce((acc: FormValues, cur: DataCol) => {
        acc[cur.key] = cur.key !== "id" ? "" : null;
        return acc;
      }, {}),
    );
    setIsFormOpen(true);
    setColumnsForm(columns);
  };

  const addNewRow = () => {
    setResponseData(null);
    const jsonEncoded = getJsonEncoded(
      JSON.stringify({
        rows: formValues,
        [ALIAS_SHARE_KEY]: window.__BUILDER__PAGE.alias,
      }),
    );
    compilerDispatch({
      type: "SET_CURRENT_RUNNING",
      payload: {
        currentRunning: `INSERT_${action.path}`,
        outputAssetRecord: {
          pageId: pageId!,
        },
      },
    });

    compilerServiceManager.execute({
      contextService: compilerState.contextService,
      dispatch: compilerDispatch,
      payloadService: {
        projectCompositeId: compilerState.projectCompositeId!,
        port: compilerState.port,
        method: action.path,
        args: jsonEncoded,
        socketProjectExecProps: compilerState.socketProjectExecProps,
        typeMessage: `${pageId!}_${action.path}`,
      },
    });
  };

  const handleInputChange = (e: any) => {
    const [, key] = e.target.name.split("_");
    setFormValues((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const getHeaderCellWidth = (id: string) => {
    if (!table.getHeaderGroups().length) return "auto";
    const header = table
      .getHeaderGroups()[0]
      .headers.find((header: any) => header.id === id);
    return header?.getSize() || "auto";
  };

  return (
    <section className="mt-4">
      {isFormOpen && (
        <>
          <div className="flex flex-col overflow-x-auto">
            <div
              className="flex gap-1 my-2"
              style={{
                width: table.getTotalSize(),
                minWidth: "100%",
              }}
            >
              {columnsForm
                .filter((col) => col.key !== "id")
                .map((col) => (
                  <Label
                    style={{
                      width: getHeaderCellWidth(col.key),
                    }}
                    key={col.key}
                  >
                    {col.header}

                    <TableInputForm
                      handleInputChange={handleInputChange}
                      column={col}
                      formValues={formValues}
                    />
                  </Label>
                ))}
            </div>
          </div>
          <div className="flex my-3 ml-auto mr-3 items-center justify-end w-fit gap-3">
            <Button
              onClick={() => {
                tabChange("");
                setIsFormOpen(false);
              }}
              className="w-20 text-red-700 hover:bg-red-700 hover:text-white"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={addNewRow}
              className="w-20 bg-emerald-600 hover:bg-emerald-700"
            >
              Add
            </Button>
          </div>
        </>
      )}
    </section>
  );
};
