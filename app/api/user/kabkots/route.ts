import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
  /**
 * @swagger
 * /user/kabkots:
 *   get:
 *     summary: Retrieve a list of kabupaten/kota (kabkots)
 *     description: Fetches all kabupaten/kota (districts/cities) with their `id` and `name`.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of kabkots.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Jakarta"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

    try {
      const kabkots = await prisma.kabkot.findMany({
        select: { id: true, name: true },
      });
  
      return NextResponse.json(kabkots, { status: 200 });
    } catch (error) {
      console.error("Error fetching kabkots:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  