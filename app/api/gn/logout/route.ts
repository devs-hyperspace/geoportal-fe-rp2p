import axios from "axios";
import { parse } from "node-html-parser";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const geoNodeUrl = "https://nodeserver.geoportal.co.id/";
  const jar = new CookieJar(); // Initialize cookie jar
  const client = wrapper(axios.create({ jar })); // Wrap axios instance

  try {
    // Step 1: Fetch the login page or home page to get CSRF token and session cookies
    const loginPageResponse = await client.get(`${geoNodeUrl}account/logout/`, {
      withCredentials: true,
    });

    // Parse the CSRF token from the HTML response
    const root = parse(loginPageResponse.data);
    const csrfToken = root
    .querySelector("input[name='csrfmiddlewaretoken']")
    ?.getAttribute("value");
    
    if (!csrfToken) {
      throw new Error("CSRF token not found");
    }

    const response = await client.post(
      `${geoNodeUrl}account/logout/`,
      new URLSearchParams({
        csrfmiddlewaretoken: csrfToken
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form",
          Referer: `${geoNodeUrl}account/logout/`,
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      return NextResponse.json({ message: "Logout successful" });
    } else {
      return NextResponse.json({ error: "Logout failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
