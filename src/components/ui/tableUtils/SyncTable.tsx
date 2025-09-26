import {
  TableSyncActionSourceFile,
  TableSyncActionSourceGoogleSheet,
  TableSyncActionWebEditorContent,
} from "@/providers/webEditor/webEditor-provider";
import { TableTabContentChildrenMenuProps } from "./TableTabsMenu";
import { SyncFile } from "./SyncFile";
import { SyncGoogleSheet } from "./SyncGoogleSheet";

export const SyncTable: React.FC<
  TableTabContentChildrenMenuProps & {
    syncAction: TableSyncActionWebEditorContent<
      TableSyncActionSourceFile | TableSyncActionSourceGoogleSheet
    >;
  }
> = ({ tabChange, syncAction }) => {
  switch (syncAction?.source.from) {
    case "FILE":
      return (
        <SyncFile
          tabChange={tabChange}
          actionContent={
            syncAction as TableSyncActionWebEditorContent<TableSyncActionSourceFile>
          }
        />
      );
    case "GOOGLE_SHEET":
      return (
        <SyncGoogleSheet
          tabChange={tabChange}
          actionContent={
            syncAction as TableSyncActionWebEditorContent<TableSyncActionSourceGoogleSheet>
          }
        />
      );
    default:
      return null;
  }
};
