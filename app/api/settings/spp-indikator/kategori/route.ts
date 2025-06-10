import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();

export async function GET() {
    /**
 * @swagger
 * /settings/spp-indikator/kategori:
 *   get:
 *     summary: Fetch distinct kategori POI
 *     description: Retrieves a list of distinct kategori POI and their corresponding IDs.
 *     tags: 
 *       - Settings - SPP Indikator
 *     responses:
 *       200:
 *         description: A list of distinct kategori POI.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   kategori:
 *                     type: string
 *                   id_kategori:
 *                     type: string
 *       500:
 *         description: Server error.
 */

    try {
        const data = await prisma.kategori_poi.findMany({
            select: { kategori: true, id_kategori: true },
            distinct: ["kategori", "id_kategori"],
            orderBy: { kategori: "asc" },
        });

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching kategori:", error);
        return NextResponse.json({ error: "Failed to fetch kategori" }, { status: 500 });
    }
}
