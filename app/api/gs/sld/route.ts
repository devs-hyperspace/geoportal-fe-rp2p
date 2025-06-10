import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {

        const classifications = await prisma.spp_klasifikasi.findMany({
            orderBy: { min: "desc" }
        });
        const sld = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
        xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml"
        xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
        <NamedLayer>
            <Name>geonode:spp_detail</Name>
                <UserStyle>
                    <Name>geonode:spp_detail</Name>
                    <Title>SPP</Title>
                    <FeatureTypeStyle>
                        ${classifications
                            .map((cls) => `
                            <Rule>
                            <Name>${cls.kelas} (${cls.min} - ${cls.max})</Name>
                            <Filter xmlns="http://www.opengis.net/ogc">
                                <And>
                                    <PropertyIsGreaterThanOrEqualTo>
                                        <PropertyName>capaian</PropertyName>
                                        <Literal>${cls.min}</Literal>
                                    </PropertyIsGreaterThanOrEqualTo>
                                    <PropertyIsLessThan>
                                        <PropertyName>capaian</PropertyName>
                                        <Literal>${cls.max}</Literal>
                                    </PropertyIsLessThan>
                                </And>
                            </Filter>
                            <PolygonSymbolizer>
                                <Fill>
                                <CssParameter name="fill">${cls.color}</CssParameter>
                                <CssParameter name="fill-opacity">0.6</CssParameter>
                                </Fill>
                                <Stroke>
                                <CssParameter name="stroke">#008000</CssParameter>
                                <CssParameter name="stroke-width">1</CssParameter>
                                </Stroke>
                            </PolygonSymbolizer>
                            </Rule>
                        `)
                        .join("\n")}
                    </FeatureTypeStyle>
                </UserStyle>
            </NamedLayer>
        </StyledLayerDescriptor>`;

        // const encodedSLD = encodeURIComponent(sld);

        return new NextResponse(sld, {
            status: 200,
            // headers: {
            //     "Content-Type": "text/plain"
            // }
        });

    } catch (error) {
        console.error("Error generating SLD:", error);
        return NextResponse.json({ error: "Failed to generate SLD" }, { status: 500 });
    }
}
