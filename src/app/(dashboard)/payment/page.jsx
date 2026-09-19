"use client"

import { useState } from "react"
import {
  ArrowRight,
  Check,
  Crown,
  LoaderCircle,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react"

import usePaymentDetails from "@/hooks/use-payment"
import { plans } from "@/constant/data"


// =====================================================
// PLANS
// IMPORTANT:
// Backend /api/esewa/initiate should decide the real
// amount from plan.id. Never trust browser price.
// =====================================================



export default function Payment() {

  // =====================================================
  // STATE
  // =====================================================

  const [loadingPlan, setLoadingPlan] = useState(null)
  const [error, setError] = useState("")

  const {
    billing,
    loading,
  } = usePaymentDetails()

  const userPlan =
    billing?.userPlan || "free"


  // =====================================================
  // ESEWA PAYMENT
  // =====================================================

  async function handleEsewaPayment(plan) {

    // Free plan does not need eSewa
    if (plan.price === 0) {
      return
    }

    try {

      setError("")
      setLoadingPlan(plan.id)


      // -----------------------------------------------
      // Ask our backend to create signed eSewa payment
      // -----------------------------------------------

      const response = await fetch(
        "/api/esewa/initiate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            plan: plan.id,
          }),
        }
      )


      const paymentData =
        await response.json()


      if (!response.ok) {

        throw new Error(
          paymentData?.error ||
          "Failed to initiate payment"
        )

      }


      console.log(
        "eSewa payment initiated:",
        paymentData
      )


      // -----------------------------------------------
      // Create eSewa POST form dynamically
      // -----------------------------------------------

      const form =
        document.createElement("form")

      form.method = "POST"

      // eSewa RC / sandbox environment
      form.action =
        "https://rc-epay.esewa.com.np/api/epay/main/v2/form"


      // -----------------------------------------------
      // Add all fields returned by backend
      // -----------------------------------------------

      Object.entries(paymentData).forEach(
        ([key, value]) => {

          if (
            value === undefined ||
            value === null
          ) {
            return
          }


          const input =
            document.createElement("input")

          input.type = "hidden"
          input.name = key
          input.value = String(value)

          form.appendChild(input)

        }
      )


      // -----------------------------------------------
      // Submit to eSewa
      // -----------------------------------------------

      document.body.appendChild(form)

      form.submit()

    } catch (error) {

      console.error(
        "eSewa payment error:",
        error
      )

      setError(
        error.message ||
        "Could not start payment."
      )

      setLoadingPlan(null)

    }

  }


  // =====================================================
  // CARD PAYMENT
  // Placeholder for later
  // =====================================================

  function handleCardPayment(plan) {

    console.log(
      "Card payment selected:",
      {
        plan: plan.id,
        amount: plan.price,
        provider: "clerk",
      }
    )

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <main className="min-h-screen bg-background">

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">


        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mx-auto max-w-3xl text-center">

          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">

            <Sparkles className="size-4" />

            Simple Pricing

          </div>


          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">

            Invest in your{" "}

            <span className="text-primary">
              career readiness.
            </span>

          </h1>


          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">

            Build your roadmap, learn with AI,
            prove your skills through assessments
            and interviews, and turn your evidence
            into a professional CV.

          </p>


          {/* CURRENT PLAN */}

          <div className="mt-5">

            {loading ? (

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">

                <LoaderCircle className="size-4 animate-spin" />

                Checking your plan...

              </div>

            ) : (

              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">

                <Check className="size-4" />

                Current plan:

                <span className="capitalize">
                  {formatPlanName(userPlan)}
                </span>

              </div>

            )}

          </div>

        </div>


        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (

          <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">

            {error}

          </div>

        )}


        {/* ================================================= */}
        {/* PLANS */}
        {/* ================================================= */}

        <div className="mt-14 grid gap-6 lg:grid-cols-3">

          {plans.map((plan) => {

            const Icon = plan.icon

            const isActive =
              userPlan === plan.id

            const isProcessing =
              loadingPlan === plan.id

            const anotherPlanProcessing =
              loadingPlan !== null &&
              !isProcessing


            return (

              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isActive
                    ? "border-primary ring-2 ring-primary/10"
                    : plan.popular
                    ? "border-primary/50 shadow-lg shadow-primary/5"
                    : "border-border"
                }`}
              >


                {/* ========================================= */}
                {/* ACTIVE PLAN BADGE */}
                {/* ========================================= */}

                {isActive && (

                  <div className="absolute -top-3 right-5">

                    <div className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm">

                      <Check className="size-3.5" />

                      ACTIVE PLAN

                    </div>

                  </div>

                )}


                {/* ========================================= */}
                {/* POPULAR BADGE */}
                {/* ========================================= */}

                {plan.popular && !isActive && (

                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">

                    <div className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm">

                      <Sparkles className="size-3.5" />

                      MOST POPULAR

                    </div>

                  </div>

                )}


                {/* ========================================= */}
                {/* ICON */}
                {/* ========================================= */}

                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${
                    plan.popular || isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >

                  <Icon className="size-5" />

                </div>


                {/* ========================================= */}
                {/* PLAN INFO */}
                {/* ========================================= */}

                <div className="mt-6">

                  <h2 className="text-xl font-bold">
                    {plan.name}
                  </h2>


                  <p className="mt-2 min-h-10 text-sm leading-5 text-muted-foreground">

                    {plan.description}

                  </p>

                </div>


                {/* ========================================= */}
                {/* PRICE */}
                {/* ========================================= */}

                <div className="mt-7 flex items-end gap-1">

                  {plan.price === 0 ? (

                    <span className="text-4xl font-bold tracking-tight">
                      Free
                    </span>

                  ) : (

                    <>

                      <span className="mb-1 text-sm font-medium text-muted-foreground">
                        NPR
                      </span>

                      <span className="text-4xl font-bold tracking-tight">
                        {plan.price}
                      </span>

                      <span className="mb-1 text-sm text-muted-foreground">
                        / {plan.period}
                      </span>

                    </>

                  )}

                </div>


                {/* ========================================= */}
                {/* ESEWA BUTTON */}
                {/* ========================================= */}

                <button
                  onClick={() =>
                    handleEsewaPayment(plan)
                  }
                  disabled={
                    isActive ||
                    plan.price === 0 ||
                    loadingPlan !== null
                  }
                  className={`mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${
                    isActive ||
                    plan.price === 0
                      ? "cursor-default border border-border bg-muted/50 text-muted-foreground"
                      : plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                      : "border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 disabled:opacity-60"
                  }`}
                >

                  {isProcessing ? (

                    <>

                      <LoaderCircle className="size-4 animate-spin" />

                      Redirecting to eSewa...

                    </>

                  ) : isActive ? (

                    <>

                      <Check className="size-4" />

                      Current Plan

                    </>

                  ) : plan.price === 0 ? (

                    "Free Plan"

                  ) : (

                    <>

                      <span className="text-base">
                        🇳🇵
                      </span>

                      Pay with eSewa

                      <ArrowRight className="size-4" />

                    </>

                  )}

                </button>


                {/* ========================================= */}
                {/* CARD PAYMENT */}
                {/* ========================================= */}

                {plan.price > 0 && !isActive && (

                  <>

                    <div className="flex items-center gap-3 py-3">

                      <div className="h-px flex-1 bg-border" />

                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        OR
                      </span>

                      <div className="h-px flex-1 bg-border" />

                    </div>


                    <button
                      onClick={() =>
                        handleCardPayment(plan)
                      }
                      disabled={
                        loadingPlan !== null
                      }
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background text-sm font-semibold transition hover:border-primary/30 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      <span>
                        💳
                      </span>

                      Pay with Card

                    </button>

                  </>

                )}


                {/* ========================================= */}
                {/* DIVIDER */}
                {/* ========================================= */}

                <div className="my-7 h-px bg-border" />


                {/* ========================================= */}
                {/* FEATURES */}
                {/* ========================================= */}

                <div className="flex-1">

                  <p className="mb-4 text-sm font-semibold">
                    What's included
                  </p>


                  <div className="space-y-3.5">

                    {plan.features.map(
                      (feature) => (

                        <div
                          key={feature}
                          className="flex items-start gap-3"
                        >

                          <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">

                            <Check className="size-3" />

                          </div>


                          <span className="text-sm text-muted-foreground">

                            {feature}

                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

            )

          })}

        </div>


        {/* ================================================= */}
        {/* PAYMENT INFORMATION */}
        {/* ================================================= */}

        <div className="mt-12 rounded-2xl border border-border bg-card p-6">

          <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">

            <div>

              <h3 className="font-semibold">
                Secure payments with eSewa
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">

                Choose your plan and you'll be
                redirected to eSewa to complete
                the payment securely.

              </p>

            </div>


            <div className="flex items-center gap-2 text-sm font-medium text-primary">

              <span className="text-xl">
                🇳🇵
              </span>

              eSewa Checkout

            </div>

          </div>

        </div>


        {/* FOOTER */}

        <p className="mt-8 text-center text-xs text-muted-foreground">

          Secure payment • Your plan activates
          after successful payment verification

        </p>

      </div>

    </main>

  )

}


// =====================================================
// FORMAT PLAN NAME
// =====================================================

function formatPlanName(plan) {

  if (!plan) {
    return "Free"
  }

  if (plan === "career_plus") {
    return "Career+"
  }

  return (
    plan.charAt(0).toUpperCase() +
    plan.slice(1)
  )

}