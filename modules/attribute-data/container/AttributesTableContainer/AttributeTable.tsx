import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createColumnHelper } from "@tanstack/react-table";
import { useMapControl } from "@/modules/map/control/hooks/useMapControl";
import Spinner from "@/components/ui/spinner";
import { LayerListItem } from "@/types";
import { dataQueryProperty, dataQueryPropertyValue, useAttributeData } from "../../hooks/useAttributeData";

interface AttributesTableProps {
  layer: LayerListItem;
  sizeWidgetTools: number;
  extent: any;
  filterByExtent: boolean;
  cqlFilter: {[layerName: string]: string};
}

export const AttributeTable: React.FC<AttributesTableProps> = ({ layer, sizeWidgetTools, extent, filterByExtent, cqlFilter }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const dataQueryAttributeLayer = dataQueryProperty(layer.layerName, layer.viewparams);
  const dataQueryAttributeLayerData = dataQueryPropertyValue(layer.layerName, extent, filterByExtent, cqlFilter[layer.layerName] ?? '', layer?.viewparams);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnsDef, setColumnsDef] = React.useState<ColumnDef<any>[]>([]);
  const [attData, setAttData] = React.useState<any[]>([]);
  const mapControl = useMapControl();
  const attributeData = useAttributeData();

  React.useEffect(() => {
    setLoading(true);
    setError(null);

    const timeout = setTimeout(() => {
      setError("Data loading timed out. Please try again.");
      setLoading(false);
    }, 60000);

    if (dataQueryAttributeLayer.error || dataQueryAttributeLayerData.error) {
      setError("Failed to load data. Please try again.");
      setLoading(false);
      clearTimeout(timeout);
    } else if (dataQueryAttributeLayer.data && dataQueryAttributeLayerData.data) {
      const columnHelper = createColumnHelper();

      const columns: ColumnDef<any>[] = dataQueryAttributeLayer.data.featureTypes.map((field: any) => {
        const accessorFn = (row: any) => {
          const value = row[field.name];
          return field.localType === "int" || field.localType === "number"
            ? value !== undefined ? Number(value) : null
            : value !== undefined ? String(value) : null;
        };

        return columnHelper.accessor(field.name, {
          header: field.name.replace(/_/g, " ").toUpperCase(),
          cell: (info) => (info.getValue() != null ? info.getValue() : "-"),
          meta: { type: field.localType, nillable: field.nillable },
        });
      }) || [];

      // Add a column for row selection
      columns.unshift(columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <div>
            <input
              type="checkbox"
              checked={table.getIsAllRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
      }));

      setColumnsDef(columns);
      setAttData(dataQueryAttributeLayerData.data);
      setLoading(false);
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout); // Clean up timeout on component unmount
  }, [dataQueryAttributeLayer.data, dataQueryAttributeLayerData.data, dataQueryAttributeLayer.error, dataQueryAttributeLayerData.error, layer]);

  const table = useReactTable({
    data: attData || [],
    columns: columnsDef,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const startRow = table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1;
  const endRow = startRow + table.getRowModel().rows.length - 1;

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex w-full justify-center flex-col items-center">
          <p className="text-[#303030] text-sm">Loading Attribute Table ...</p>
          <div className="flex justify-center items-center p-4">
            <Spinner height={10} width={10} />
          </div>
        </div>
      ) : error ? (
        <div className="">
          <div className="text-center text-red-500">
            {error}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center py-4">
            <div className="flex flex-row gap-2 justify-between items-center w-full">

              <div className="flex flex-row gap-2 justify-start items-center">
              <Button
                variant="outline"
                onClick={() => attributeData.setFilterByExtent(!filterByExtent)}
                className={filterByExtent ? 'hover:bg-secondary hover:text-white bg-primary text-white' : ''}
              >
                <h3>Filter By Extent</h3>
              </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    attributeData.setIsOpenAttrFilter(true);
                    attributeData.setSelectedLayer(layer);
                  }}
                >
                  <h3>Filter By Attribute</h3>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2">
                  <span>Rows per page:</span>
                  <select
                    className="border border-gray-300 rounded px-2 py-1"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                  >
                    {[5, 10, 20, 50, 100].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-muted-foreground">
                  Showing rows {startRow} to {endRow} of {table.getFilteredRowModel().rows.length}
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                    {"<<"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    {"<"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    {">"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                    {">>"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div
            className='flex rounded-md border max-h-[50vh] overflow-auto custom-scrollbar'
            style={{
              width: mapControl.tools.layerControl.active ? `calc(100vw - ${420 + sizeWidgetTools}px)` : `calc(100vw - ${120 + sizeWidgetTools}px)`
            }}
          >
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columnsDef.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};
