// utils/oauth.ts
// import { OAUTH_CONFIG } from '../constants/oauth';

import { OAUTH_CONFIG } from "@/constant/oauth";

export const redirectToGeoNodeAuth = (uid:number, cid:string) => {

  const { CLIENT_ID, AUTH_URL, REDIRECT_URI, SCOPE } = OAUTH_CONFIG;

  const redirectUri = `${REDIRECT_URI}/${uid.toString()}/${cid}`;
  const authUrl = `${AUTH_URL}?response_type=code&client_id=${cid}&user=${uid.toString()}&redirect_uri=${redirectUri}&scope=${SCOPE}`;

  window.location.href = authUrl; // Redirects the user to GeoNode for login
};