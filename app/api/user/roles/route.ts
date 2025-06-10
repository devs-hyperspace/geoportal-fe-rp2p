import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  /**
 * @swagger
 * /user/roles:
 *   get:
 *     summary: Retrieve a list of roles
 *     description: Fetches all roles with their `id` and `name`.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of roles.
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
 *                     example: "Administrator"
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
    const roles = await prisma.role.findMany({
      select: { id: true, name: true },
    });

    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
