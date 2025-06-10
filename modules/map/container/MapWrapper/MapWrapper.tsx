import { useSession } from 'next-auth/react';
import React from 'react'


export const MapWrapper: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { data: session } = useSession();
    const accessToken = session?.user?.geonodeAccessToken;
    
    const transformRequest = React.useMemo(
        () => (url: string) => {
            if (url.includes('https://nodeserver.geoportal.co.id')) {
                const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
                return {
                    url: proxyUrl,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                };
            }
            return null;
        },
        [accessToken]
    );
    
    return React.cloneElement(children, { transformRequest });
};