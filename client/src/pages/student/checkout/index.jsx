import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { captureAndFinalizePaymentService, createPaymentService } from "@/services";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, ChevronRight, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function CheckoutPage() {
    const { auth } = useContext(AuthContext);
    const { cartItems, setCartItems } = useContext(StudentContext);
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // If redirected from "Buy Now", we might have a single course in state
    const singleCourse = location.state?.course;
    const itemsToBuy = singleCourse ? [singleCourse] : cartItems;

    const totalAmount = itemsToBuy.reduce(
        (acc, item) => acc + parseFloat(item.coursePricing || item.pricing),
        0
    );

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    async function handlePayment() {
        const res = await loadRazorpayScript();

        if (!res) {
            toast({
                title: "Error",
                description: "Razorpay SDK failed to load. Are you online?",
                variant: "destructive",
            });
            return;
        }

        const orderPayload = {
            userId: auth?.user?._id,
            userName: auth?.user?.userName,
            userEmail: auth?.user?.userEmail,
            orderStatus: "pending",
            paymentMethod: "razorpay",
            paymentStatus: "initiated",
            orderDate: new Date(),
            courses: itemsToBuy.map((item) => ({
                courseId: item.courseId || item._id,
                title: item.title,
                instructorId: item.instructorId,
                instructorName: item.instructorName,
                courseImage: item.courseImage || item.image,
                coursePricing: item.coursePricing || item.pricing,
            })),
        };

        const response = await createPaymentService(orderPayload);

        if (response.success) {
            const options = {
                key: "rzp_test_placeholder", // This should come from backend or env in real world
                amount: response.data.amount,
                currency: response.data.currency,
                name: "Bhavin Academy",
                description: "Course Purchase",
                order_id: response.data.razorpayOrderId,
                handler: async function (razorpayResponse) {
                    const captureResponse = await captureAndFinalizePaymentService(
                        razorpayResponse.razorpay_order_id,
                        razorpayResponse.razorpay_payment_id,
                        razorpayResponse.razorpay_signature,
                        response.data.orderId
                    );

                    if (captureResponse.success) {
                        toast({
                            title: "Payment Successful",
                            description: "You have successfully enrolled in the course(s)!",
                        });
                        // Clear cart if it was a cart purchase
                        if (!singleCourse) {
                            // In a real app, you'd call a service to clear the cart in DB too
                            setCartItems([]);
                        }
                        navigate("/student-courses");
                    }
                },
                prefill: {
                    name: auth?.user?.userName,
                    email: auth?.user?.userEmail,
                },
                theme: {
                    color: "#000000",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } else {
            toast({
                title: "Error",
                description: "Failed to create order. Please try again.",
                variant: "destructive",
            });
        }
    }

    if (itemsToBuy.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <ShoppingBag className="w-16 h-16 text-zinc-300 mb-4" />
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Your checkout is empty</h2>
                <Button onClick={() => navigate("/courses")} className="rounded-full px-8">
                    Browse Courses
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-zinc-50 min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid lg:grid-cols-3 gap-12"
                >
                    <div className="lg:col-span-2 space-y-8">
                        <h1 className="text-4xl font-black tracking-tighter text-zinc-900">Checkout.</h1>

                        <div className="space-y-4">
                            {itemsToBuy.map((item, index) => (
                                <Card key={index} className="rounded-3xl border-zinc-200/60 overflow-hidden">
                                    <CardContent className="p-6 flex gap-6">
                                        <img
                                            src={item.courseImage || item.image}
                                            className="w-24 h-24 rounded-2xl object-cover shrink-0"
                                            alt={item.title}
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-zinc-900 text-lg mb-1">{item.title}</h3>
                                            <p className="text-sm text-zinc-500 font-medium mb-2">By {item.instructorName}</p>
                                            <p className="text-xl font-black text-zinc-900">₹{item.coursePricing || item.pricing}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="rounded-[40px] border-zinc-200/60 shadow-xl overflow-hidden sticky top-32">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-zinc-500 font-medium">
                                        <span>Subtotal</span>
                                        <span>₹{totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-500 font-medium">
                                        <span>Tax</span>
                                        <span>₹0.00</span>
                                    </div>
                                    <div className="pt-4 border-t border-zinc-100 flex justify-between items-end">
                                        <span className="font-bold text-zinc-900">Total</span>
                                        <span className="text-3xl font-black text-zinc-900">₹{totalAmount}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePayment}
                                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl h-14 text-lg font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Pay with Razorpay
                                </Button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-zinc-400 font-medium text-xs">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
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
