import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET(req: NextRequest, { params }: { params: { uid: number , cid:string} }) {

    const clientId = params.cid;
    const geonodeUId = params.uid.toString();

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const clientSecret = process.env.GEONODE_CLIENT_SECRET;
    const redirectUri = `${process.env.GEONODE_REDIRECT_URI}/${geonodeUId}/${clientId}`;
    const refreshToken = req.cookies.get('refresh_token');

    


    if (!code) {
        return NextResponse.json({ error: 'Authorization code not found in the URL' });
    }

    try {
   

        const tokenResponse = await fetch('https://nodeserver.geoportal.co.id/o/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:new URLSearchParams({
                grant_type: 'authorization_code',
                user:geonodeUId,
                code: code as string,
                client_id: clientId as string,
                client_secret: clientSecret as string,
                redirect_uri: redirectUri,
                scope: 'openid write',
            })
        });
        
        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Token Response Error:', errorText);
            throw new Error(`Failed to fetch the access token. Status: ${tokenResponse.status}`);
        }
    
        const tokenData = await tokenResponse.json();
        
         // Remove any existing cookies before setting new ones
         const accessTokenCookie = serialize('access_token', tokenData.access_token, { 
            path: '/', 
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict' 
        });

        // const accessTokenCookie = serialize('access_token', tokenData.access_token, { path: '/' });
        // const refreshTokenCookie = serialize('refresh_token', tokenData.refresh_token, { path: '/' });
    
        const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/sign-in`);
        response.headers.set('Set-Cookie', accessTokenCookie);
        // response.headers.set('Set-Cookie', refreshTokenCookie);
    
        return response;
    
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred during the token exchange' }, { status: 500 });
    }
    
}

