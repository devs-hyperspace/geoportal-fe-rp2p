import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// API to get the last user ID
export async function GET() {
    try {
        const lastUser = await prisma.user.findFirst({
            orderBy: { id: "desc" }, // Get the latest user by ID
            select: { id: true },
        });

        return NextResponse.json(lastUser || { id: 0 }, { status: 200 }); // Return last user ID or 0
    } catch (error) {
        console.error("GET Last ID Error:", error);
        return NextResponse.json({ error: "Failed to fetch last user ID" }, { status: 500 });
    }
}
