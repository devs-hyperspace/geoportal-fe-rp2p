import { z } from "zod";
import prisma from "@/lib/prisma";

const getPoiId = z.object({
    poi_id: z.number().int(),
});
export async function GET(request: Request, { params }: { params: { poi_id: string } }) {
    /**
 * @swagger
 * /spp/spp_detail_poi/{poi_id}:
 *   get:
 *     summary: Get POI details
 *     description: Retrieve details of a POI by its ID.
 *     tags:
 *       - SPP Indikator
 *     parameters:
 *       - in: path
 *         name: poi_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the POI
 *     responses:
 *       200:
 *         description: Successfully retrieved POI details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: POI not found
 *
 *   put:
 *     summary: Update POI details
 *     description: Update details of a POI by its ID.
 *     tags:
 *       - SPP Indikator
 *     parameters:
 *       - in: path
 *         name: poi_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the POI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               biaya_penanganan:
 *                 type: number
 *               kapasitas:
 *                 type: number
 *               kondisi:
 *                 type: string
 *               kualitas:
 *                 type: string
 *               emisi_karbon:
 *                 type: number
 *               lokasi:
 *                 type: string
 *               nama_pengelola:
 *                 type: string
 *               nilai_aset:
 *                 type: number
 *               okupansi:
 *                 type: number
 *               pemilik:
 *                 type: string
 *               poi_name:
 *                 type: string
 *               source:
 *                 type: string
 *               tanggal_pembaharuan_data:
 *                 type: string
 *                 format: date-time
 *               tipe_penanganan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated POI details
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: POI not found
 */

    const poi_id = parseInt(params.poi_id);
    
    const queryParams = getPoiId.safeParse({
        poi_id: poi_id || undefined,
    });

    if (!queryParams.success) {
        return new Response(JSON.stringify({ error: queryParams.error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { poi_id: parsedPoiId} = queryParams.data ?? {};
    
    const { data  } = await getSppDetailPOI(parsedPoiId);

    const responseData = { data };

    return new Response(JSON.stringify(responseData, (_, v) => typeof v === 'bigint' ? v.toString() : v));
}


export type sppDetailPOI = Awaited<
  ReturnType<typeof getSppDetailPOI>
>;

async function getSppDetailPOI(poi_id?: number) {
    const query: any = {
        where: {
            id : poi_id,
        }
    };

    const data = await prisma.poi.findFirst(query);

    return {
        data
    };
}

export type payloadSppDetailPOI = {
    id: string;
    biaya_penanganan?: number;
    kapasitas?: number;
    kondisi?: string;
    kualitas?: string;
    emisi_karbon?: number;
    lokasi?: string;
    nama_pengelola?: string;
    nilai_aset?: number;
    okupansi?: number;
    pemilik?: string;
    poi_name?: string;
    source?: string;
    tanggal_pembaharuan_data?: string | null;
    tipe_penanganan?: string;
};

type bodySppDetailPOI = Omit<payloadSppDetailPOI, 'id'> & { id?: string };

export async function PUT(req: Request) {
    const body: payloadSppDetailPOI = await req.json();
    const poi_id = parseInt(body.id);
    
    const queryParams = getPoiId.safeParse({
        poi_id: poi_id || undefined,
    });

    if (!queryParams.success) {
        return new Response(JSON.stringify({ error: queryParams.error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { poi_id: parsedPoiId} = queryParams.data ?? {};
    
    const payload: bodySppDetailPOI = { 
        ...body,
        tanggal_pembaharuan_data: body.tanggal_pembaharuan_data ? new Date(body.tanggal_pembaharuan_data as string).toISOString() : null
    };
    delete payload.id;
    const { data  } = await putSppDetailPOI(parsedPoiId, payload);

    const responseData = { data };

    return new Response(JSON.stringify(responseData, (_, v) => typeof v === 'bigint' ? v.toString() : v));
}

async function putSppDetailPOI(poi_id: number, body: Omit<payloadSppDetailPOI, 'id'>) {
    const data = await prisma.poi.update({
        where: { id : poi_id },
        data: body,
    });

    return {
        data
    };
}