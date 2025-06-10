import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
  /**
 * @swagger
 * /user/groups:
 *   get:
 *     summary: Retrieve a list of groups
 *     description: Fetches all groups with their `id` and `name`.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of groups.
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
 *                     example: "Admin Group"
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
    const groups = await prisma.group.findMany({
      select: { id: true, name: true },
    });

    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
