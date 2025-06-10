/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'server.arcgisonline.com',
                pathname: '/ArcGIS/rest/services/World_Imagery/MapServer/tile/**',
            },
            {
                protocol: 'https',
                hostname: 'mt0.google.com',
                pathname: '/vt/lyrs=m&x=**',
            },
            {
                protocol: 'https',
                hostname: 'mt0.google.com',
                pathname: '/vt/lyrs=s&x=**',
            },
            {
                protocol: 'https',
                hostname: 'a.tile.openstreetmap.org',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'api.maptiler.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cartodb-basemaps-c.global.ssl.fastly.net',
                pathname: '/dark_all/**',
            },
            {
                protocol: 'https',
                hostname: 'a.basemaps.cartocdn.com',
                pathname: '/rastertiles/light_all/**',
            },
            {
                protocol: 'https',
                hostname: 'stable.demo.geonode.org',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.gravatar.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'master.demo.geonode.org',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'nodeserver.geoportal.co.id',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
