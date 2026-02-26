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

    const handleDownload = async () => {
        if (certificateRef.current === null) return;

        try {
            setIsGenerating(true);

            // Allow fonts and icons to settle
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Force a fixed width for capture to ensure landscape aspect ratio
            const captureWidth = 1400;
            const captureHeight = 1000;

            const dataUrl = await toPng(certificateRef.current, {
                cacheBust: true,
                quality: 1,
                pixelRatio: 3,
                backgroundColor: '#ffffff',
                width: captureWidth,
                height: captureHeight,
                style: {
                    width: `${captureWidth}px`,
                    height: `${captureHeight}px`,
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                    margin: '0',
                    padding: '0'
                }
            });

            // Standard A4 landscape is ~842x595 pixels at 72dpi. 
            // We use the capture dimensions for the PDF to maintain aspect ratio exactly.
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [captureWidth, captureHeight]
            });

            pdf.addImage(dataUrl, 'PNG', 0, 0, captureWidth, captureHeight);
            pdf.save(`BhavinAcademy_Premium_Certification_${courseTitle.replace(/\s+/g, '_')}.pdf`);

            if (!silentDownload) {
                toast({
                    title: "Credential Exported",
                    description: "Your official platinum certificate has been saved.",
                });
            }
            onDownloadComplete();
        } catch (error) {
            console.error('Download error:', error);
            if (!silentDownload) {
                toast({
                    title: "Export Failed",
                    description: "Could not generate the secure document.",
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
        const text = encodeURIComponent(`I'm honored to share my official Certification in "${courseTitle}" from Bhavin Academy! 🎓✨`);
        const url = encodeURIComponent(window.location.origin);
        window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}%20${url}`, '_blank');
    };

    return (
        <motion.div
            initial={silentDownload ? {} : { opacity: 0, scale: 0.98 }}
            animate={silentDownload ? {} : { opacity: 1, scale: 1 }}
            className={`w-full max-w-7xl mx-auto shadow-2xl ${silentDownload ? 'fixed -left-[5000px] top-0 pointer-events-none' : ''}`}
        >
            <div
                ref={certificateRef}
                className="bg-white p-12 md:p-16 rounded-[60px] relative overflow-hidden flex items-center justify-center min-w-[1200px]"
                style={silentDownload ? { width: '1400px', height: '1000px' } : {}}
            >
                <Card className="w-full h-full relative overflow-hidden border-[36px] border-[#020617] rounded-[50px] bg-white flex flex-col items-center justify-center">
                    {/* Platinum Grade Borders */}
                    <div className="absolute inset-0 border-[6px] border-amber-500/20 m-4 pointer-events-none" />
                    <div className="absolute inset-0 border-[2px] border-amber-400/30 m-8 pointer-events-none" />
                    <div className="absolute inset-0 border-[1px] border-zinc-100 m-12 pointer-events-none opacity-20" />

                    {/* Atmospheric Glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-50 to-transparent rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50 to-transparent rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <CardContent className="relative z-10 w-full p-20 text-center flex flex-col items-center min-h-[850px] justify-between">
                        {/* Majestic Watermark */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
                            <BadgeCheck className="w-[800px] h-[800px] text-zinc-900" />
                        </div>

                        {/* Top Branding */}
                        <div className="w-full flex flex-col items-center">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="bg-[#020617] p-5 rounded-[28px] rotate-6 shadow-2xl">
                                    <GraduationCap className="w-14 h-14 text-amber-400" />
                                </div>
                                <div className="text-left border-l-4 border-amber-500 pl-6 ml-2">
                                    <h3 className="font-black text-4xl tracking-tighter text-[#020617] leading-none mb-2 uppercase">Bhavin Academy</h3>
                                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400">Superior Academic Distinction</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center space-y-3 mb-8 w-full">
                                <h1 className="text-xs font-black tracking-[1.2em] text-zinc-300 uppercase pl-[1.2em]">
                                    Professional Verified Certification
                                </h1>
                                <div className="h-[1px] w-full max-w-2xl bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
                            </div>
                        </div>

                        {/* Recipient Content */}
                        <div className="flex flex-col items-center max-w-5xl w-full">
                            <p className="text-zinc-400 font-serif text-2xl mb-12 italic tracking-wide">
                                This official document confirms that the Board presents
                            </p>

                            <div className="relative mb-14">
                                <h2 className="text-6xl md:text-8xl font-black text-[#020617] tracking-tighter uppercase leading-none relative z-10 px-8">
                                    {userName}
                                </h2>
                                <div className="absolute -bottom-3 left-0 w-full h-8 bg-amber-100/60 -z-10 mix-blend-multiply" />
                            </div>

                            <div className="space-y-10 w-full max-w-4xl">
                                <p className="text-zinc-500 font-serif text-2xl leading-relaxed italic">
                                    for successfully demonstrating comprehensive mastery in the professional domain of
                                </p>
                                <div className="relative inline-block py-6 px-16">
                                    <div className="absolute inset-0 bg-[#020617] rounded-[24px] rotate-[-0.5deg]" />
                                    <span className="text-white font-black text-4xl md:text-5xl tracking-tight relative z-10 uppercase">
                                        {courseTitle}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Credential Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-20 w-full mt-20 pt-16 border-t border-zinc-100">
                            <div className="flex flex-col items-center">
                                <p className="text-2xl font-black text-[#020617] font-serif italic border-b border-zinc-200 px-6 pb-2 whitespace-nowrap mb-4">
                                    {instructorName}
                                </p>
                                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] text-center">
                                    Executive Chairman
                                </p>
                            </div>

                            <div className="relative group">
                                <div className="w-48 h-48 bg-gradient-to-b from-amber-300 via-white to-amber-600 rounded-full flex items-center justify-center p-1.5 shadow-3xl">
                                    <div className="w-full h-full border-[4px] border-[#020617] border-double rounded-full flex items-center justify-center bg-white">
                                        <BadgeCheck className="w-20 h-20 text-amber-500" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#020617] text-white text-[10px] font-black py-2.5 px-8 rounded-full uppercase tracking-[0.4em] whitespace-nowrap shadow-xl">
                                    Verified Official
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-2xl font-black text-[#020617] font-serif border-b border-zinc-200 px-6 pb-2 mb-4">
                                    {completionDate}
                                </p>
                                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em]">Date of Accreditation</p>
                            </div>
                        </div>

                        {/* Identification ID */}
                        <div className="mt-20 w-full pt-8 flex items-center justify-center">
                            <div className="flex items-center gap-3 bg-zinc-50 px-8 py-3 rounded-full border border-zinc-100">
                                <ShieldCheck className="w-4 h-4 text-amber-500" />
                                <span className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.5em]">
                                    REGISTRY ID: {certificateId || "BA" + Math.random().toString(36).substr(2, 9).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Actions for On-Screen View */}
            {!silentDownload && (
                <div className="mt-16 flex flex-col sm:flex-row justify-center gap-8 px-4 pb-16 no-print">
                    <Button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="bg-[#020617] hover:bg-black text-white rounded-[40px] h-20 px-16 text-xl font-black flex items-center gap-6 shadow-4xl transition-all hover:scale-105 group"
                    >
                        {isGenerating ? <Loader2 className="w-7 h-7 animate-spin" /> : <Download className="w-7 h-7 group-hover:translate-y-2 transition-transform" />}
                        {isGenerating ? "Exporting High-Def..." : "Download Official PDF"}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleShareLinkedIn}
                        className="border-[3px] border-zinc-100 hover:bg-zinc-50 rounded-[40px] h-20 px-16 text-xl font-black flex items-center gap-6 transition-all hover:border-[#020617] group shadow-xl"
                    >
                        <Share2 className="w-7 h-7 group-hover:scale-110 transition-transform" />
                        Share Achievement
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export default Certificate;
