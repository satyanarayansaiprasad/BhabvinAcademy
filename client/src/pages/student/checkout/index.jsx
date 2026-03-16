import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { createPaymentService, captureAndFinalizePaymentService, createFreeOrderService } from "@/services";
import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, ShoppingBag, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function CheckoutPage() {
    const { auth } = useContext(AuthContext);
    const { cartItems, setCartItems } = useContext(StudentContext);
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const singleCourse = location.state?.course;
    const itemsToBuy = singleCourse ? [singleCourse] : cartItems;
    const totalAmount = itemsToBuy.reduce((acc, item) => acc + parseFloat(item.coursePricing || item.pricing), 0);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    async function handlePayment() {
        const orderPayload = {
            userId: auth?.user?._id,
            userName: auth?.user?.userName,
            userEmail: auth?.user?.userEmail,
            courses: itemsToBuy.map((item) => ({
                courseId: item.courseId || item._id,
                title: item.title,
                instructorId: item.instructorId,
                instructorName: item.instructorName,
                courseImage: item.courseImage || item.image,
                coursePricing: item.coursePricing || item.pricing,
            })),
        };

        try {
            if (totalAmount === 0) {
                const response = await createFreeOrderService(orderPayload);
                if (response.success) {
                    toast({ title: "Purchase Successful", description: "You have successfully enrolled in the free course." });
                    if (!singleCourse) setCartItems([]);
                    setTimeout(() => navigate("/student-courses"), 1500);
                } else {
                    toast({ title: "Error", description: response.message || "Failed to enroll.", variant: "destructive" });
                }
                return;
            }

            const response = await createPaymentService(orderPayload);
            if (response.success) {
                const { razorpayOrderId, amount, currency, razorpayKeyId, orderId } = response.data;

                const options = {
                    key: razorpayKeyId,
                    amount: amount,
                    currency: currency,
                    name: "Bhavin Academy",
                    description: "Purchase Courses",
                    order_id: razorpayOrderId,
                    handler: async function (response) {
                        setIsProcessing(true);
                        try {
                            const captureResponse = await captureAndFinalizePaymentService(
                                response.razorpay_order_id,
                                response.razorpay_payment_id,
                                response.razorpay_signature,
                                orderId
                            );

                            if (captureResponse.success) {
                                if (!singleCourse) setCartItems([]);
                                navigate(`/payment-return?orderId=${orderId}&status=success`);
                            } else {
                                navigate(`/payment-return?orderId=${orderId}&status=failed`);
                            }
                        } catch (error) {
                            console.error("Capture Error:", error);
                            navigate(`/payment-return?orderId=${orderId}&status=failed`);
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                    prefill: {
                        name: auth?.user?.userName,
                        email: auth?.user?.userEmail,
                    },
                    theme: {
                        color: "#0067b8",
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                toast({ title: "Error", description: "Failed to initiate payment. Please try again.", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        }
    }

    if (itemsToBuy.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <ShoppingBag className="w-12 h-12 xs:w-16 xs:h-16 text-zinc-300 mb-4" />
                <h2 className="text-xl xs:text-2xl font-bold text-zinc-900 mb-2">Your checkout is empty</h2>
                <Button onClick={() => navigate("/courses")} className="rounded-full px-8 min-h-[44px]">Browse Courses</Button>
            </div>
        );
    }

    return (
    <div className="bg-[#f2f2f2] min-h-screen pt-20 xs:pt-24 md:pt-32 pb-16">
      {isProcessing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-6 text-center">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-[#0067b8] animate-spin mb-4" />
            <h2 className="text-2xl font-semibold tracking-tight text-black mb-2">Verifying your payment...</h2>
            <p className="text-[#616161] font-normal">Please do not close or refresh this page.</p>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 xs:px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course List */}
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-3xl xs:text-4xl font-semibold tracking-tight text-black">Checkout</h1>
            <div className="space-y-4">
              {itemsToBuy.map((item, index) => (
                <div key={index} className="bg-white rounded-sm border border-[#e6e6e6] p-4 flex flex-col xs:flex-row gap-6 shadow-sm overflow-hidden">
                  <img
                    src={item.courseImage || item.image}
                    className="w-full xs:w-32 h-20 rounded-sm object-cover shrink-0"
                    alt={item.title}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black text-lg mb-1">{item.title}</h3>
                    <p className="text-xs text-[#616161] font-normal mb-2">By <span className="text-black font-semibold">{item.instructorName}</span></p>
                    <p className="text-xl font-bold text-black">₹{item.coursePricing || item.pricing}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-sm border border-[#e6e6e6] p-8 shadow-sm lg:sticky lg:top-32 overflow-hidden">
              <h2 className="text-lg font-semibold text-black mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[#616161] font-normal text-sm">
                  <span>Subtotal</span><span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-[#616161] font-normal text-sm">
                  <span>Tax</span><span>₹0.00</span>
                </div>
                <div className="pt-4 border-t border-[#f2f2f2] flex justify-between items-end">
                  <span className="font-semibold text-black">Total</span>
                  <span className="text-3xl font-bold text-black tracking-tight">₹{totalAmount}</span>
                </div>
              </div>
              <Button
                onClick={handlePayment}
                className="w-full bg-[#0067b8] hover:bg-[#005a9e] text-white rounded-sm h-14 text-lg font-semibold transition-none flex items-center justify-center gap-2"
              >
                {totalAmount === 0 ? (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Free Enroll</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay Now</span>
                  </>
                )}
              </Button>
              <div className="mt-6 flex items-center justify-center gap-2 text-[#616161] font-normal text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Secure Payment Shielded by SSL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}

export default CheckoutPage;
