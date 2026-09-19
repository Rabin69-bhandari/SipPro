import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST() {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "sip/assessment-evidence";

    // Only these parameters are included in the signature.
    const parametersToSign = {
      folder,
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      parametersToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      success: true,
      timestamp,
      folder,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error("Cloudinary signature error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Could not generate Cloudinary signature",
      },
      {
        status: 500,
      }
    );
  }
}