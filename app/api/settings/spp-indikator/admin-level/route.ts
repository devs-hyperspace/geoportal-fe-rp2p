import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();


export async function GET() {
    /**
 * @swagger
 * /settings/spp-indikator/admin-level:
 *   get:
 *     summary: Fetch distinct admin levels
 *     description: Retrieves a list of distinct admin levels and their corresponding IDs.
 *     tags: 
 *       - Settings - SPP Indikator
 *     responses:
 *       200:
 *         description: A list of distinct admin levels.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   admin_level:
 *                     type: string
 *                   admin_level_id:
 *                     type: string
 *       500:
 *         description: Server error.
 */

    try {
        const data = await prisma.spp_indikator.findMany({
            select: { admin_level: true, admin_level_id: true },
            distinct: ["admin_level", "admin_level_id"],
            orderBy: { admin_level: "asc" },
        });

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching admin_level:", error);
        return NextResponse.json({ error: "Failed to fetch admin_level" }, { status: 500 });
    }
}
