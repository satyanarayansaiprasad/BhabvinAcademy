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
                        color: "#09090b",
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
        <div className="bg-zinc-50 min-h-screen pt-20 xs:pt-24 md:pt-32 pb-16 xs:pb-20 relative">
            {isProcessing && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-6 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center"
                    >
                        <Loader2 className="w-12 h-12 text-zinc-900 animate-spin mb-4" />
                        <h2 className="text-2xl font-black tracking-tighter text-zinc-900 mb-2">Verifying your payment...</h2>
                        <p className="text-zinc-500 font-medium">Please do not close or refresh this page.</p>
                    </motion.div>
                </div>
            )}
            <div className="container mx-auto px-4 xs:px-5 lg:px-8 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8 md:gap-12"
                >
                    {/* Course List */}
                    <div className="lg:col-span-2 space-y-4 xs:space-y-8">
                        <h1 className="text-3xl xs:text-4xl font-black tracking-tighter text-zinc-900">Checkout.</h1>
                        <div className="space-y-3 xs:space-y-4">
                            {itemsToBuy.map((item, index) => (
                                <Card key={index} className="rounded-2xl xs:rounded-3xl border-zinc-200/60 overflow-hidden">
                                    <CardContent className="p-4 xs:p-6 flex flex-col xs:flex-row gap-4 xs:gap-6">
                                        <img
                                            src={item.courseImage || item.image}
                                            className="w-full xs:w-24 h-36 xs:h-24 rounded-xl xs:rounded-2xl object-cover shrink-0"
                                            alt={item.title}
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-zinc-900 text-base xs:text-lg mb-1">{item.title}</h3>
                                            <p className="text-xs xs:text-sm text-zinc-500 font-medium mb-2">By {item.instructorName}</p>
                                            <p className="text-lg xs:text-xl font-black text-zinc-900">₹{item.coursePricing || item.pricing}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-6">
                        <Card className="rounded-[32px] xs:rounded-[40px] border-zinc-200/60 shadow-xl overflow-hidden lg:sticky lg:top-32">
                            <CardContent className="p-6 xs:p-8">
                                <h2 className="text-lg xs:text-xl font-bold mb-4 xs:mb-6">Order Summary</h2>
                                <div className="space-y-3 xs:space-y-4 mb-6 xs:mb-8">
                                    <div className="flex justify-between text-zinc-500 font-medium text-sm xs:text-base">
                                        <span>Subtotal</span><span>₹{totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-500 font-medium text-sm xs:text-base">
                                        <span>Tax</span><span>₹0.00</span>
                                    </div>
                                    <div className="pt-3 xs:pt-4 border-t border-zinc-100 flex justify-between items-end">
                                        <span className="font-bold text-zinc-900">Total</span>
                                        <span className="text-2xl xs:text-3xl font-black text-zinc-900">₹{totalAmount}</span>
                                    </div>
                                </div>
                                <Button
                                    onClick={handlePayment}
                                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl xs:rounded-2xl h-12 xs:h-14 text-base xs:text-lg font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[44px]"
                                >
                                    {totalAmount === 0 ? (
                                        <>
                                            <ShieldCheck className="w-4 h-4 xs:w-5 xs:h-5" />
                                            <span>Free Enroll</span>
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4 xs:w-5 xs:h-5" />
                                            <span>Pay with Razorpay</span>
                                        </>
                                    )}
                                </Button>
                                <div className="mt-4 xs:mt-6 flex items-center justify-center gap-2 text-zinc-400 font-medium text-xs">
                                    <ShieldCheck className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-emerald-500" />
                                    Secure SSL Encrypted Payment
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default CheckoutPage;
