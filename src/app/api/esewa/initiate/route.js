import { NextResponse } from "next/server";
import { generateEsewaSignature } from "@/lib/esewa/esewa";
import { plans } from "@/constant/data";

export async function POST(request) {
  try {
    const { plan } = await request.json();

    console.log("Your plan is:", plan);

    const selectedPlan = plans.find(
      (item) => item.id === plan
    );

    if (!selectedPlan) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    if (selectedPlan.price === 0) {
      return NextResponse.json(
        {
          error: "Free plan does not require payment",
        },
        { status: 400 }
      );
    }

    const amount = String(selectedPlan.price);

    const taxAmount = "0";
    const serviceCharge = "0";
    const deliveryCharge = "0";

    const totalAmount = String(
      Number(amount) +
        Number(taxAmount) +
        Number(serviceCharge) +
        Number(deliveryCharge)
    );

    const transactionUuid =
      `txn-${selectedPlan.id}-${Date.now()}`;

    const productCode =
      process.env.ESEWA_PRODUCT_CODE;

    const signature = generateEsewaSignature(
      totalAmount,
      transactionUuid,
      productCode
    );

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL;

    const paymentData = {
      amount,
      tax_amount: taxAmount,
      total_amount: totalAmount,

      transaction_uuid: transactionUuid,

      product_code: productCode,

      product_service_charge: serviceCharge,

      product_delivery_charge: deliveryCharge,

      success_url:
        `${appUrl}/api/esewa/verify`,

      failure_url:
        `${appUrl}/payment/success?status=failed`,

      signed_field_names:
        "total_amount,transaction_uuid,product_code",

      signature,
    };

    console.log("🚀 eSewa transaction initiated");

    console.log({
      plan: selectedPlan.id,
      planName: selectedPlan.name,
      amount: totalAmount,
      transactionUuid,
    });

    return NextResponse.json(paymentData);
  } catch (error) {
    console.error(
      "eSewa initiation error:",
      error
    );

    return NextResponse.json(
      {
        error: "Could not initiate payment",
      },
      { status: 500 }
    );
  }
}