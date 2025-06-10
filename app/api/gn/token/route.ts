import axios from "axios";
import { parse } from "node-html-parser";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support"; // Add axios-cookiejar-support
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  const body = await req.json();
  const { login, password } = body;

  const geoNodeUrl = "https://nodeserver.geoportal.co.id/";
  const jar = new CookieJar(); // Initialize cookie jar
  const client = wrapper(axios.create({ jar })); // Wrap axios instance

  try {
    // Step 1: Fetch the login page to get the CSRF token
    const loginPageResponse = await client.get(`${geoNodeUrl}account/login/`, {
      withCredentials: true,
    });

    // Parse the CSRF token
    const root = parse(loginPageResponse.data);
    const csrfToken = root.querySelector("input[name='csrfmiddlewaretoken']")?.getAttribute("value");

    if (!csrfToken) {
      return NextResponse.json({ error: "Unable to fetch CSRF token" });
    }

    // Step 2: Submit login credentials
    const loginResponse = await client.post(
      `${geoNodeUrl}account/login/`,
      new URLSearchParams({
        csrfmiddlewaretoken: csrfToken,
        login,
        password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: `${geoNodeUrl}account/login/`,
        },
        withCredentials: true,
      }
    );

    if (loginResponse.status === 200) {
      return NextResponse.json({ message: "Login successful" });
    } else {
      return NextResponse.json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
