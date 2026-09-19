import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "User is not authenticated",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const encodedData = searchParams.get("data");

    if (!encodedData) {
      return NextResponse.json(
        {
          error: "No payment data received",
        },
        { status: 400 }
      );
    }

    const decodedData = Buffer.from(
      encodedData,
      "base64"
    ).toString("utf-8");

    const paymentData = JSON.parse(decodedData);

    const transactionUuid =
      paymentData.transaction_uuid;

    const plan =
      transactionUuid.split("-")[1];

    const signedFieldNames =
      paymentData.signed_field_names;

    const message = signedFieldNames
      .split(",")
      .map(
        (field) =>
          `${field}=${paymentData[field]}`
      )
      .join(",");

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.ESEWA_SECRET_KEY
        )
        .update(message)
        .digest("base64");

    const isValid =
      expectedSignature ===
      paymentData.signature;

    if (!isValid) {
      return NextResponse.json(
        {
          error: "Invalid payment signature",
        },
        { status: 400 }
      );
    }

    if (paymentData.status !== "COMPLETE") {
      return NextResponse.json({
        success: false,
        message: "Payment not completed",
        status: paymentData.status,
        plan,
      });
    }

    const client = await clerkClient();

    await client.users.updateUser(userId, {
      publicMetadata: {
        userPlan: plan,
      },
    });

    return NextResponse.redirect(
      new URL("/home", request.url)
    );
  } catch (error) {
    console.error(
      "eSewa verification error:",
      error
    );

    return NextResponse.json(
      {
        error: "Payment verification failed",
      },
      { status: 500 }
    );
  }
}