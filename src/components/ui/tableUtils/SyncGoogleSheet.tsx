import {
  TableSyncActionSourceGoogleSheet,
  TableSyncActionWebEditorContent,
} from "@/providers/webEditor/webEditor-provider";
import { Button } from "../Button";
import { Input } from "../Input";
import { Label } from "../Label";
import { useCompiler } from "@/providers/compiler/use-compiler";
import { useParams } from "react-router-dom";
import { getJsonEncoded } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useToast } from "@/providers/toaster/use-toast";
import { Badge } from "../Badge";
import { ALIAS_SHARE_KEY } from "@/lib/constants";
import { compilerServiceManager } from "@/lib/service/CompilerServiceManager";

type SyncGSheetProps = {
  tabChange: (value: string) => void;
  actionContent: TableSyncActionWebEditorContent<TableSyncActionSourceGoogleSheet>;
};

export const SyncGoogleSheet: React.FC<SyncGSheetProps> = ({
  tabChange,
  actionContent,
}) => {
  const { compilerState, compilerDispatch } = useCompiler();
  const { pageId } = useParams();
  const { toast } = useToast();
  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    const table = compilerState.projectConfig?.model.tables.find(
      (table) => table.name === actionContent.tableName,
    );
    const cols = table ? table.columns.map((c) => c.name) : [];
    setColumns(cols);
  }, [compilerState.projectConfig, actionContent.tableName]);

  useEffect(() => {
    if (
      compilerState.currentRunning === "NULL_NILL" ||
      compilerState.currentRunning !== `SYNC_${actionContent.path}`
    ) {
      return;
    }
    const outputAssetPage = compilerState.outputAssetPage[pageId || ""];
    if (!outputAssetPage) {
      return;
    }
    if (!outputAssetPage.outputAsset) {
      return;
    }

    const statusCode: number = outputAssetPage.outputAsset.statusCode;

    if (statusCode === 400) {
      toast({
        title: "Error",
        description:
          outputAssetPage.outputAsset?.error?.message ||
          "An unexpected error has occurred",
        variant: "destructive",
      });
      return;
    }
    if (statusCode === 200) {
      toast({
        title: "Sync Completed",
        description: "",
      });
      compilerDispatch({
        type: "SET_COMPILER_RESULTS",
        payload: {
          outputAssetRecord: {
            outputAsset: null,
          },
        },
      });
      tabChange("");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compilerState.outputAssetPage, pageId, actionContent.path, toast]);

  const runSync = async (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    ev.preventDefault();

    const jsonEncoded = getJsonEncoded(
      JSON.stringify({
        spreadsheetId: actionContent.source.sheetId,
        range: `${actionContent.source.sheetName}!${actionContent.source.range}`,
        tableName: actionContent.tableName,
        columns: columns,
        [ALIAS_SHARE_KEY]: window.__BUILDER__PAGE.alias,
      }),
    );

    compilerDispatch({
      type: "SET_CURRENT_RUNNING",
      payload: {
        currentRunning: `SYNC_${actionContent.path}`,
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
        method: actionContent.path,
        args: jsonEncoded,
        socketProjectExecProps: compilerState.socketProjectExecProps,
        typeMessage: `${pageId!}_SYNCG_${actionContent.path}`,
      },
    });
  };

  return (
    <div>
      <h3 className="font-bold text-center my-2">Sync google sheet</h3>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground ml-4">Table</Label>
          <Input
            readOnly
            value={actionContent.tableName}
            className="w-[97%] m-auto"
          />
        </div>

        <div className="flex flex-col gap-2 items-center justify-center">
          <Label className="self-start text-muted-foreground ml-4">
            Columns
          </Label>
          <div className="flex items-center gap-2 justify-start rounded-md border border-input bg-background p-2 flex-wrap w-[97%]">
            {columns.map((col, index) => (
              <Badge key={`syncCol_${col}_${index}`} variant="secondary">
                {col}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground ml-4">Google Sheet ID</Label>
          <Input
            readOnly
            value={actionContent.source.sheetId}
            className="w-[97%] m-auto"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground ml-4">Sheet Name</Label>
          <Input
            readOnly
            value={actionContent.source.sheetName}
            className="w-[97%] m-auto"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground ml-4">Sheet Range</Label>
          <Input
            readOnly
            value={actionContent.source.range}
            className="w-[97%] m-auto"
          />
        </div>
      </div>
      <div>
        <div className="flex my-3 ml-auto mr-3 items-center justify-end w-fit gap-3">
          <Button
            onClick={() => {
              tabChange("");
            }}
            className="w-20 text-red-700 hover:bg-red-700 hover:text-white"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={runSync}
            className="w-20 bg-emerald-600 hover:bg-emerald-700"
          >
            Sync
          </Button>
        </div>
      </div>
    </div>
  );
};
