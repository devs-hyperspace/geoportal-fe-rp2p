import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {

    /**
 * @swagger
 * /gn/layer/featureInfo:
 *   get:
 *     summary: Fetch feature information from GeoNode
 *     description: Retrieve feature information from a specified GeoNode layer using WMS GetFeatureInfo.
 *     tags:
 *       - GeoNode - Layer
 *     parameters:
 *       - in: query
 *         name: layer
 *         required: true
 *         description: The GeoNode layer name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: x
 *         required: true
 *         description: X coordinate of the query point.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: y
 *         required: true
 *         description: Y coordinate of the query point.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: h
 *         required: true
 *         description: Height of the map image in pixels.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: w
 *         required: true
 *         description: Width of the map image in pixels.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: bbox
 *         required: true
 *         description: Bounding box of the current map view.
 *         schema:
 *           type: string
 *       - in: query
 *         name: viewparams
 *         required: false
 *         description: Additional view parameters for filtering data.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved feature information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   description: The GeoJSON type.
 *                 features:
 *                   type: array
 *                   description: List of feature information.
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         description: The feature type.
 *                       properties:
 *                         type: object
 *                         description: The attributes of the feature.
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *       500:
 *         description: Internal server error when fetching GeoNode data.
 */

    const { searchParams } = new URL(req.url);

    const session = await getServerSession(AuthOptions);
    const accessToken = session?.user.geonodeAccessToken;
    
    const layer = searchParams.get('layer');
    const x = searchParams.get('x');
    const y = searchParams.get('y');
    const h = searchParams.get('h');
    const w = searchParams.get('w');
    const bbox = searchParams.get('bbox');
    const viewparams = searchParams.get('viewparams');
    
    let url = `${process.env.NEXT_PUBLIC_GEONODE}/geoserver/ows?service=WMS&version=1.1.1&request=GetFeatureInfo&layers=${layer}&query_layers=${layer}&bbox=${bbox}&height=${h}&width=${w}&x=${x}&y=${y}&info_format=application/json&viewparams=${viewparams}`
    
    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        return NextResponse.json(response.data);

    } catch (error) {
        console.error('Error fetching GeoNode resources:', error);
        return NextResponse.json({ error: 'Failed to fetch GeoNode resources' }, { status: 500 });
    }
}
