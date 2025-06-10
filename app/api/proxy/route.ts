import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const url = searchParams.get('url');

	if (!url) {
		return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
	}

	try {
		// Proxy the request using Axios
		const response = await axios.get(url, {
			headers: {
				Authorization: req.headers.get('Authorization') || '',
			},
			responseType: 'arraybuffer', // Handle binary data (e.g., images)
		});

		// Stream back the proxied response
		return new NextResponse(response.data, {
			status: response.status,
			headers: {
				'Content-Type': response.headers['content-type'] || 'application/octet-stream',
				'Access-Control-Allow-Origin': '*', // Adjust for production
				'Access-Control-Allow-Methods': 'GET, OPTIONS',
				'Access-Control-Allow-Headers': 'Authorization, Content-Type',
			},
		});
	} catch (error: any) {
		return NextResponse.json(
			{ error: error.response?.data || error.message },
			{ status: error.response?.status || 500 }
		);
	}
}

export async function OPTIONS() {
	return new NextResponse(null, {
		headers: {
			'Access-Control-Allow-Origin': '*', // Adjust for production
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Authorization, Content-Type',
		},
	});
}
