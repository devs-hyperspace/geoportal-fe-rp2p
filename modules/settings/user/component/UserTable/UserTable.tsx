"use client";

import { useUsers, useDeleteUser } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useUsersControl } from "@/modules/main-app/hooks/useUsersControl";
import { UserForm } from "../UserForm";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Card } from "@/components/ui/card";



const LoadingComponent = () => {
  return (
    <div className="absolute top-0 w-full flex items-center justify-center bg-black bg-opacity-60 z-40 h-full">
      <Loader2 className="w-12 h-12 animate-spin text-secondary" />
    </div>
  )
}

export const UserTable: React.FC<{ children?: React.ReactNode; guid: string }> = (props) => {
  const { data: users, isLoading } = useUsers(props.guid);

  const deleteUser = useDeleteUser(props.guid);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // State for delete confirmation
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUser.mutate(userToDelete.id);
      setIsDeleteOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <React.Fragment>
      <div className="relative p-8 rounded-lg bg-white mt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary">User Management System</h2>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="px-6 py-2 text-primary bg-secondary hover:bg-primary hover:text-white flex items-center gap-2 shadow-md"
          >
            <Plus size={18} /> Add User
          </Button>
        </div>

        {/* Add User Drawer */}
        <Drawer open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DrawerContent className="rounded-lg shadow-lg">
            <UserForm closeModal={() => setIsAddOpen(false)} guid={props.guid} />
          </DrawerContent>
        </Drawer>

        <Drawer open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DrawerContent>
            <UserForm closeModal={() => setIsEditOpen(false)} user={selectedUser} guid={props.guid} />
          </DrawerContent>
        </Drawer>


        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="text-gray-600">Are you sure you want to delete <strong>{userToDelete?.name}</strong>?</p>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        {/* User Table */}
        <div>
          <ScrollArea className="h-[70vh] rounded-md border">
            <Table className="w-full text-sm text-left text-gray-500 h-full">
              <TableHeader className="bg-gray-100 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="px-6 py-3">#</TableHead>
                  <TableHead className="px-6 py-3">Username</TableHead>
                  <TableHead className="px-6 py-3">Name</TableHead>
                  <TableHead className="px-6 py-3">Role</TableHead>
                  <TableHead className="px-6 py-3">Kota/Kabupaten</TableHead>
                  <TableHead className="px-6 py-3 text-center w-[100]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="relative">
                {isLoading && <LoadingComponent />}
                {users && users.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="px-6 py-3">{index + 1}</TableCell>
                      <TableCell className="px-6 py-3 font-medium">{user.username}</TableCell>
                      <TableCell className="px-6 py-3">{user.name}</TableCell>
                      <TableCell className="px-6 py-3">{user.role?.name || "N/A"}</TableCell>
                      <TableCell className="px-6 py-3">{user.kabkot?.name || "N/A"}</TableCell>
                      <TableCell className="px-6 py-3 flex gap-2 flex flex-row items-center justify-center w-[100]">
                        <Button
                          className="text-primary bg-secondary hover:bg-primary hover:text-white flex items-center gap-2 shadow-md"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 shadow-md"
                          onClick={() => {
                            setUserToDelete(user);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
          <div className="w-full flex justify-end items-center py-2">
            <Card className="text-sm p-2">Count Row: <span className="font-bold">{users?.length ? users?.length : 0}</span></Card>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
