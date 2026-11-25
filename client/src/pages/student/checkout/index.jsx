import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { createPaymentService, captureAndFinalizePaymentService, createFreeOrderService } from "@/services";
import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, CreditCard, ShoppingBag, Loader2, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
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
                        color: "#0071e3",
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
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight mb-2">Your checkout is empty</h2>
                <p className="text-sm text-[#86868b] max-w-sm mb-6">Select a course to enrich your knowledge and boost your professional career.</p>
                <Button onClick={() => navigate("/courses")} className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full px-8 py-3 text-sm font-semibold transition-colors">
                    Explore Courses
                </Button>
            </div>
        );
    }

    return (
    <div className="bg-[#fafbfc] min-h-screen font-sans text-[#1d1d1f] pt-24 pb-20">
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="bg-[#1d1d1f] p-8 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center max-w-sm w-full">
            <Loader2 className="w-10 h-10 text-[#0071e3] animate-spin mb-4" />
            <h2 className="text-xl font-bold tracking-tight mb-2">Verifying your payment...</h2>
            <p className="text-xs text-gray-400">Please do not close or refresh this page.</p>
          </div>
        </div>
      )}

      <div className="max-w-[1140px] mx-auto px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#86868b]">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1 text-[#0071e3] hover:underline bg-transparent border-none p-0 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <span>/</span>
          <span>Checkout & Secure Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          
          {/* Left Column: Course Items */}
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#0071e3] uppercase tracking-wider">Step 2 of 2</span>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#1d1d1f] mt-1">Review Your Enrollment</h1>
              <p className="text-sm text-[#86868b] mt-1">Confirm the course items and proceed to instant secure access.</p>
            </div>

            <div className="space-y-4">
              {itemsToBuy.map((item, index) => {
                const rawItemImg = item.courseImage || item.image;
                const itemImg = rawItemImg?.startsWith("http://") ? rawItemImg.replace(/^http:\/\//i, "https://") : rawItemImg;
                const isGradient = itemImg && (itemImg.includes("gradient") || itemImg.includes("|"));
                let iconChar = "📚";
                let bgGrad = "linear-gradient(135deg, #0071e3, #42a5f5)";
                if (isGradient && itemImg.includes("|")) {
                  const parts = itemImg.split("|");
                  iconChar = parts[0] || "📚";
                  bgGrad = parts[1] || bgGrad;
                }

                return (
                  <div key={index} className="bg-white rounded-2xl border border-[#e5e5e5] p-5 flex flex-col sm:flex-row gap-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all">
                    {isGradient ? (
                      <div 
                        className="w-full sm:w-36 h-24 rounded-xl flex items-center justify-center text-3xl shrink-0 shadow-sm"
                        style={{ background: bgGrad }}
                      >
                        {iconChar}
                      </div>
                    ) : (
                      <img
                        src={itemImg || "/banner-img.png"}
                        className="w-full sm:w-36 h-24 rounded-xl object-cover shrink-0 bg-gray-100"
                        alt={item.title}
                      />
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-blue-50 text-[#0071e3] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Course
                          </span>
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Full Lifetime Access
                          </span>
                        </div>
                        <h3 className="font-bold text-[#1d1d1f] text-base leading-snug line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-[#86868b] mt-1">
                          Instructor: <strong className="text-[#1d1d1f] font-medium">{item.instructorName || "Bhavin Patel"}</strong>
                        </p>
                      </div>
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-2">
                        <span className="text-xs text-[#86868b]">Course Fee</span>
                        <p className="text-xl font-extrabold text-[#1d1d1f]">
                          ₹{item.coursePricing || item.pricing}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Guarantee badge */}
            <div className="p-4 bg-white rounded-2xl border border-[#e5e5e5] flex items-center gap-3.5 text-xs text-[#6e6e73]">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-[#1d1d1f] block font-semibold">100% Risk-Free Learning</strong>
                <span>7-day money back guarantee with verifiable certification upon course completion.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card (Themed with Course Details) */}
          <div className="lg:sticky lg:top-28 space-y-4">
            <div className="bg-white rounded-2xl border border-[#e5e5e5] p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0071e3] via-[#00c7be] to-[#0071e3]" />
              
              <h2 className="text-lg font-bold text-[#1d1d1f] tracking-tight mb-5 flex items-center justify-between">
                <span>Order Summary</span>
                <Lock className="w-4 h-4 text-[#86868b]" />
              </h2>

              <div className="space-y-3.5 mb-6 text-sm">
                <div className="flex justify-between text-[#6e6e73]">
                  <span>Subtotal ({itemsToBuy.length} item{itemsToBuy.length > 1 ? "s" : ""})</span>
                  <span className="text-[#1d1d1f] font-medium">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-[#6e6e73]">
                  <span>Platform Fee & Tax</span>
                  <span className="text-emerald-600 font-medium">FREE (₹0)</span>
                </div>
                <div className="pt-4 border-t border-[#f0f0f0] flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-base text-[#1d1d1f] block">Total Amount</span>
                    <span className="text-[11px] text-[#86868b]">Includes all curriculum updates</span>
                  </div>
                  <span className="text-3xl font-black text-[#1d1d1f] tracking-tight">₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] active:scale-[0.98] text-white rounded-xl py-3.5 text-base font-semibold transition-all shadow-[0_4px_14px_rgba(0,113,227,0.35)] flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                {totalAmount === 0 ? (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Complete Free Enrollment</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay Securely — ₹{totalAmount}</span>
                  </>
                )}
              </button>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-[#86868b]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>256-Bit SSL Encrypted Checkout via Razorpay</span>
              </div>
            </div>

            {/* Quick Support Link */}
            <div className="text-center text-xs text-[#86868b]">
              Need help? <Link to="/contact" className="text-[#0071e3] hover:underline font-medium">Contact our team</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
    );
}

export default CheckoutPage;
