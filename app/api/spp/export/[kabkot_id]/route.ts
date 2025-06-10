import { z } from "zod";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';


const getKabkotId = z.object({
    kabkot_id: z.string(),
});

export async function GET(request: NextRequest, { params }: { params: { kabkot_id: string } }) {
    /**
 * @swagger
 * /spp/export/{kabkot_id}:
 *   get:
 *     summary: Generate and download an Excel report for a specific kabkot_id
 *     description: Fetches SPP city and indicator details for the given kabkot_id and generates an Excel report with multiple sheets.
 *     tags:
 *       - SPP Indikator
 *     parameters:
 *       - in: path
 *         name: kabkot_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the kabkot to fetch data for.
 *     responses:
 *       200:
 *         description: Successfully generated and returned the Excel file.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Bad request, invalid kabkot_id parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid kabkot_id parameter"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to generate report"
 */

    const kabkot_id = params.kabkot_id;

    const queryParams = getKabkotId.safeParse({
        kabkot_id: kabkot_id || undefined,
    });

    if (!queryParams.success) {
        return new Response(JSON.stringify({ error: queryParams.error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { kabkot_id: parsedKabkotId } = queryParams.data ?? {};

    const { data } = await getSppCity(parsedKabkotId);
    const { data: detailData } = await getSppDetailResult(parsedKabkotId);

    const indikatorResult: any = [];
    const detailIndikatorResult: any = [];

    data[0]['grafik_source'].map((item: any, index:number) => {
        const detailResult = JSON.parse(item['grafik_source']);
        detailResult.map((itm: any, index: number) => {
            const itmData = itm;
            itmData['no'] = index + 1;
            const columnOrder = ['no', 'indikator', 'admin_level', 'nama_admin', 'jumlah_penduduk', 'jumlah_penduduk_tertentu', 'jumlah_fasilitas', 'jumlah_defisit_fasilitas', 'capaian', 'kelas_capaian'];
            const reorderedData = reorderProperties(itmData, columnOrder);
            detailIndikatorResult.push(reorderedData);
        });

        const filterItemData = excludeProperty(item, 'grafik_source');
        filterItemData['no'] =index + 1;

        const columnOrder = ['no','indikator', 'admin_level', 'ambang_batas', 'wight', 'capaian', 'kelas_capaian', 'jumlah_penduduk', 'jumlah_penduduk_tertentu', 'jumlah_fasilitas', 'jumlah_defisit_fasilitas'];
        const reorderedData = reorderProperties(filterItemData, columnOrder);
        indikatorResult.push(reorderedData);
    });

    const filterData = excludeProperty(data[0], 'grafik_source');
    filterData['no'] = 1; // Add nomor column
    const columnOrder = ['no', 'admin_kabkot', 'jumlah_penduduk', 'capaian', 'kelas_capaian'];
    const reorderedData = reorderProperties(filterData, columnOrder);

    const workbook = new ExcelJS.Workbook();

    const addSheet = (name: string, data: any[]) => {
        const sheet = workbook.addWorksheet(name);
        if (data.length > 0) {
            sheet.columns = Object.keys(data[0]).map(key => ({ header: key, key }));
            sheet.addRows(data);
            sheet.getRow(1).eachCell(cell => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        }
    };


    const featuresArr: any = [];
    detailData.map((dd: any) => {
        const features = dd['poi_detail'].features;
        features.map((feature: any, index: number) => {
            const featureResult = feature.properties;
            featureResult['longitude'] = feature.geometry.coordinates[0];
            featureResult['latitude'] = feature.geometry.coordinates[1];
            featureResult['indikator'] = dd['indikator'];
            featureResult['admin_level'] = dd['admin_level'];
            featureResult['nama_admin'] = dd['nama_admin'];
            featureResult['no'] = index + 1;
            const columnOrder = ['no', 'indikator', 'poi_name', 'longitude', 'latitude', 'admin_level', 'nama_admin', 'lokasi', 'source', 'kondisi', 'pemilik', 'kualitas', 'okupansi', 'kapasitas', 'nilai_aset', 'nama_pengelola', 'tipe_penanganan', 'biaya_penanganan', 'tanggal_pembaharuan_data'];
            const reorderedData = reorderProperties(featureResult, columnOrder);
            featuresArr.push(reorderedData);
        });
    });

    addSheet('SPP UMUM', [reorderedData]);
    addSheet('SPP Indikator', indikatorResult);
    addSheet('SPP Indikator Admin Level', detailIndikatorResult);
    addSheet('SPP Indikator POI Fasilitas', featuresArr);

    
    const buffer = await workbook.xlsx.writeBuffer();
    const adminName = data[0].admin_kabkot;


    return new Response(buffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="SPP ${adminName} ${Date.now()}.xlsx"`,
        },
    });
}

export type getKabkotId = Awaited<ReturnType<typeof getSppCity>>;
export type getSppDetailResult = Awaited<ReturnType<typeof getSppDetailResult>>;

async function getSppCity(kabkot_id?: string) {
    const data = await prisma.spp_city_result.findMany({
        where: {
            kode_kabkot: kabkot_id,
        },
        orderBy: { capaian: 'asc' },
        include: {
            admin_kabkot: {
                select: {
                    nama_kabkot: true,
                },
            },
        },
    });

    return {
        data: data.map((item: any) => ({
            ...item,
            admin_kabkot: item?.admin_kabkot?.nama_kabkot,
        })),
    };
}

async function getSppDetailResult(kabkot_id?: string) {
    const data = await prisma.spp_detail_result.findMany({
        where: {
            kode_kabkot: kabkot_id,
        },
    });

    return { data } as any;
}

function excludeProperty(obj: any, prop: any) {
    const { [prop]: _, ...rest } = obj;
    return rest;
}

function reorderProperties(obj: any, order: string[]) {
    const reorderedObj: any = {};
    order.forEach(key => {
        if (obj.hasOwnProperty(key)) {
            reorderedObj[key] = obj[key];
        }
    });
    return reorderedObj;
}