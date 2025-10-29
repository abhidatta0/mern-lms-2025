import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePaymentService } from "@/services";
import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PaymentReturn = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("payerId");

  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (!paymentId || !payerId || hasCalledRef.current) return;

    hasCalledRef.current = true;

    const capturePayment = async () => {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId") ?? "");

      const response = await captureAndFinalizePaymentService(
        paymentId,
        payerId,
        orderId
      );

      if (response?.success) {
        sessionStorage.removeItem("currentOrderId");
        window.location.href = "/student-courses";
      }
    };

    capturePayment();
  }, [paymentId, payerId]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing payment... Please wait</CardTitle>
      </CardHeader>
    </Card>
  )
}
export default PaymentReturn;