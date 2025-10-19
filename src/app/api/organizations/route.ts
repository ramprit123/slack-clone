import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      );
    }

    // Get management API token
    const tokenResponse = await fetch(`${process.env.KINDE_ISSUER_URL}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.KINDE_CLIENT_ID!,
        client_secret: process.env.KINDE_CLIENT_SECRET!,
        audience: `${process.env.KINDE_ISSUER_URL}/api`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to get management API token");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Create organization using Kinde Management API
    const orgResponse = await fetch(`${process.env.KINDE_ISSUER_URL}/api/v1/organizations`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name,
        external_id: `workspace_${Date.now()}`, // Optional: custom external ID
        background_color: "#1f2937", // Optional: customize appearance
        button_color: "#3b82f6",
        button_text_color: "#ffffff",
        link_color: "#3b82f6",
      }),
    });

    if (!orgResponse.ok) {
      const errorData = await orgResponse.text();
      console.error("Kinde API Error:", errorData);
      throw new Error("Failed to create organization");
    }

    const organization = await orgResponse.json();

    // Add the current user as an admin to the organization
    const addUserResponse = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/organizations/${organization.code}/users`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          users: [
            {
              id: user.id,
              roles: ["admin"], // Make the creator an admin
            },
          ],
        }),
      }
    );

    if (!addUserResponse.ok) {
      console.error("Failed to add user to organization");
      // Don't fail the entire request if this fails
    }

    return NextResponse.json({
      success: true,
      organization,
      message: "Organization created successfully",
    });

  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get user's organizations
export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get management API token
    const tokenResponse = await fetch(`${process.env.KINDE_ISSUER_URL}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.KINDE_CLIENT_ID!,
        client_secret: process.env.KINDE_CLIENT_SECRET!,
        audience: `${process.env.KINDE_ISSUER_URL}/api`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to get management API token");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user's organizations
    const orgsResponse = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/users/${user.id}/organizations`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Accept": "application/json",
        },
      }
    );

    if (!orgsResponse.ok) {
      throw new Error("Failed to fetch organizations");
    }

    const organizations = await orgsResponse.json();

    return NextResponse.json({
      success: true,
      organizations: organizations.organizations || [],
    });

  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}