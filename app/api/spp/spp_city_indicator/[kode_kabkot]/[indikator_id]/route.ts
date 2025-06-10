import { z } from "zod";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from 'next';
import { type NextRequest } from 'next/server';
import { orderBy } from "lodash";

const getKabkotId = z.object({
    kode_kabkot: z.string(),
    indikator_id: z.number().int(),
});
export async function GET(request: Request, { params }: { params: { kode_kabkot: string, indikator_id: string} }) {

    /**
 * @swagger
 * /spp/spp_city_indikator/{kode_kabkot}/{indikator_id}:
 *   get:
 *     summary: Fetch SPP indicators by kabkot_id and indikator_id
 *     description: Retrieves SPP indicator data filtered by kode_kabkot and indikator_id, ordered by capaian in ascending order.
 *     tags:
 *       - SPP Indikator
 *     parameters:
 *       - in: path
 *         name: kode_kabkot
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the kabupaten/kota (kabkot) to fetch SPP indicator data for.
 *       - in: path
 *         name: indikator_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the indicator to fetch data for.
 *     responses:
 *       200:
 *         description: Successfully retrieved SPP indicator results.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       kode_kabkot:
 *                         type: string
 *                         description: The kabkot ID.
 *                       indikator_id:
 *                         type: integer
 *                         description: The indicator ID.
 *                       capaian:
 *                         type: number
 *                         description: The achievement score.
 *                       # Add other properties returned in spp_detail_result if necessary
 *       400:
 *         description: Bad request, invalid kode_kabkot or indikator_id parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid kode_kabkot or indikator_id parameter"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch data"
 */

    const kode_kabkot = params.kode_kabkot;
    const indikator_id = parseInt(params.indikator_id);

    const queryParams = getKabkotId.safeParse({
        kode_kabkot: kode_kabkot || undefined,
        indikator_id: indikator_id !== null ? indikator_id : undefined,
    });

    if (!queryParams.success) {
        return new Response(JSON.stringify({ error: queryParams.error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
        });
    }

    const { kode_kabkot: parsedKabkotId} = queryParams.data ?? {};
    const { indikator_id: parsedIndikatorId} = queryParams.data ?? {};
    
    const { data  } = await getSppIndicator(parsedKabkotId, parsedIndikatorId);

    const responseData = {
    data,
    };

    return new Response(JSON.stringify(responseData));
}


export type getKabkotId = Awaited<
  ReturnType<typeof getSppIndicator>
>;

async function getSppIndicator(kode_kabkot?: string, indikator_id?:number) {
    let query: any = {
        where: {
            kode_kabkot : kode_kabkot,
            indikator_id : indikator_id
        },
        orderBy: { capaian: 'asc' }
    };

    const data = await prisma.spp_detail_result.findMany(query);

    return {
        data
    };
}
