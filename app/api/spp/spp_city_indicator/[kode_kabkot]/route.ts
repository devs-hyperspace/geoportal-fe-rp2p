import { z } from "zod";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from 'next';
import { type NextRequest } from 'next/server';
import { orderBy } from "lodash";

const getKabkotId = z.object({
    kabkot_id: z.string(),
});
export async function GET(request: Request, { params }: { params: { kabkot_id: string } }) {
    /**
 * @swagger
 * /spp/spp-city_indicator/{kabkot_id}:
 *   get:
 *     summary: Fetch SPP indicators by kabkot_id
 *     description: Retrieves SPP indicator data filtered by kabkot_id, ordered by capaian in ascending order.
 *     tags:
 *       - SPP Indikator
 *     parameters:
 *       - in: path
 *         name: kabkot_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the kabkot to fetch SPP indicator data for.
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
 *                       capaian:
 *                         type: number
 *                         description: The achievement score.
 *                       # Add other properties returned in spp_detail_result if necessary
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
 *                   example: "Failed to fetch data"
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

    const { kabkot_id: parsedKabkotId} = queryParams.data ?? {};
    
    const { data  } = await getSppIndicator(parsedKabkotId);

    const responseData = {
    data,
    };

    return new Response(JSON.stringify(responseData));
}


export type getKabkotId = Awaited<
  ReturnType<typeof getSppIndicator>
>;

async function getSppIndicator(kabkot_id?: string) {
    let query: any = {
        where: {
            kode_kabkot : kabkot_id,
        },
        orderBy: { capaian: 'asc' }
    };

    const data = await prisma.spp_detail_result.findMany(query);

    return {
        data
    };
}
