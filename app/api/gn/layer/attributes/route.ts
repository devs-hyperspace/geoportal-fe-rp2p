import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/lib/auth';


export async function GET(req: NextRequest) {

    /**
     * @swagger
     * /gn/layer/attributes:
     *   get:
     *     summary: Fetch feature type description from GeoNode
     *     description: Retrieve the schema (attribute structure) of a specific layer from GeoNode's GeoServer.
     *     tags:
     *       - GeoNode - Layer
     *     parameters:
     *       - in: query
     *         name: layer
     *         required: true
     *         description: The GeoNode layer name whose schema is to be retrieved.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Successfully retrieved the feature type description.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 featureTypes:
     *                   type: array
     *                   description: The list of feature types with their attributes.
     *                   items:
     *                     type: object
     *                     properties:
     *                       typeName:
     *                         type: string
     *                         description: The name of the feature type.
     *                       properties:
     *                         type: array
     *                         description: List of attributes in the feature type.
     *                         items:
     *                           type: object
     *                           properties:
     *                             name:
     *                               type: string
     *                               description: The attribute name.
     *                             type:
     *                               type: string
     *                               description: The data type of the attribute.
     *       400:
     *         description: Bad request due to missing or invalid parameters.
     *       500:
     *         description: Internal server error when fetching GeoNode data.
     */

    const { searchParams } = new URL(req.url);

    const session = await getServerSession(AuthOptions);
    const accessToken = session?.user.geonodeAccessToken;

    const layer = searchParams.get('layer');

    let url = `${process.env.NEXT_PUBLIC_GEONODE}/geoserver/ows?service=wfs&version=2.0.0&typeNames=${layer}&request=DescribeFeatureType&outputFormat=application/json`

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
            },
        });

        return NextResponse.json(response.data);

    } catch (error) {
        console.error('Error fetching GeoNode resources:', error);
        return NextResponse.json({ error: 'Failed to fetch GeoNode resources' }, { status: 500 });
    }
}
