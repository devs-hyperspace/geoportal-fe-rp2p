"use client";

import { useUsers, useDeleteUser } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { UserForm } from "../../component/UserForm";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useUsersControl } from "@/modules/main-app/hooks/useUsersControl";
import { UserTable } from "../../component/UserTable";

export const UserSettingsContainer:React.FC<{ children?: React.ReactNode, guid?:string}> = (props) => {
  return props.guid && (
    <React.Fragment>
      <UserTable guid={props.guid} />
    </React.Fragment>
  );
};
