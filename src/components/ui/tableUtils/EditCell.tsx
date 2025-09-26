/* eslint-disable @typescript-eslint/no-explicit-any */

import { MouseEvent, useCallback, useEffect, useState } from "react";
import { Button } from "../Button";
import { CheckCircle2, CircleX, Edit2, Eye, Trash } from "lucide-react";
import { TableActionsWebEditorContent } from "@/providers/webEditor/webEditor-provider";
import { useToast } from "@/providers/toaster/use-toast";
import { useCompiler } from "@/providers/compiler/use-compiler";
import { getJsonEncoded } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useWebEditor } from "@/providers/webEditor/use-webEditor";
import { staticRoutes } from "@/router/BrowserRouter";
import { useModal } from "@/providers/modal/use-modal";
import CustomModal from "@/components/global/modal/CustomModal";
import { useUser } from "@/providers/user/use-user";
import { ALIAS_SHARE_KEY } from "@/lib/constants";
import { compilerServiceManager } from "@/lib/service/CompilerServiceManager";

type ClickedType = "DETAILS" | null;

export const EditCell = ({ row, table }: { row: any; table: any }) => {
  const { setOpen, setClose } = useModal();
  const { toast } = useToast();
  const { compilerState, compilerDispatch } = useCompiler();
  const { userState } = useUser();
  const { state } = useWebEditor();
  const { pageId } = useParams();
  const [clicked, setClicked] = useState<ClickedType>(null);
  const navigate = useNavigate();

  const meta = table.options.meta;
  const actions: TableActionsWebEditorContent = meta.actions;
  const updateAction = actions.update;
  const removeAction = actions.remove;
  const detailsAction = actions.details;

  const validRow = meta?.validRows[row.id];
  const disableSubmit = validRow
    ? Object.values(validRow)?.some((item) => !item)
    : false;

  const setEditedRows = (e: MouseEvent<HTMLButtonElement>) => {
    const dataName = e.currentTarget.dataset.name;
    meta?.setEditedRows((old: []) => ({
      ...old,
      [row.id.toString()]: !old[row.id.toString()],
    }));
    if (dataName !== "edit") {
      if (e.currentTarget.dataset.name === "cancel") {
        meta?.revertData(row.id);
      } else {
        submitUpdateRow();
      }
    }
  };

  const submitUpdateRow = () => {
    const rows: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row.original)) {
      rows[key] = value;
    }
    const jsonEncoded = getJsonEncoded(
      JSON.stringify({ rows, [ALIAS_SHARE_KEY]: window.__BUILDER__PAGE.alias }),
    );

    compilerDispatch({
      type: "SET_CURRENT_RUNNING",
      payload: {
        currentRunning: `UPDATE_${updateAction.path}`,
        outputAssetRecord: {
          pageId: pageId || `${state.editor.pageId}`,
        },
      },
    });

    executeAction({ method: updateAction.path, jsonEncoded, action: "UPDATE" });
  };

  const viewRowDetails = () => {
    const jsonEncoded = getJsonEncoded(
      JSON.stringify({
        id: row.original.id,
        [ALIAS_SHARE_KEY]: window.__BUILDER__PAGE.alias,
      }),
    );
    compilerDispatch({
      type: "SET_CURRENT_RUNNING",
      payload: {
        currentRunning: `DETAILS_${detailsAction.path}`,
        outputAssetRecord: {
          pageId: `${detailsAction!.redirect}`,
          extraProps: {
            actions: detailsAction,
          },
        },
      },
    });

    executeAction({
      method: detailsAction.path,
      jsonEncoded,
      action: "DETAILS",
    });
  };

  const submitRemoveRow = () => {
    meta?.removeRow(row.original.id);
    const jsonEncoded = getJsonEncoded(
      JSON.stringify({
        id: row.original.id,
        [ALIAS_SHARE_KEY]: window.__BUILDER__PAGE.alias,
      }),
    );
    compilerDispatch({
      type: "SET_CURRENT_RUNNING",
      payload: {
        currentRunning: `REMOVE_${removeAction.path}`,
        outputAssetRecord: {
          pageId: pageId || `${state.editor.pageId}`,
        },
      },
    });

    executeAction({ method: removeAction.path, jsonEncoded, action: "REMOVE" });
    setClose();
  };

  useEffect(() => {
    if (compilerState.currentRunning !== `UPDATE_${updateAction.path}`) {
      return;
    }
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
          outputAssetPage.outputAsset?.error?.message || "An error was occured",
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
      meta?.revertData(row.id);
      return;
    }
    if (
      pageId &&
      outputAssetPage &&
      outputAssetPage.outputAsset !== null &&
      updateAction.key in outputAssetPage.outputAsset
    ) {
      if (outputAssetPage.outputAsset[updateAction.key].id === null) {
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
        meta?.revertData(row.id);
        return;
      }

      compilerDispatch({
        type: "CLEAR_COMPILER_RESULTS",
        payload: {
          outputAssetRecord: {
            pageId,
          },
        },
      });
      meta?.updateRow(outputAssetPage.outputAsset[updateAction.key].id);
    }
  }, [
    compilerState.outputAssetPage,
    compilerState.currentRunning,
    updateAction.key,
    updateAction.path,
    meta,
    compilerDispatch,
    toast,
    row.id,
    pageId,
  ]);

  useEffect(() => {
    if (compilerState.currentRunning !== `REMOVE_${removeAction.path}`) {
      return;
    }
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
          outputAssetPage.outputAsset?.error?.message || "An error was occured",
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
      meta?.restoreBackupRow();
      return;
    }
    if (
      pageId &&
      outputAssetPage &&
      outputAssetPage.outputAsset !== null &&
      removeAction.key in outputAssetPage.outputAsset!
    ) {
      if (outputAssetPage.outputAsset[removeAction.key].id === null) {
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
        meta?.restoreBackupRow();
        return;
      }

      compilerDispatch({
        type: "CLEAR_COMPILER_RESULTS",
        payload: {
          outputAssetRecord: {
            pageId,
          },
        },
      });

      meta?.removeRow(outputAssetPage.outputAsset[removeAction.key].id);
    }
  }, [
    compilerState.outputAssetPage,
    compilerState.currentRunning,
    removeAction.key,
    removeAction.path,
    meta,
    compilerDispatch,
    toast,
    pageId,
  ]);

  const redirect = useCallback(() => {
    const [, projectId] = compilerState.projectCompositeId
      ? compilerState.projectCompositeId.split("_")
      : ["", ""];

    const activePageId = detailsAction.redirect;
    if (projectId === "" || !activePageId) {
      toast({
        title: "Error",
        description:
          "An error has occurred and you will not be redirected - [ unrecognized project ]",
        variant: "destructive",
      });
      return;
    }

    const url = state.editor.liveMode
      ? `/${staticRoutes.BASE}/live/${projectId}/${activePageId}`
      : `/${staticRoutes.BASE}/editor/${projectId}/${activePageId}`;

    navigate(url, {
      relative: "route",
    });
  }, [
    compilerState.projectCompositeId,
    state.editor.liveMode,
    detailsAction.redirect,
    toast,
    navigate,
  ]);

  useEffect(() => {
    if (clicked !== "DETAILS") {
      return;
    }
    if (compilerState.currentRunning !== `DETAILS_${detailsAction.path}`) {
      return;
    }
    const outputAssetPage =
      compilerState.outputAssetPage[detailsAction.redirect || ""];
    if (
      outputAssetPage &&
      outputAssetPage.outputAsset !== null &&
      "error" in outputAssetPage.outputAsset
    ) {
      toast({
        title: "Error",
        description:
          outputAssetPage.outputAsset?.error?.message || "An error was occured",
        variant: "destructive",
      });
      compilerDispatch({
        type: "CLEAR_COMPILER_RESULTS",
        payload: {
          outputAssetRecord: {
            pageId: detailsAction.redirect!,
          },
        },
      });
      return;
    }
    if (outputAssetPage && outputAssetPage.outputAsset !== null) {
      redirect();
    }
  }, [
    compilerState.outputAssetPage,
    compilerState.currentRunning,
    compilerDispatch,
    toast,
    detailsAction.redirect,
    detailsAction.path,
    redirect,
    clicked,
  ]);

  const executeAction = ({
    method,
    jsonEncoded,
    action,
  }: {
    method: string;
    jsonEncoded: string;
    action: string;
  }) => {
    compilerServiceManager.execute({
      contextService: compilerState.contextService,
      dispatch: compilerDispatch,
      payloadService: {
        projectCompositeId: compilerState.projectCompositeId!,
        port: compilerState.port,
        method,
        args: jsonEncoded,
        socketProjectExecProps: compilerState.socketProjectExecProps,
        typeMessage: `${pageId!}_${action}_${method}`,
      },
    });
  };

  const getButtonAction = (type: string) => {
    if (type === "EDIT") {
      return (
        <Button
          onClick={setEditedRows}
          data-name="edit"
          size={"icon"}
          variant={"ghost"}
          className="hover:bg-sky-200"
        >
          <Edit2 className=" stroke-sky-600" />
        </Button>
      );
    }
    if (type === "DETAILS") {
      return (
        <Button
          onClick={() => {
            setClicked("DETAILS");
            viewRowDetails();
          }}
          data-name="details"
          size={"icon"}
          variant={"ghost"}
          className="hover:bg-slate-200"
        >
          <Eye className="stroke-slate-600" />
        </Button>
      );
    }
    return (
      <Button
        data-name="remove"
        size={"icon"}
        variant={"ghost"}
        className="hover:bg-red-200"
        onClick={() => {
          setOpen(
            <CustomModal
              title="Remove Row?"
              subheading="Be careful, this action is irreversible."
            >
              <div className="my-2 flex flex-col">
                <p className="p-2">
                  Are you sure you want to delete the row{" "}
                  <span className="text-red-600 font-bold italic">
                    '{row.original.id}'
                  </span>{" "}
                  ?
                </p>
                <Button
                  className="my-1 ml-auto"
                  variant="destructive"
                  onClick={() => submitRemoveRow()}
                >
                  Accept
                </Button>
              </div>
            </CustomModal>,
          );
        }}
      >
        <Trash className=" stroke-red-600" />
      </Button>
    );
  };
  const renderActionButtonComponent = (type: string) => {
    const actionType =
      type === "EDIT" ? "update" : type === "REMOVE" ? "remove" : "details";
    if (!state.editor.liveMode || state.editor.previewMode) {
      return getButtonAction(type);
    }
    const currentPage = state.pages.find(
      (pageBuilder) => pageBuilder.page.name === pageId,
    );
    if (actions[actionType].enable) {
      if (actions[actionType].access === "public") {
        return getButtonAction(type);
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
          return getButtonAction(type);
        }
      }
      if (
        userState &&
        compilerState.projectOwner &&
        userState.email === compilerState.projectOwner.email
      ) {
        return getButtonAction(type);
      }
      if (currentPage.page.allowed.length > 0) {
        if (userState) {
          const allowedUser = currentPage.page.allowed.find(
            (u) => u.user.email === userState.email,
          );
          if (allowedUser) {
            if (!allowedUser.readonly) {
              return getButtonAction(type);
            }
          }
        }
      }
    }
    return null;
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {renderActionButtonComponent("DETAILS")}
      {meta?.editedRows[row.id] ? (
        <div className="flex gap-2">
          <Button
            onClick={setEditedRows}
            data-name="cancel"
            size={"icon"}
            variant={"ghost"}
            className="hover:bg-red-200"
          >
            <CircleX className="stroke-red-600" />
          </Button>
          <Button
            onClick={setEditedRows}
            data-name="done"
            disabled={disableSubmit}
            size={"icon"}
            variant={"ghost"}
            className="hover:bg-emerald-200"
          >
            <CheckCircle2 className="stroke-emerald-600" />
          </Button>
        </div>
      ) : (
        <div>
          {renderActionButtonComponent("EDIT")}
          {renderActionButtonComponent("REMOVE")}
        </div>
      )}
    </div>
  );
};
