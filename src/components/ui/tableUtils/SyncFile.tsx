/** eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useState } from "react";
import { Label } from "../Label";
import clsx from "clsx";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "../FileUploader";
import { FileSvgDraw } from "@/components/webEditor/componentUtils/FileSvgDraw";
import { Paperclip } from "lucide-react";
import { Button } from "../Button";
import { CompilerFileUploadForm } from "@/components/webEditor/componentUtils/CompilerFileUploadForm";
import { useCompiler } from "@/providers/compiler/use-compiler";
import { useToast } from "@/providers/toaster/use-toast";
import { uploadFile } from "@/lib/compiler/uploadFile";
import { ProgressWithValue } from "../ProgressWithValue";
import {
  TableSyncActionSourceFile,
  TableSyncActionWebEditorContent,
} from "@/providers/webEditor/webEditor-provider";
import { getJsonEncoded } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { Input } from "../Input";
import { ALIAS_SHARE_KEY } from "@/lib/constants";
import { compilerServiceManager } from "@/lib/service/CompilerServiceManager";

type SyncFileProps = {
  tabChange: (value: string) => void;
  actionContent: TableSyncActionWebEditorContent<TableSyncActionSourceFile>;
};

export const SyncFile: React.FC<SyncFileProps> = ({
  tabChange,
  actionContent,
}) => {
  const { pageId } = useParams();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadActions, setUploadActions] = useState({
    uploading: false,
    synchronizing: false,
  });
  const { compilerState, compilerDispatch } = useCompiler();
  const { toast } = useToast();

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
    accept: {
      "text/*": [".csv"],
    },
  };

  const runSyncFile = async (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    ev.preventDefault();
    const { notValid, message } = validateFileRunSync();
    if (notValid) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return;
    }

    setUploadActions({
      synchronizing: true,
      uploading: true,
    });
    const { content, error } =
      await window.runCompiler.getProgramExecutionUploadId({
        compositeProjectId: compilerState.projectCompositeId!,
      });
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setUploadActions((prev) => ({
        ...prev,
        uploading: false,
      }));
      return;
    }
    const url = `${window.baseCompilerUrl}dwr/ProgramExecutionUploadFileServlet?id=${content}&projectIdParam=${compilerState.projectCompositeId!}&isShared=${window.__BUILDER__PAGE.isShared}`;

    uploadFile({
      form: formRef.current!,
      url,
      onProgress,
      onUploadError,
      onUploadSuccess,
    });
  };

  const onUploadSuccess = () => {
    setUploadActions((prev) => ({
      ...prev,
      uploading: false,
    }));

    const fileName = files![0].name.replace(/\s+/g, "_").toLowerCase();
    const jsonEncoded = getJsonEncoded(
      JSON.stringify({
        fileName,
        tableName: actionContent.tableName,
        columns: actionContent.columns,
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
        hasExecutionId: true,
        projectCompositeId: compilerState.projectCompositeId!,
        port: compilerState.port,
        method: actionContent.path,
        args: jsonEncoded,
        socketProjectExecProps: compilerState.socketProjectExecProps,
        typeMessage: `${pageId!}_SYNC_${actionContent.path}`,
      },
    });
  };

  const onUploadError = (error: string) => {
    console.error(error);
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
    setUploadActions({
      synchronizing: false,
      uploading: false,
    });
  };

  const onProgress = (progress: number) => {
    setUploadPercentage(progress);
  };

  const validateFileRunSync = () => {
    if (!formRef.current) {
      return { notValid: true, message: "Unexpected error" };
    }
    if (!files || !files.length) {
      return { notValid: true, message: "Drag and drop a csv file, please" };
    }

    return { notValid: false, message: "" };
  };

  return (
    <div>
      <CompilerFileUploadForm
        formRef={formRef}
        files={files || []}
        id="uploadFileFormSyncFile"
        name="uploadFileFormSyncFile"
      />
      <h3 className="font-bold text-center my-2">Sync csv file</h3>
      <div className="flex flex-col gap-2 my-2">
        <Label className="text-muted-foreground ml-4">Table</Label>
        <Input
          readOnly
          value={actionContent.tableName}
          className="w-[97%] m-auto"
        />
      </div>

      <div className="flex flex-col gap-2 my-2">
        <Label className="text-muted-foreground ml-4">Columns</Label>
        <Input
          readOnly
          value={actionContent.columns.reduce(
            (acc, c) => `${acc === "" ? acc : `${acc}, `}${c}`,
            "",
          )}
          className="w-[97%] m-auto"
        />
      </div>
      <Label className={clsx("px-2 text-sm py-2 text-muted-foreground", {})}>
        File csv
      </Label>
      <FileUploader
        value={files}
        onValueChange={setFiles}
        dropzoneOptions={dropZoneConfig}
        className="relative bg-background rounded-lg p-2"
      >
        <FileInput
          className="outline-dashed outline-1 outline-primary"
          inputName="syncTableFile"
          inputId="syncTableFile"
        >
          <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
            <FileSvgDraw prefixText="" />
          </div>
        </FileInput>
        <FileUploaderContent>
          {files &&
            files.length > 0 &&
            files.map((file, i) => (
              <FileUploaderItem key={i} index={i}>
                <Paperclip className="h-4 w-4 stroke-current" />
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
      </FileUploader>
      <div
        className={clsx("w-full space-y-2 px-10", {
          hidden: !uploadActions.synchronizing,
        })}
      >
        <ProgressWithValue
          key="follow"
          value={uploadPercentage}
          position="follow"
        />
      </div>
      <div>
        <div className="flex my-3 ml-auto mr-3 items-center justify-end w-fit gap-3">
          <Button
            onClick={() => {
              tabChange("");
            }}
            className="w-20 text-red-700 hover:bg-red-700 hover:text-white"
            variant="outline"
            disabled={uploadActions.uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={runSyncFile}
            className="w-20 bg-emerald-600 hover:bg-emerald-700"
            disabled={uploadActions.uploading}
          >
            Sync
          </Button>
        </div>
      </div>
    </div>
  );
};
