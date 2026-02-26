import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, Download, Share2, ShieldCheck, User, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useToast } from '@/hooks/use-toast';

const Certificate = ({ userName, courseTitle, completionDate, instructorName, certificateId }) => {
    const certificateRef = useRef(null);
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (certificateRef.current === null) return;

        try {
            setIsGenerating(true);

            // Generate Image
            const dataUrl = await toPng(certificateRef.current, {
                cacheBust: true,
                quality: 1,
                pixelRatio: 2 // High quality
            });

            // Create PDF
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [certificateRef.current.offsetWidth * 2, certificateRef.current.offsetHeight * 2]
            });

            pdf.addImage(dataUrl, 'PNG', 0, 0, certificateRef.current.offsetWidth * 2, certificateRef.current.offsetHeight * 2);
            pdf.save(`Certificate-${courseTitle.replace(/\s+/g, '-')}.pdf`);

            toast({
                title: "Certificate Downloaded",
                description: "Your official certificate has been generated and downloaded.",
            });
        } catch (error) {
            console.error('Error generating certificate:', error);
            toast({
                title: "Download Failed",
                description: "Something went wrong while generating your certificate.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShareLinkedIn = () => {
        const text = encodeURIComponent(`I am proud to share that I have successfully completed the course "${courseTitle}" on Bhavin Academy! 🎓✨`);
        const url = encodeURIComponent(window.location.origin);
        window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}%20${url}`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl mx-auto"
        >
            <div ref={certificateRef}>
                <Card className="relative overflow-hidden border-none shadow-2xl rounded-[40px] bg-white p-1">
                    {/* ... (rest of the card content remains the same) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-amber-200 to-amber-500 rounded-[40px] p-1">
                        <div className="w-full h-full bg-white rounded-[38px] relative overflow-hidden">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                            {/* Certificate Content */}
                            <CardContent className="relative z-10 p-12 md:p-20 text-center flex flex-col items-center">
                                {/* Header */}
                                <div className="mb-12">
                                    <Award className="w-20 h-20 text-amber-500 mx-auto mb-6" />
                                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 uppercase">
                                        Certificate of Achievement
                                    </h1>
                                    <div className="h-1 w-32 bg-amber-400 mx-auto mt-4 rounded-full" />
                                </div>
                                <p className="text-zinc-500 font-medium text-lg mb-8 italic">
                                    This is to certify that
                                </p>
                                <h2 className="text-4xl md:text-6xl font-black text-zinc-900 mb-8 tracking-tight decoration-amber-400 underline underline-offset-8">
                                    {userName}
                                </h2>
                                <p className="text-zinc-500 font-medium text-lg max-w-2xl leading-relaxed mb-12">
                                    has successfully completed the professional development course
                                    <br />
                                    <span className="text-zinc-900 font-extrabold text-2xl not-italic mt-4 block">
                                        "{courseTitle}"
                                    </span>
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 w-full max-w-2xl border-t border-zinc-100 pt-12">
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-zinc-900 mb-1">{instructorName}</p>
                                        <div className="h-0.5 w-24 bg-zinc-200 mx-auto mb-2" />
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Master Instructor</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-black text-zinc-900 mb-1">{completionDate}</p>
                                        <div className="h-0.5 w-24 bg-zinc-200 mx-auto mb-2" />
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date of Completion</p>
                                    </div>
                                </div>
                                {/* Footer / Verification */}
                                <div className="mt-16 flex flex-col items-center">
                                    <div className="flex items-center gap-2 text-zinc-400 font-bold text-[10px] uppercase tracking-widest mb-4">
                                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                                        Verified Certificate ID: {certificateId || "BA-" + Math.random().toString(36).substr(2, 9).toUpperCase()}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-zinc-900 p-2 rounded-lg">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="font-extrabold text-xl tracking-tighter text-zinc-900">Bhavin Academy</span>
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Actions */}
            <div className="mt-10 flex justify-center gap-4">
                <Button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="bg-zinc-900 hover:bg-black text-white rounded-2xl h-14 px-8 font-bold flex items-center gap-2 shadow-xl transition-all hover:scale-105"
                >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    {isGenerating ? "Generating..." : "Download PDF"}
                </Button>
                <Button
                    variant="outline"
                    onClick={handleShareLinkedIn}
                    className="border-2 border-zinc-200 hover:bg-zinc-50 rounded-2xl h-14 px-8 font-bold flex items-center gap-2 transition-all hover:border-zinc-900"
                >
                    <Share2 className="w-5 h-5" /> Share on LinkedIn
                </Button>
            </div>
        </motion.div>
    );
};

export default Certificate;
