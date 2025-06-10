import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from 'next/server';
import { AuthOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {

/**
 * @swagger
 * /py/spp:
 *   post:
 *     summary: Trigger SPP index calculation
 *     description: Sends a request to trigger the SPP index calculation process.
 *     tags:
 *       - SPP Indikator Calcualtion
 *     security:
 *       - APIKeyHeader: []  # API Key authentication
 *     responses:
 *       200:
 *         description: Successfully triggered SPP index calculation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized access - Invalid or missing API key or token.
 *       500:
 *         description: Internal server error when triggering the calculation.
 */


    try {
        const session = await getServerSession(AuthOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/api/v1/spp_index/calculate_spp_index`, {
            method: 'POST',
            headers: {
                'x-api-key': `${process.env.NEXT_PUBLIC_BE_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to trigger SPP index calculation');
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}