/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useState } from "react";
import { NewCell } from "./NewCell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Tabs";
import {
  TableActionsPropsWebEditorContent,
  TableSyncActionSourceFile,
  TableSyncActionSourceGoogleSheet,
  TableSyncActionWebEditorContent,
} from "@/providers/webEditor/webEditor-provider";
import { SyncTable } from "./SyncTable";

export type TabsTableMenuState<T> = {
  newCell: TableActionsPropsWebEditorContent;
  sync: TableSyncActionWebEditorContent<T>;
};

type TableTabsMenuProps<T> = {
  table: unknown;
  tabs: TabsTableMenuState<T>;
};

export type TableTabContentChildrenMenuProps = {
  table: any;
  tabChange: (value: string) => void;
};

export const TableTabsMenu: React.FC<
  TableTabsMenuProps<
    TableSyncActionSourceFile | TableSyncActionSourceGoogleSheet
  >
> = ({ table, tabs }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tab, setTab] = useState("");

  const onTabChange = (value: string) => {
    setTab(value);
    setTimeout(() => {
      scroll();
    }, 200);
  };

  const scroll = () => {
    if (!ref || !ref.current) return;
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "end",
    });
  };

  return (
    <Tabs value={tab} onValueChange={onTabChange} className="w-[100%] my-1">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="newCell" disabled={!tabs.newCell.enable}>
          New Cell {!tabs.newCell.enable ? "(disabled)" : ""}
        </TabsTrigger>
        <TabsTrigger value="syncTable" disabled={!tabs?.sync?.enable}>
          Sync {!tabs?.sync?.enable ? "(disabled)" : ""}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="newCell">
        <NewCell table={table} tabChange={onTabChange} />
      </TabsContent>
      <TabsContent value="syncTable">
        <div ref={ref}>
          <SyncTable
            table={table}
            tabChange={onTabChange}
            syncAction={tabs.sync || {}}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};
