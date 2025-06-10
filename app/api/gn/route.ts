import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  /**
 * @swagger
 * /gn:
 *   get:
 *     summary: Fetch GeoNode API metadata
 *     description: Retrieves the API metadata from the GeoNode instance.
 *     tags:
 *       - GeoNode
 *     responses:
 *       200:
 *         description: Successfully retrieved API metadata.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Internal server error when fetching API metadata.
 */

  const url = `${process.env.NEXT_PUBLIC_GEONODE}/api/v2/?format=json`;

  try {
    // Make the request to GeoNode API to get API metadata
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    // Return the API metadata as JSON
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching API metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch API metadata' }, { status: 500 });
  }
}
