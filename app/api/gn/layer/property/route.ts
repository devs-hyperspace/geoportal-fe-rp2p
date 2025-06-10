import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/lib/auth';


export async function GET(req: NextRequest) {

    /**
 * @swagger
 * /gn/layer/property:
 *   get:
 *     summary: Fetch feature type description from GeoNode
 *     description: Retrieve the attribute schema and geometry type of a specified GeoNode layer.
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
 *         name: viewparams
 *         required: false
 *         description: Additional view parameters for filtering data.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved feature type description.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 featureTypes:
 *                   type: array
 *                   description: List of feature attributes and their properties.
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The attribute name.
 *                       localType:
 *                         type: string
 *                         description: The data type of the attribute.
 *                 geometry:
 *                   type: object
 *                   description: The geometry field information.
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The geometry field name.
 *                     geomType:
 *                       type: string
 *                       description: The geometry type (e.g., Point, Polygon).
 *                 attributeList:
 *                   type: array
 *                   description: List of attribute names excluding the geometry field.
 *                   items:
 *                     type: string
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *       500:
 *         description: Internal server error when fetching GeoNode data.
 */

    const { searchParams } = new URL(req.url);

    const layer = searchParams.get('layer');
    const viewparams = searchParams.get('viewparams');

    const session = await getServerSession(AuthOptions);
    const accessToken = session?.user.geonodeAccessToken;
    
    let url = `${process.env.NEXT_PUBLIC_GEONODE}/geoserver/ows?service=wfs&version=2.0.0&typeNames=${layer}&request=DescribeFeatureType&outputFormat=application/json&viewparams=${viewparams}`
    
    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        
        const geometryTypes = [
            "Point", "LineString", "Polygon", "MultiPoint", 
            "MultiLineString", "MultiPolygon", "GeometryCollection"
        ];


        const geometryProperty = response.data.featureTypes[0].properties.find((feature:any) =>
            geometryTypes.includes(feature.localType)
        );
        
        const geometry = {
            name:geometryProperty.name,
            geomType:geometryProperty.localType
        }


        let attributeList = response.data.featureTypes[0].properties.map((property:any) => property.name);
        attributeList = attributeList.filter((attributeList:any) => attributeList !== geometryProperty.name);
        
        const result = {
            featureTypes: response.data.featureTypes[0].properties,
            geometry: geometry,
            attributeList: attributeList
        }
        
        return NextResponse.json(result);        

    } catch (error) {
        console.error('Error fetching GeoNode resources:', error);
        return NextResponse.json({ error: 'Failed to fetch GeoNode resources' }, { status: 500 });
    }
}
