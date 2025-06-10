// constants/oauth.ts
export const OAUTH_CONFIG = {
    CLIENT_ID: "sa_rp2p", // Replace with your GeoNode client ID
    CLIENT_SECRET: process.env.GEONODE_CLIENT_SECRET, // Replace with your GeoNode client secret
    AUTH_URL: 'https://nodeserver.geoportal.co.id/o/authorize/',
    TOKEN_URL: 'https://nodeserver.geoportal.co.id/o/token/',
    REDIRECT_URI: 'http://localhost:3000/api/gn/auth', // Change to your deployed app URL
    SCOPE: 'openid write', // Adjust scope based on your needs
};  