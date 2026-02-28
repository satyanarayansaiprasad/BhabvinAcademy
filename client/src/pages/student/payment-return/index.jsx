import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, ArrowRight, RefreshCcw } from "lucide-react";

function PaymentReturnPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const status = params.get("status");
  const orderId = params.get("orderId");

  useEffect(() => {
    // You could add a background verification check here if needed
    // to ensure the status matches the database
  }, [orderId]);

  const isSuccess = status === "success";
  const isFailed = status === "failed";
  const isPending = status === "pending";

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 xs:p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="rounded-[40px] border-zinc-200/60 shadow-2xl overflow-hidden bg-white">
          <CardContent className="p-8 xs:p-12 flex flex-col items-center text-center">
            {isSuccess && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </motion.div>
            )}

            {isFailed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6"
              >
                <XCircle className="w-10 h-10 text-red-500" />
              </motion.div>
            )}

            {isPending && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6"
              >
                <Clock className="w-10 h-10 text-amber-500" />
              </motion.div>
            )}

            <h1 className="text-3xl font-black tracking-tighter text-zinc-900 mb-3">
              {isSuccess ? "Payment Successful!" : isFailed ? "Payment Failed" : "Payment Pending"}
            </h1>

            <p className="text-zinc-500 font-medium mb-8 leading-relaxed">
              {isSuccess
                ? "Great news! Your enrollment is confirmed and you can now access your courses immediately."
                : isFailed
                  ? "We couldn't process your payment. Please try again or contact support if the issue persists."
                  : "Your payment is being processed by the bank. This usually takes a few minutes."}
            </p>

            <div className="w-full space-y-3 font-mono text-[10px] text-zinc-400 mb-8 pt-6 border-t border-zinc-100 flex flex-col items-center">
              <span>ORDER ID: {orderId?.toUpperCase()}</span>
            </div>

            {isSuccess && (
              <Button
                onClick={() => navigate("/student-courses")}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl h-14 text-lg font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                Go to My Learning
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}

            {(isFailed || isPending) && (
              <div className="flex flex-col w-full gap-3">
                <Button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl h-14 text-lg font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/home")}
                  className="w-full rounded-2xl h-12 text-zinc-500 font-bold hover:bg-zinc-100"
                >
                  Back to Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default PaymentReturnPage;
