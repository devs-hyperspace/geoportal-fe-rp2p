import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {

  /**
 * @swagger
 * /settings/logs/calculation-status:
 *   get:
 *     summary: Check the status of SPP settings and calculation logs
 *     description: Retrieves the latest update timestamps for settings and calculations, determining if the data is up to date.
 *     tags: 
 *       - Settings - SPP Indikator
 *     responses:
 *       200:
 *         description: Returns the latest update timestamps and status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 settings_last_updated:
 *                   type: string
 *                   example: "2025-03-03T12:00:00Z"
 *                 calculation_last_updated:
 *                   type: string
 *                   example: "2025-03-02T10:30:00Z"
 *                 status:
 *                   type: string
 *                   example: "Outdated"
 *       500:
 *         description: Server error.
 */


  try {
    // Fetch the latest log from spp_settings_log
    const latestSettingsLog = await prisma.spp_settings_log.findFirst({
      where: { operation: "update" },
      orderBy: { created_at: "desc" },
    });

    // Fetch the latest log from spp_calculation_log
    const latestCalculationLog = await prisma.spp_settings_log.findFirst({
      where: { operation: "calculation" },
      orderBy: { created_at: "desc" },
    });

    // Extract dates
    const settingsDate = latestSettingsLog?.created_at || null;
    const calculationDate = latestCalculationLog?.created_at || null;

    // Determine status logic:
    let status = "Up to date";
    if (!calculationDate || (settingsDate && settingsDate > calculationDate)) {
      status = "Outdated";
    }

    return NextResponse.json({
      settings_last_updated: settingsDate || "No records",
      calculation_last_updated: calculationDate || "No records",
      status,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to check log status" }, { status: 500 });
  }
}



export async function POST(req: Request) {
  /**
 * @swagger
 * /settings/spp-indikator/logs/calculation-status:
 *   post:
 *     summary: Create a new SPP settings log entry
 *     description: Logs a new operation in the SPP settings log.
 *     tags: 
 *       - Settings - SPP Indikator
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               table_name:
 *                 type: string
 *                 example: "spp_indikator"
 *               operation:
 *                 type: string
 *                 example: "update"
 *     responses:
 *       200:
 *         description: Log entry created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 table_name:
 *                   type: string
 *                 operation:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Server error.
 */

  try {
    const { table_name, operation } = await req.json();

    if (!table_name || !operation) {
      return NextResponse.json({ message: "Missing required fields" });
    }

    const newLog = await prisma.spp_settings_log.create({
      data: { table_name, operation },
    });

    return NextResponse.json(newLog);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create classification" }, { status: 500 });
  }
}