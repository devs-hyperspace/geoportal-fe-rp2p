import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {

    /**
 * @swagger
 * /update-session:
 *   post:
 *     summary: Update session with GeoNode access token
 *     description: Updates the session with a provided GeoNode access token. Requires authentication.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               geonodeAccessToken:
 *                 type: string
 *                 description: The access token from GeoNode
 *     responses:
 *       200:
 *         description: Session will be updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 geonodeAccessToken:
 *                   type: string
 *       400:
 *         description: Missing geonodeAccessToken
 *       401:
 *         description: Unauthorized - session required
 */

    // Validate session
    const session = await getServerSession(AuthOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const { geonodeAccessToken } = body;

    if (!geonodeAccessToken) {
        return NextResponse.json({ error: "Missing geonodeAccessToken" }, { status: 400 });
    }

    return NextResponse.json({
        message: "Session will be updated",
        geonodeAccessToken,
    });
}
