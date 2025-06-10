import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import xml2js from 'xml2js';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/lib/auth';

const handlePropertyMapping = (propertiesArray: any[], property: string[]) => {
    
    // Map the object keys based on the provided property, excluding 'ogc_fid'
    return propertiesArray.map((item: any) => {
        // Filter out 'ogc_fid' and map the object keys based on the property array
        const filteredItem = Object.keys(item)
            .filter((key) => !key.includes('ogc_fid'))  // Exclude 'ogc_fid'
            .reduce((acc, key) => {
                acc[key] = item[key];
                return acc;
            }, {} as any);

        // Now, reorder the object based on the 'property' array if it's provided
        const sortedItem = property.reduce((acc, header) => {
            if (filteredItem.hasOwnProperty(header)) {
                acc[header] = filteredItem[header];  // Add the property in the sorted order
            }
            return acc;
        }, {} as any);

        return sortedItem;
    });
}


export async function GET(req: NextRequest) {
    /**
 * @swagger
 * /gn/layer/propertyValue:
 *   get:
 *     summary: Fetch layer data from GeoNode
 *     description: Retrieves feature data with optional attribute filtering, bounding box filtering, and aggregation.
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
 *         name: property
 *         required: false
 *         description: Comma-separated list of properties to retrieve.
 *         schema:
 *           type: string
 *       - in: query
 *         name: bbox
 *         required: false
 *         description: Bounding box filter in "minx,miny,maxx,maxy" format.
 *         schema:
 *           type: string
 *       - in: query
 *         name: cql_filter
 *         required: false
 *         description: Custom CQL filter for feature selection.
 *         schema:
 *           type: string
 *       - in: query
 *         name: agg
 *         required: false
 *         description: Aggregation type (e.g., sum, count).
 *         schema:
 *           type: string
 *       - in: query
 *         name: metric
 *         required: false
 *         description: Flag to return metric summary instead of full data.
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: viewparams
 *         required: false
 *         description: Additional view parameters for filtering data.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved layer data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *       500:
 *         description: Internal server error when fetching GeoNode data.
 */




    const { searchParams } = new URL(req.url);

    const session = await getServerSession(AuthOptions);
    const accessToken = session?.user.geonodeAccessToken;
    
    const layer = searchParams.get('layer');
    
    const property = searchParams.get('property');
    const bbox = searchParams.get('bbox');
    const cql_filter = searchParams.get('cql_filter');
    const agg = searchParams.get('agg');
    const metric = searchParams.get('metric');
    const viewparams = searchParams.get('viewparams');

    let url = `${process.env.NEXT_PUBLIC_GEONODE}/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&typenames=${layer}&outputFormat=application/json&viewparams=${viewparams}`
    
    let urlGetAttributeList = `${process.env.NEXT_PUBLIC_GEONODE}/geoserver/ows?service=wfs&version=2.0.0&typeNames=${layer}&request=DescribeFeatureType&outputFormat=application/json&viewparams=${viewparams}`
    
    const getAttributeList = await axios.get(urlGetAttributeList, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const geometryTypes = [
        "Point", "LineString", "Polygon", "MultiPoint",
        "MultiLineString", "MultiPolygon", "GeometryCollection"
    ];


    const geometryProperty = getAttributeList.data.featureTypes[0].properties.find((feature: any) =>
        geometryTypes.includes(feature.localType)
    );

    if (!property) {
        let attributeList = getAttributeList.data.featureTypes[0].properties.map((property: any) => property.name);
        attributeList = attributeList.filter((attributeList: any) => attributeList !== geometryProperty.name);
        
        url += `&propertyName=${attributeList.join(',')}`
    } else {
        url += `&propertyName=${property}`
    }
    
    const params = {
        cql_filter: '',
    }
    
    if (cql_filter && bbox) {
        params.cql_filter = `${cql_filter} AND BBOX(${geometryProperty.name}, ${bbox},'EPSG:4326')`;
    } else if (cql_filter) {
        params.cql_filter = `${cql_filter}`;
    } else if (bbox) {
        params.cql_filter = `BBOX(${geometryProperty.name}, ${bbox}, 'EPSG:4326')`;
    }

    const queryString = new URLSearchParams(params).toString();
    url = `${url}&${queryString}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        let propertiesArray = response.data.features.map((feature: any) => feature.properties);
        
        if (property && !property.includes('ogc_fid')) {
            propertiesArray = handlePropertyMapping(propertiesArray, property.split(','))
        }
        
        if (property && agg) {
            const aggregations = agg.split(',');
            const params = property.split(',');

            const groupByParams = ({ data, params, aggregations }: any) => {
                const groupedData = new Map();

                const createInitialObject = () => {
                    const initialObject: any = {};
                    aggregations.forEach((aggr: any, index: number) => {
                        const paramName = params[index];

                        if (aggr == "sum"){
                            initialObject[`total_${paramName}`] = 0;
                        }else{
                            initialObject[`${aggr}_${paramName}`] = 0;
                        }
                    });
                    return initialObject;
                };

                data.forEach((row: any) => {
                    const key = row[params[0]]


                    if (!groupedData.has(key)) {
                        groupedData.set(key, createInitialObject());
                    }

                    const group = groupedData.get(key);

                    params.forEach((param: any, index:any) => {
                        const aggType = aggregations[index];
                        const value = parseFloat(row[param]) || 0;

                        if (aggType === 'count') {
                            group[`count_${params[index]}`] += 1;
                        } else if (aggType === 'sum') {
                            group[`total_${params[index]}`] += value;
                        }
                    });
                });

                return Array.from(groupedData.entries()).map(([key, group]) => {
                    return { [params[0]]: key, ...group };
                });
            }

            let result:any = groupByParams({ data: propertiesArray, params, aggregations})
            
            if (metric) {
                if (aggregations[0] === 'sum') {
                    const metricResult = {
                        label: `Total ${params[0]}`,
                        value: result.reduce((sum:any, item:any) => sum + (item[`total_${params[0]}`] || 0), 0) // Handle missing or undefined properties
                    };
                    result = metricResult
                } else if (aggregations[0] === 'count') {
                    const metricResult = {
                        label: `Count ${params[0]}`,
                        value: result.reduce((count:any, item:any) => count + 1, 0) // Handle missing or undefined properties
                    };
                    result = metricResult
                }
            }
            propertiesArray = result
        }


        return NextResponse.json(propertiesArray);

    } catch (error) {
        console.error('Error fetching GeoNode resources:', error);
        return NextResponse.json({ error: 'Failed to fetch GeoNode resources' }, { status: 500 });
    }

}