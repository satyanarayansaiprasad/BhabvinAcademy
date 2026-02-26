import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Share2, ShieldCheck, Loader2, GraduationCap, Star, BadgeCheck } from 'lucide-react';
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

    // Precise A4 Landscape Ratio (1.414)
    const CAPTURE_WIDTH = 1600;
    const CAPTURE_HEIGHT = 1131;

    const handleDownload = async () => {
        if (certificateRef.current === null) return;

        try {
            setIsGenerating(true);

            // Critical wait for external fonts (Inter, Serif) and SVG icons to settle
            await new Promise(resolve => setTimeout(resolve, 3000));

            const options = {
                cacheBust: true,
                quality: 1,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
                width: CAPTURE_WIDTH,
                height: CAPTURE_HEIGHT,
                style: {
                    width: `${CAPTURE_WIDTH}px`,
                    height: `${CAPTURE_HEIGHT}px`,
                    transform: 'none',
                    margin: '0',
                    padding: '0',
                }
            };

            const dataUrl = await toPng(certificateRef.current, options);

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [CAPTURE_WIDTH, CAPTURE_HEIGHT]
            });

            pdf.addImage(dataUrl, 'PNG', 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT);
            const fileName = `Bhavin_Academy_Credential_${userName.replace(/\s+/g, '_')}.pdf`;
            pdf.save(fileName);

            if (!silentDownload) {
                toast({
                    title: "Credential Exported",
                    description: "Your official platinum certificate has been preserved.",
                });
            }
            onDownloadComplete();
        } catch (error) {
            console.error('Render Error:', error);
            if (!silentDownload) {
                toast({
                    title: "Export Error",
                    description: "The secure thermal printer encountered an error.",
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
        const text = encodeURIComponent(`Verified! I've been officially certified in "${courseTitle}" from Bhavin Academy. 🚀🏆`);
        const url = encodeURIComponent(window.location.origin);
        window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}%20${url}`, '_blank');
    };

    return (
        <motion.div
            initial={silentDownload ? {} : { opacity: 0, scale: 0.98 }}
            animate={silentDownload ? {} : { opacity: 1, scale: 1 }}
            className={`w-full mx-auto ${silentDownload ? 'fixed inset-0 opacity-0 pointer-events-none -z-50 overflow-hidden' : 'max-w-7xl'}`}
        >
            {/* The Capture Wrapper: Fixed dimensions ensure no cropping regardless of screen resolution */}
            <div
                ref={certificateRef}
                className="bg-white p-16 flex items-center justify-center"
                style={{ width: `${CAPTURE_WIDTH}px`, height: `${CAPTURE_HEIGHT}px` }}
            >
                <Card className="w-full h-full relative overflow-hidden border-[40px] border-[#020617] rounded-[40px] bg-white flex flex-col">
                    {/* Inner Platinum Borders */}
                    <div className="absolute inset-x-8 inset-y-8 border-[6px] border-amber-500/20 pointer-events-none" />
                    <div className="absolute inset-x-12 inset-y-12 border-[2px] border-zinc-100 pointer-events-none opacity-30" />

                    {/* Lighting & Aesthetic Glows */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-50/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <CardContent className="relative z-10 w-full h-full p-20 text-center flex flex-col items-center justify-between">
                        {/* Majestic Watermark */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
                            <BadgeCheck className="w-[700px] h-[700px] text-zinc-900" />
                        </div>

                        {/* Branding Header */}
                        <div className="w-full flex flex-col items-center">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="bg-[#020617] p-5 rounded-[24px] shadow-2xl">
                                    <GraduationCap className="w-16 h-16 text-amber-500" />
                                </div>
                                <div className="text-left border-l-4 border-amber-500 pl-6">
                                    <h3 className="font-bold text-5xl tracking-tighter text-[#020617] leading-none mb-1 uppercase font-serif">Bhavin Academy</h3>
                                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400">Superior Academic Certification</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center space-y-3 mb-4 w-full">
                                <h1 className="text-xs font-black tracking-[1.5em] text-zinc-300 uppercase pl-[1.5em]">
                                    Official Board Verified Credential
                                </h1>
                                <div className="h-[1px] w-full max-w-2xl bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
                            </div>
                        </div>

                        {/* Recipient Details: Carefully spaced to prevent overflow */}
                        <div className="flex flex-col items-center max-w-5xl w-full px-12">
                            <p className="text-zinc-400 font-serif text-2xl mb-12 italic tracking-wide">
                                This secure document verifies that the Board hereby honors
                            </p>

                            <div className="relative mb-14 px-10">
                                <h2 className="text-7xl font-black text-[#020617] tracking-tighter uppercase leading-[1.1] relative z-10 max-w-4xl">
                                    {userName}
                                </h2>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-6 bg-amber-100/60 -z-10 mix-blend-multiply rounded-full blur-sm" />
                            </div>

                            <div className="space-y-10 w-full">
                                <p className="text-zinc-500 font-serif text-2xl leading-relaxed italic">
                                    for successfully demonstrating comprehensive professional mastery in
                                </p>
                                <div className="relative inline-block py-6 px-16 max-w-4xl">
                                    <div className="absolute inset-0 bg-[#020617] rounded-[24px] rotate-[-0.5deg] shadow-3xl" />
                                    <span className="text-white font-black text-3xl md:text-4xl tracking-tight relative z-10 uppercase block leading-[1.3]">
                                        {courseTitle}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Signatures & Accreditation */}
                        <div className="w-full flex flex-col items-center">
                            <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-20 w-full pt-12 border-t border-zinc-100 px-10 mb-10">
                                <div className="flex flex-col items-center">
                                    <p className="text-2xl font-black text-[#020617] font-serif italic border-b border-zinc-200 px-10 pb-3 mb-3 whitespace-nowrap">
                                        {instructorName}
                                    </p>
                                    <p className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.4em] text-center">
                                        Executive Provost
                                    </p>
                                </div>

                                <div className="relative transform scale-110 mb-6">
                                    <div className="w-40 h-40 bg-gradient-to-b from-amber-300 via-white to-amber-600 rounded-full flex items-center justify-center p-1.5 shadow-5xl">
                                        <div className="w-full h-full border-[3px] border-[#020617] border-double rounded-full flex items-center justify-center bg-white">
                                            <BadgeCheck className="w-16 h-16 text-amber-500" />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#020617] text-white text-[10px] font-black py-2.5 px-8 rounded-full uppercase tracking-[0.4em] whitespace-nowrap shadow-xl">
                                        Verified Achievement
                                    </div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <p className="text-2xl font-black text-[#020617] font-serif border-b border-zinc-200 px-10 pb-3 mb-3">
                                        {completionDate}
                                    </p>
                                    <p className="text-[12px] font-black text-zinc-400 uppercase tracking-[0.4em]">Date of Accreditation</p>
                                </div>
                            </div>

                            {/* Secure Registry ID */}
                            <div className="flex items-center gap-3 bg-zinc-50 px-8 py-3 rounded-full border border-zinc-100 mb-6">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.5em] whitespace-nowrap">
                                    REGISTRY ID: {certificateId || "BA" + Math.random().toString(36).substr(2, 10).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* In-Browser Controls (Not visible during silentDownload) */}
            {!silentDownload && (
                <div className="mt-20 flex flex-col sm:flex-row justify-center gap-8 px-4 pb-24 no-print">
                    <Button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="bg-[#020617] hover:bg-black text-white rounded-[32px] h-20 px-16 text-xl font-black flex items-center gap-6 shadow-5xl transition-all hover:scale-105 active:scale-95 group"
                    >
                        {isGenerating ? <Loader2 className="w-7 h-7 animate-spin" /> : <Download className="w-7 h-7 group-hover:translate-y-2 transition-transform" />}
                        {isGenerating ? "Processing..." : "Export High-Resolution PDF"}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleShareLinkedIn}
                        className="border-[3px] border-zinc-100 hover:bg-zinc-50 rounded-[32px] h-20 px-16 text-xl font-black flex items-center gap-6 transition-all hover:border-[#020617] shadow-xl"
                    >
                        <Share2 className="w-7 h-7" />
                        Share Distinction
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export default Certificate;
