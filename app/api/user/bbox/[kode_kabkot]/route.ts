import { AuthOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { kode_kabkot: string } }) {
    /**
 * @swagger
 * /user/bbox/{kode_kabkot}:
 *   get:
 *     summary: Get bounding box (bbox) for a given `kode_kabkot`
 *     description: Returns the bounding box of an administrative region as a GeoJSON object.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: kode_kabkot
 *         required: true
 *         description: The unique code of the kabupaten/kota (district/city).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved bbox data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [[105.123, -6.234], [106.456, -5.678]]
 *       400:
 *         description: Missing kode_kabkot parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing kode_kabkot"
 *       401:
 *         description: Unauthorized request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Bounding box not found for the given kode_kabkot.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not found"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

    const kode_kabkot = params.kode_kabkot;

    if (!kode_kabkot) {
        return NextResponse.json({ error: "Missing kode_kabkot" }, { status: 400 });
    }
    const session = await getServerSession(AuthOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    try {
        const result: any[] = await prisma.$queryRaw`
      SELECT ST_AsGeoJSON(ST_Envelope(geometry)) as bbox
      FROM admin_kabkot
      WHERE kode_kabkot = ${kode_kabkot}
    `;

        if (!result.length || !result[0].bbox) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        // Parse the GeoJSON string to a JSON object
        const geoJSON = JSON.parse(result[0].bbox);
        const coordinates = geoJSON.coordinates[0];
        // Get the min/max coordinates
        const lngs = coordinates.map((coord: number[]) => coord[0]);
        const lats = coordinates.map((coord: number[]) => coord[1]);

        const minLng = Math.min(...lngs);
        const minLat = Math.min(...lats);
        const maxLng = Math.max(...lngs);
        const maxLat = Math.max(...lats);

        // Convert to Mapbox LngLatBoundsLike format
        const bbox: [number, number][] = [
            [minLng, minLat], // Southwest corner
            [maxLng, maxLat], // Northeast corner
        ];

        return NextResponse.json(bbox);

        // Return only the "coordinates" property
        return NextResponse.json(geoJSON);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
