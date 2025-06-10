import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   - name: Klasifikasi SPP Indikator
 *     description: API for managing classifications in SPP Indikator
 */

/**
 * @swagger
 * /settings/spp-indikator/spp-klasifikasi:
 *   get:
 *     summary: Fetch all classifications
 *     description: Retrieves all classifications from the spp_klasifikasi table, ordered by min value.
 *     tags: [Klasifikasi SPP Indikator]
 *     responses:
 *       200:
 *         description: A list of classifications.
 *       500:
 *         description: Failed to fetch classifications.
 */

export async function GET() {

/**
 * @swagger
 * /settings/spp-indikator/spp-klasifikasi:
 *   post:
 *     summary: Create a new classification
 *     description: Adds a new classification to the spp_klasifikasi table.
 *     tags: [Klasifikasi SPP Indikator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kelas:
 *                 type: string
 *               min:
 *                 type: number
 *               max:
 *                 type: number
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Classification created successfully.
 *       500:
 *         description: Failed to create classification.
 */

    try {
        const classifications = await prisma.spp_klasifikasi.findMany({
            orderBy: { min: "asc" }
        });
        return NextResponse.json(classifications);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch classifications" }, { status: 500 });
    }
}

export async function POST(req: Request) {

/**
 * @swagger
 * /settings/spp-indikator/spp-klasifikasi:
 *   put:
 *     summary: Update an existing classification
 *     description: Updates a classification in the spp_klasifikasi table.
 *     tags: [Klasifikasi SPP Indikator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               kelas:
 *                 type: string
 *               min:
 *                 type: number
 *               max:
 *                 type: number
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Classification updated successfully.
 *       500:
 *         description: Failed to update classification.
 */
    try {
        const { kelas, min, max, color } = await req.json();
        const newClass = await prisma.spp_klasifikasi.create({
            data: { kelas, min, max, color}
        });
        return NextResponse.json(newClass);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create classification" }, { status: 500 });
    }
}

export async function PUT(req: Request) {

/**
 * @swagger
 * /settings/spp-indikator/spp-klasifikasi:
 *   delete:
 *     summary: Delete a classification
 *     description: Deletes a classification from the spp_klasifikasi table based on the provided ID.
 *     tags: [Klasifikasi SPP Indikator]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the classification to delete.
 *     responses:
 *       200:
 *         description: Classification deleted successfully.
 *       400:
 *         description: Invalid or missing ID.
 *       500:
 *         description: Failed to delete classification.
 */
    try {
        const { id, kelas, min, max, color} = await req.json();
        const updatedClass = await prisma.spp_klasifikasi.update({
            where: { id },
            data: { kelas, min, max, color}
        });
        return NextResponse.json(updatedClass);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update classification" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    /**
 * @swagger
 * /settings/spp-indikator/spp-klasifikasi:
 *   delete:
 *     summary: Delete a classification
 *     description: Deletes a classification from the spp_klasifikasi table based on the provided ID.
 *     tags: [Klasifikasi SPP Indikator]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the classification to delete.
 *     responses:
 *       200:
 *         description: Classification deleted successfully.
 *       400:
 *         description: Invalid or missing ID.
 *       500:
 *         description: Failed to delete classification.
 */

    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');
    
    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    const numericId = parseInt(id, 10); // Convert to number
    
    if (isNaN(numericId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    try {
        const res = await prisma.spp_klasifikasi.delete({
            where: { id: numericId }
        });
        return NextResponse.json({ message: "Classification deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete classification" }, { status: 500 });
    }
}
