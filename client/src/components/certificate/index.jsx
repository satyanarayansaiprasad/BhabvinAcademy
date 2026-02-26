import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, ShieldCheck, Loader2, GraduationCap, BadgeCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useToast } from '@/hooks/use-toast';

const Certificate = ({
    userName,
    courseTitle,
    completionDate,
    instructorName,
    certificateId,
    silentDownload = false,
    onDownloadComplete = () => { }
}) => {
    const certificateRef = useRef(null);
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);

    // Exact A4 Landscape Dimensions at 144 DPI (for high-fidelity print)
    const CAPTURE_WIDTH = 1684; // 297mm * 5.67
    const CAPTURE_HEIGHT = 1191; // 210mm * 5.67

    const handleDownload = async () => {
        if (!certificateRef.current) return;

        try {
            setIsGenerating(true);

            // Allow all heavy assets to stabilize
            await new Promise(resolve => setTimeout(resolve, 3000));

            const options = {
                cacheBust: true,
                quality: 1,
                pixelRatio: 1, // We already use high base resolution
                backgroundColor: '#ffffff',
                width: CAPTURE_WIDTH,
                height: CAPTURE_HEIGHT,
                style: {
                    width: `${CAPTURE_WIDTH}px`,
                    height: `${CAPTURE_HEIGHT}px`,
                    margin: '0',
                    padding: '0',
                    transform: 'none',
                    display: 'flex',
                    visibility: 'visible'
                }
            };

            const dataUrl = await toPng(certificateRef.current, options);

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [CAPTURE_WIDTH, CAPTURE_HEIGHT]
            });

            pdf.addImage(dataUrl, 'PNG', 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT);
            const fileName = `Bhavin_Academy_A4_Credential_${userName.replace(/\s+/g, '_')}.pdf`;
            pdf.save(fileName);

            if (!silentDownload) {
                toast({
                    title: "Status: Validated",
                    description: "Your official A4-standard diploma has been exported.",
                });
            }
            onDownloadComplete();
        } catch (error) {
            console.error('Certification Error:', error);
            if (!silentDownload) {
                toast({
                    title: "Rendering Error",
                    description: "The certification engine encountered a layout conflict.",
                    variant: "destructive"
                });
            }
            onDownloadComplete(error);
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (silentDownload) {
            handleDownload();
        }
    }, [silentDownload]);

    const handleShareLinkedIn = () => {
        const text = encodeURIComponent(`I am proud to share my Professional Certification in "${courseTitle}" from Bhavin Academy! 🏆🎓`);
        const url = encodeURIComponent(window.location.origin);
        window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}%20${url}`, '_blank');
    };

    const content = (
        <div
            ref={certificateRef}
            className="bg-white flex items-center justify-center relative shadow-2xl"
            style={{ width: `${CAPTURE_WIDTH}px`, height: `${CAPTURE_HEIGHT}px`, minWidth: `${CAPTURE_WIDTH}px`, minHeight: `${CAPTURE_HEIGHT}px` }}
        >
            <Card className="w-[1600px] h-[1100px] relative overflow-hidden border-[40px] border-[#020617] rounded-[20px] bg-white flex flex-col p-1">
                {/* Platinum Design Framework */}
                <div className="absolute inset-x-6 inset-y-6 border-[8px] border-amber-500/20 pointer-events-none" />

                {/* Visual Hierarchy Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-50/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-50/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                <CardContent className="h-full w-full p-20 flex flex-col items-center justify-between text-center relative z-10">

                    {/* 1. Header Brading Section */}
                    <div className="w-full">
                        <div className="flex items-center justify-center gap-6 mb-10">
                            <div className="bg-[#020617] p-5 rounded-[24px] rotate-3 shadow-2xl">
                                <GraduationCap className="w-16 h-16 text-amber-500" />
                            </div>
                            <div className="text-left border-l-4 border-amber-500 pl-6">
                                <h3 className="font-black text-5xl tracking-tighter text-[#020617] leading-none mb-1 uppercase font-serif">Bhavin Academy</h3>
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400">Superior Academic Leadership</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center space-y-3 mb-10">
                            <h1 className="text-xs font-black tracking-[1.5em] text-zinc-300 uppercase pl-[1.5em]">
                                Certified Professional Diploma
                            </h1>
                            <div className="h-[1px] w-1/2 bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
                        </div>
                    </div>

                    {/* 2. Recipient Section (Compressed to fit) */}
                    <div className="w-full flex-1 flex flex-col justify-center items-center py-4">
                        <p className="text-zinc-400 font-serif text-2xl italic tracking-wide mb-10">
                            This authentic credential confirms that the Board presents to
                        </p>

                        <div className="relative mb-12">
                            <h2 className="text-8xl font-black text-[#020617] tracking-tighter uppercase leading-[1.1] z-10 relative">
                                {userName}
                            </h2>
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[90%] h-5 bg-amber-100/60 -z-10 blur-sm rounded-full" />
                        </div>

                        <p className="text-zinc-500 font-serif text-2xl italic mb-10">
                            for demonstrating expert mastery and excellence in
                        </p>

                        <div className="relative inline-block py-6 px-16 group">
                            <div className="absolute inset-0 bg-[#020617] rounded-[24px] rotate-[-0.5deg] shadow-3xl" />
                            <span className="text-white font-black text-[40px] tracking-tight relative z-10 uppercase leading-tight max-w-4xl block">
                                {courseTitle}
                            </span>
                        </div>
                    </div>

                    {/* 3. Validation & Identification (Safe Bottom Margin) */}
                    <div className="w-full pt-10 mt-auto">
                        <div className="grid grid-cols-3 items-end gap-16 border-t border-zinc-100 pt-10 mb-10 px-10">
                            <div className="flex flex-col items-center">
                                <p className="text-2xl font-black text-[#020617] font-serif italic border-b border-zinc-200 px-10 pb-2 mb-3">
                                    {instructorName}
                                </p>
                                <p className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.4em]">Chief Visionary Lead</p>
                            </div>

                            <div className="relative mb-4 flex justify-center">
                                <div className="w-44 h-44 bg-gradient-to-b from-amber-200 via-white to-amber-600 rounded-full flex items-center justify-center p-1.5 shadow-6xl scale-90">
                                    <div className="w-full h-full border-[3px] border-[#020617] border-double rounded-full flex items-center justify-center bg-white">
                                        <BadgeCheck className="w-16 h-16 text-amber-500" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 bg-[#020617] text-white text-[10px] font-black py-2.5 px-8 rounded-full uppercase tracking-[0.4em] shadow-xl border border-amber-500/20">
                                    Verified Achievement
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-2xl font-black text-[#020617] font-serif border-b border-zinc-200 px-10 pb-2 mb-3">
                                    {completionDate}
                                </p>
                                <p className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.4em]">Date of Issuance</p>
                            </div>
                        </div>

                        <div className="bg-zinc-50 py-3 px-8 rounded-full border border-zinc-100 inline-flex items-center gap-3">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.6em]">
                                REGISTRY ID: {certificateId || "BA" + Math.random().toString(36).substr(2, 10).toUpperCase()}
                            </span>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );

    if (silentDownload) {
        return (
            <div className="fixed left-[-9999px] top-0 overflow-hidden">
                {content}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-6xl mx-auto my-12"
        >
            {content}

            {/* In-Browser Controls */}
            <div className="mt-16 flex flex-col sm:flex-row justify-center gap-8 px-4 pb-24">
                <Button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="bg-[#020617] hover:bg-black text-white rounded-[40px] h-24 px-20 text-2xl font-black flex items-center gap-6 shadow-6xl transition-all hover:scale-105"
                >
                    {isGenerating ? <Loader2 className="w-8 h-8 animate-spin" /> : <Download className="w-8 h-8" />}
                    {isGenerating ? "Exporting..." : "Download Official A4 PDF"}
                </Button>

                <Button
                    variant="outline"
                    onClick={handleShareLinkedIn}
                    className="border-[3px] border-zinc-100 hover:bg-zinc-50 rounded-[40px] h-24 px-20 text-xl font-black flex items-center gap-6 transition-all"
                >
                    <Share2 className="w-8 h-8" />
                    Share Achievement
                </Button>
            </div>
        </motion.div>
    );
};

export default Certificate;
