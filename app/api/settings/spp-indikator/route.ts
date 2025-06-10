import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Schema validation for input data
const sppIndikatorSchema = z.object({
    indikator: z.string().min(1),
    kategori: z.string().min(1),
    id_kategori: z.string().min(1),
    sub_kategori: z.string().min(1),
    id_sub_kategori: z.string().min(1),
    unit: z.string().min(1),
    ambang_batas: z.number(),
    admin_level_id: z.string().min(1),
    admin_level: z.string().min(1),
    attribute_penduduk: z.string().min(1),
});

// **GET: Fetch all spp_indikator**
export async function GET(req: NextRequest) {
    /**
 * @swagger
 * /settings/spp-indikator:
 *   get:
 *     summary: Fetch all spp_indikator
 *     description: Retrieves a list of all SPP indikator entries.
 *     tags: 
 *       - Settings - SPP Indikator
 *     responses:
 *       200:
 *         description: A list of SPP indikator entries.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Server error.
 */
    try {
        const session = await getServerSession(AuthOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await prisma.spp_indikator.findMany({
            orderBy:{id:'asc'}
        });
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// **POST: Create a new spp_indikator**
export async function POST(req: NextRequest) {
    /**
 * @swagger
 * /settings/spp-indikator:
 *   post:
 *     summary: Create a new spp_indikator
 *     description: Adds a new SPP indikator entry to the database.
 *     tags: 
 *       - Settings - SPP Indikator
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               indikator:
 *                 type: string
 *               kategori:
 *                 type: string
 *               id_kategori:
 *                 type: string
 *               sub_kategori:
 *                 type: string
 *               id_sub_kategori:
 *                 type: string
 *               unit:
 *                 type: string
 *               ambang_batas:
 *                 type: number
 *               admin_level_id:
 *                 type: string
 *               admin_level:
 *                 type: string
 *               attribute_penduduk:
 *                 type: string
 *     responses:
 *       201:
 *         description: SPP indikator created successfully.
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Server error.
 */
    try {
        const session = await getServerSession(AuthOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validation = sppIndikatorSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const newIndikator = await prisma.spp_indikator.create({
            data: body,
        });

        return NextResponse.json(newIndikator, { status: 201 });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// **PUT: Update an existing spp_indikator**
export async function PUT(req: NextRequest) {
    /**
 * @swagger
 * /settings/spp-indikator:
 *   put:
 *     summary: Update an existing spp_indikator
 *     description: Modifies an existing SPP indikator entry in the database.
 *     tags: 
 *       - Settings - SPP Indikator
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               indikator:
 *                 type: string
 *               kategori:
 *                 type: string
 *               id_kategori:
 *                 type: string
 *               sub_kategori:
 *                 type: string
 *               id_sub_kategori:
 *                 type: string
 *               unit:
 *                 type: string
 *               ambang_batas:
 *                 type: number
 *               admin_level_id:
 *                 type: string
 *               admin_level:
 *                 type: string
 *               attribute_penduduk:
 *                 type: string
 *     responses:
 *       200:
 *         description: SPP indikator updated successfully.
 *       400:
 *         description: Invalid input or missing ID.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Server error.
 */
    try {
        const session = await getServerSession(AuthOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const validation = sppIndikatorSchema.safeParse(updateData);
        if (!validation.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const updatedIndikator = await prisma.spp_indikator.update({
            where: { id: Number(id) },
            data: updateData,
        });

        return NextResponse.json(updatedIndikator, { status: 200 });
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// **DELETE: Remove an spp_indikator**
export async function DELETE(req: NextRequest) {

/**
 * @swagger
 * /settings/spp-indikator:
 *   delete:
 *     summary: Remove an spp_indikator
 *     description: Deletes an SPP indikator entry from the database.
 *     tags: 
 *       - Settings - SPP Indikator
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
 *         description: Indikator deleted successfully.
 *       400:
 *         description: Invalid request or missing ID.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Server error.
 */
    try {
        const session = await getServerSession(AuthOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await prisma.spp_indikator.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: "Indikator deleted successfully" }, { status: 204 });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
