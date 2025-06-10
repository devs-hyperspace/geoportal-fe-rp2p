import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";

const prisma = new PrismaClient();

const getGeonodeUid = z.object({
    guid: z.string(),
});

/**
 * @swagger
 * /user/{guid}:
 *   get:
 *     summary: Get user(s) by GeoNode UID
 *     description: Fetches user data based on the provided GeoNode UID. Requires authentication.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: guid
 *         required: true
 *         schema:
 *           type: string
 *         description: GeoNode UID of the user
 *     responses:
 *       200:
 *         description: List of users
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 * 
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user if the GUID is 1000 or 1007. Requires authentication.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: guid
 *         required: true
 *         schema:
 *           type: string
 *         description: GeoNode UID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               roleId:
 *                 type: integer
 *               groupId:
 *                 type: integer
 *               kabkotId:
 *                 type: integer
 *               geonodeUid:
 *                 type: string
 *               geonodeAccessToken:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 * 
 *   put:
 *     summary: Update an existing user
 *     description: Updates user details if the GUID is 1000 or 1007. Requires authentication.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: guid
 *         required: true
 *         schema:
 *           type: string
 *         description: GeoNode UID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               roleId:
 *                 type: integer
 *               groupId:
 *                 type: integer
 *               kabkotId:
 *                 type: integer
 *               geonodeUid:
 *                 type: string
 *               geonodeAccessToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 * 
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user if the GUID is 1000 or 1007. Requires authentication.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: guid
 *         required: true
 *         schema:
 *           type: string
 *         description: GeoNode UID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */


// Handle GET request
export async function GET(req: NextRequest, { params }: { params: { guid: string } }) {

    try {
        const guid = params.guid;
        // // Get the session
        const session = await getServerSession(AuthOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const queryParams = getGeonodeUid.safeParse({
            guid: guid || undefined,
        });

        if (!queryParams.success) {
            return new Response(JSON.stringify({ error: queryParams.error.message }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { guid: parsedGuid } = queryParams.data ?? {};

        let query: any = {
            include: {
                role: true,
                group: true,
                kabkot: true,
            },
            where: {
                geonodeUid: parseInt(parsedGuid),
            }
        }

        let users = {}

        if (parsedGuid !== '1007' && parsedGuid !== '1000') {
            users = await prisma.user.findMany(query);
        } else {
            users = await prisma.user.findMany({
                include: {
                    role: true,
                    group: true,
                    kabkot: true,
                }
            });
        }


        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// Handle POST request
export async function POST(req: NextRequest, { params }: { params: { guid: string } }) {
    try {
        const guid = params.guid;
        // Get the session
        const session = await getServerSession(AuthOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const queryParams = getGeonodeUid.safeParse({
            guid: guid || undefined,
        });

        if (!queryParams.success) {
            return new Response(JSON.stringify({ error: queryParams.error.message }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { guid: parsedGuid } = queryParams.data ?? {};

        if (parsedGuid === '1000' || parsedGuid === "1007") {
            const body = await req.json();
            const { username, password, name, roleId, groupId, kabkotId, geonodeUid, geonodeAccessToken } = body;

            const user = await prisma.user.create({
                data: { username, password, name, roleId, groupId, kabkotId, geonodeUid, geonodeAccessToken },
            });

            return NextResponse.json(user, { status: 201 });
        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 500 });
        }

    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// Handle PUT request
export async function PUT(req: NextRequest, { params }: { params: { guid: string } }) {
    try {
        const guid = params.guid;
        // Get the session
        const session = await getServerSession(AuthOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const queryParams = getGeonodeUid.safeParse({
            guid: guid || undefined,
        });

        if (!queryParams.success) {
            return new Response(JSON.stringify({ error: queryParams.error.message }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { guid: parsedGuid } = queryParams.data ?? {};

        if (parsedGuid === '1000' || parsedGuid === "1007") {
            const body = await req.json();
            const { id, username, name, password, roleId, groupId, kabkotId, geonodeUid, geonodeAccessToken } = body;

            const user = await prisma.user.update({
                where: { id },
                data: { username, name, password, roleId, groupId, kabkotId, geonodeUid, geonodeAccessToken },
            });

            return NextResponse.json(user, { status: 200 });
        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 500 });
        }
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// Handle DELETE request
export async function DELETE(req: NextRequest, { params }: { params: { guid: string } }) {
    try {
        const guid = params.guid;
        // Get the session
        const session = await getServerSession(AuthOptions);
        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        const queryParams = getGeonodeUid.safeParse({
            guid: guid || undefined,
        });

        if (!queryParams.success) {
            return new Response(JSON.stringify({ error: queryParams.error.message }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { guid: parsedGuid } = queryParams.data ?? {};

        if (parsedGuid === '1000' || parsedGuid === "1007") {
            const body = await req.json();
            const { id } = body;

            await prisma.user.delete({ where: { id } });

            return NextResponse.json({ message: "User deleted successfully" }, { status: 204 });
        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 500 });
        }
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
