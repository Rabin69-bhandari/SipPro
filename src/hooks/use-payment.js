"use client";

import { useEffect, useState } from "react";

const usePaymentDetails = () => {
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBilling = async () => {
      try {
        const response =
          await fetch("/api/paymentDetails");

        const data = await response.json();

        console.log("Billing:", data);

        setBilling(data);
      } catch (error) {
        console.error(
          "Failed to fetch billing:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    getBilling();
  }, []);

  return {
    billing,
    loading,
  };
};

export default usePaymentDetails;