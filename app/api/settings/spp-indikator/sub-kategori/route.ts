import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function GET() {
    /**
 * @swagger
 * /settings/spp-indikator/sub-kategori:
 *   get:
 *     summary: Get distinct sub_kategori from kategori_poi
 *     description: Fetches distinct sub_kategori and id_sub_kategori from the kategori_poi table, ordered by sub_kategori.
 *     tags:
 *       - Settings - SPP Indikator
 *     responses:
 *       200:
 *         description: A list of distinct sub_kategori.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sub_kategori:
 *                     type: string
 *                     description: The name of the sub_kategori.
 *                   id_sub_kategori:
 *                     type: integer
 *                     description: The ID of the sub_kategori.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch sub_kategori
 */

    
    try {
        const data = await prisma.kategori_poi.findMany({
            select: { sub_kategori: true, id_sub_kategori: true },
            distinct: ["sub_kategori", "id_sub_kategori"],
            orderBy: { sub_kategori: "asc" },
        });

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching sub_kategori:", error);
        return NextResponse.json({ error: "Failed to fetch sub_kategori" }, { status: 500 });
    }
}
