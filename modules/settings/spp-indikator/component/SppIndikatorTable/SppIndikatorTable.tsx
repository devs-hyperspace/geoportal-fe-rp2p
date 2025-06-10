"use client";

import { useSppIndikators, useDeleteSppIndikator } from "../../hooks/useSppIndikators";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Plus, Edit, Trash2, Loader2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { SppIndikatorForm } from "../SppIndikatorForm";

const LoadingComponent = () => (
  <div className="absolute top-0 w-full flex items-center justify-center bg-black bg-opacity-60 z-40 h-[70vh]">
    <Loader2 className="w-12 h-12 animate-spin text-secondary" />
  </div>
);

export const SppIndikatorTable: React.FC<{ guid: string }> = (props) => {
  const { data: indikators, isLoading } = useSppIndikators();

  
  const deleteIndikator = useDeleteSppIndikator();

  const [selectedIndikator, setSelectedIndikator] = useState<any | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = (indikator: any) => {
    setSelectedIndikator(indikator);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedIndikator) {
      deleteIndikator.mutate(selectedIndikator.id);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card className="relative p-6 rounded-lg bg-white space-y-6 w-full border-none shadow-none">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-primary">Pengaturan SPP Indikator</h2>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="px-6 py-2 text-primary bg-secondary hover:bg-primary hover:text-white flex items-center gap-2 shadow-md"
        >
          <Plus size={18} /> Add Indikator
        </Button>
      </div>

      {/* Add/Edit Indicator Drawer */}
      <Drawer open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DrawerContent className="rounded-lg shadow-lg">
          <SppIndikatorForm closeModal={() => setIsAddOpen(false)} />
        </DrawerContent>
      </Drawer>

      <Drawer open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DrawerContent>
          <SppIndikatorForm closeModal={() => setIsEditOpen(false)} indikator={selectedIndikator} />
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete <strong>{selectedIndikator?.indikator}</strong>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div>
        <ScrollArea className="h-[70vh] rounded-md border shadow-md">
          {/* This div wraps the entire table to make the header sticky and body scrollable */}
            <Table className="relative w-full text-sm text-left text-gray-500">
              {/* Sticky Table Header */}
              <TableHeader className="bg-gray-100 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="px-6 py-3">#</TableHead>
                  <TableHead className="px-6 py-3 text-center">Indikator</TableHead>
                  <TableHead className="px-6 py-3 text-center">Kategori</TableHead>
                  <TableHead className="px-6 py-3 text-center">Sub Kategori</TableHead>
                  <TableHead className="px-6 py-3 text-center">Unit</TableHead>
                  <TableHead className="px-6 py-3 text-center">Ambang Batas</TableHead>
                  <TableHead className="px-6 py-3 text-center">Admin Level</TableHead>
                  <TableHead className="px-6 py-3 text-center">Parameter Penduduk Tertentu</TableHead>
                  <TableHead className="px-6 py-3 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              {/* Scrollable Table Body */}
              <TableBody className="relative">
                {isLoading && <LoadingComponent />}
                {indikators && indikators.length > 0 ? (
                  indikators.map((indikator, index) => (
                    <TableRow key={indikator.id} className="hover:bg-gray-50">
                      <TableCell className="px-6 py-3">{index + 1}</TableCell>
                      <TableCell className="px-6 py-3 font-medium">{indikator.indikator}</TableCell>
                      <TableCell className="px-6 py-3">{indikator.kategori}</TableCell>
                      <TableCell className="px-6 py-3">{indikator.sub_kategori}</TableCell>
                      <TableCell className="px-6 py-3">{indikator.unit}</TableCell>
                      <TableCell className="px-6 py-3">{indikator.ambang_batas}</TableCell>
                      <TableCell className="px-6 py-3">{indikator.admin_level}</TableCell>
                      <TableCell className="px-6 py-3">{indikator.attribute_penduduk}</TableCell>
                      <TableCell className="px-6 py-3 flex gap-2">
                        <Button
                          className="text-primary bg-secondary hover:bg-primary hover:text-white flex items-center gap-2 shadow-md"
                          onClick={() => {
                            setSelectedIndikator(indikator);
                            setIsEditOpen(true);
                          }}
                        >
                          <Pencil size={18} />
                        </Button>
                        <Button
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 shadow-md"
                          onClick={() => handleDelete(indikator)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                      No indicators found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </ScrollArea>
            <div className="w-full flex justify-end items-center py-2">
              <Card className="text-sm p-2  shadow-md">Count Row: <span className="font-bold">{indikators?.length ? indikators?.length : 0}</span></Card>
            </div>
        </div>
      </Card>
  );
};
