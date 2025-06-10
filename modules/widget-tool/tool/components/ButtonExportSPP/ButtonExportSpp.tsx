import React from 'react';
import { useExportSPP } from '@/modules/widget-tool/tool/hooks/useSppData/useSppData';
import { Button } from '@/components/ui/button';
import { FileDownIcon, Loader2 } from 'lucide-react';

export const ButtonExportSpp: React.FC<{ kode_kabkot: string }> = ({ kode_kabkot }) => {
    const { data, refetch, isFetching } = useExportSPP(kode_kabkot);


    const handleDownload = () => {
        refetch().then((result) => {
            const url = window.URL.createObjectURL(new Blob([result.data.blob]));
            const link = document.createElement('a');
            link.href = url;

            // Extract filename from Content-Disposition header
            const contentDisposition = result.data.contentDisposition;
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '')
                : `SPP_${kode_kabkot}.xlsx`;

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    };

    return (
        <Button variant="secondary" className={"font-bold hover:bg-primary hover:text-white w-full p-2"} onClick={handleDownload} disabled={isFetching}>
            {isFetching ? <Loader2 className='animate-spin' /> : <div className='flex flex-row gap-2 items-center'>
                <FileDownIcon /> <p>
                    Export
                </p>
            </div>
            }
        </Button>
    );
};