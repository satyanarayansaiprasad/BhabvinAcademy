import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Share2, ShieldCheck, Loader2, GraduationCap, CheckCircle, Star, BadgeCheck } from 'lucide-react';
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
            await new Promise(resolve => setTimeout(resolve, 800));

            const dataUrl = await toPng(certificateRef.current, {
                cacheBust: true,
                quality: 1,
                pixelRatio: 4,
                backgroundColor: '#ffffff',
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left'
                }
            });

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [certificateRef.current.offsetWidth * 2, certificateRef.current.offsetHeight * 2]
            });

            pdf.addImage(dataUrl, 'PNG', 0, 0, certificateRef.current.offsetWidth * 2, certificateRef.current.offsetHeight * 2);
            pdf.save(`BhavinAcademy_Platinum_Credential_${courseTitle.replace(/\s+/g, '_')}.pdf`);

            if (!silentDownload) {
                toast({
                    title: "Platinum Credential Exported",
                    description: "Your official achievement has been secured.",
                });
            }
            onDownloadComplete();
        } catch (error) {
            console.error('Download error:', error);
            if (!silentDownload) {
                toast({
                    title: "Generation Error",
                    description: "Could not finalize the secure document.",
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
        const text = encodeURIComponent(`I'm thrilled to share my official Platinum Certification in "${courseTitle}" from Bhavin Academy! 🎓✨`);
        const url = encodeURIComponent(window.location.origin);
        window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}%20${url}`, '_blank');
    };

    return (
        <motion.div
            initial={silentDownload ? {} : { opacity: 0, scale: 0.98 }}
            animate={silentDownload ? {} : { opacity: 1, scale: 1 }}
            className={`w-full max-w-7xl mx-auto shadow-2xl ${silentDownload ? 'absolute -top-[10000px] left-0 pointer-events-none' : ''}`}
        >
            <div ref={certificateRef} className="bg-white p-16 rounded-[80px] relative overflow-hidden">
                <Card className="relative overflow-hidden border-[40px] border-[#020617] rounded-[60px] bg-white">
                    {/* Platinum Grade Frame Components */}
                    <div className="absolute inset-0 border-[6px] border-amber-500/30 m-6 pointer-events-none" />
                    <div className="absolute inset-0 border-[2px] border-amber-400 m-12 pointer-events-none opacity-40" />
                    <div className="absolute inset-0 border-[1px] border-zinc-200 m-16 pointer-events-none opacity-20" />

                    {/* Atmospheric Lighting */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-100/20 to-transparent rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/20 to-transparent rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <CardContent className="relative z-10 p-24 md:p-36 text-center flex flex-col items-center min-h-[950px] justify-between">
                        {/* Majestic Watermark */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.045] pointer-events-none select-none">
                            <BadgeCheck className="w-[900px] h-[900px] text-zinc-900" />
                        </div>

                        {/* Top Section: Elite Branding */}
                        <div className="w-full flex flex-col items-center">
                            <div className="flex items-center gap-8 mb-16">
                                <div className="bg-[#020617] p-6 rounded-[32px] rotate-12 shadow-[0_25px_50px_rgba(0,0,0,0.35)] flex items-center justify-center">
                                    <GraduationCap className="w-20 h-20 text-amber-400" />
                                </div>
                                <div className="text-left border-l-4 border-amber-500 pl-8 ml-2">
                                    <h3 className="font-black text-6xl tracking-tighter text-[#020617] leading-none mb-3 uppercase font-serif">Bhavin Academy</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <p className="text-[14px] font-black uppercase tracking-[0.6em] text-zinc-400">Superior Academic Distinction</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center space-y-4 mb-10 w-full">
                                <h1 className="text-sm font-black tracking-[1.5em] text-zinc-300 uppercase pl-[1.5em]">
                                    Platinum Tier Executive Certification
                                </h1>
                                <div className="flex items-center gap-4 w-full">
                                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-zinc-100 to-transparent" />
                                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-zinc-100 to-transparent" />
                                </div>
                            </div>
                        </div>

                        {/* Middle Section: Recipient & Award */}
                        <div className="flex flex-col items-center max-w-6xl w-full">
                            <p className="text-zinc-400 font-serif text-3xl mb-16 italic tracking-wider font-light">
                                This official document confirms that the Board of Directors presents
                            </p>

                            <div className="relative mb-20 group">
                                <h2 className="text-7xl md:text-[10rem] font-black text-[#020617] tracking-tighter uppercase leading-none relative z-10 px-12">
                                    {userName}
                                </h2>
                                <div className="absolute -bottom-6 left-0 w-full h-12 bg-amber-200/40 -z-10 mix-blend-multiply blur-sm" />
                            </div>

                            <div className="space-y-12 w-full max-w-4xl">
                                <p className="text-zinc-500 font-serif text-3xl leading-relaxed italic font-light">
                                    with the highest distinction for mastery of professional competencies in
                                </p>
                                <div className="relative inline-block py-8 px-20">
                                    <div className="absolute inset-0 bg-[#020617] rounded-[30px] rotate-[-0.5deg] shadow-3xl" />
                                    <span className="text-white font-black text-5xl md:text-7xl tracking-tighter relative z-10 px-6 uppercase">
                                        {courseTitle}
                                    </span>
                                    {/* Holographic accent */}
                                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[30px]" />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Signatures & Validation */}
                        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-32 w-full mt-32 pt-20 border-t border-zinc-100">
                            <div className="flex flex-col items-center">
                                <div className="mb-10 relative h-24 w-full flex items-center justify-center">
                                    <p className="text-4xl font-black text-[#020617] font-serif italic border-b-2 border-zinc-200 px-10 pb-4 whitespace-nowrap tracking-wide">
                                        {instructorName}
                                    </p>
                                </div>
                                <p className="text-[13px] font-black text-zinc-400 uppercase tracking-[0.4em] text-center leading-relaxed">
                                    Executive Chairman<br />& Visionary Lead
                                </p>
                            </div>

                            <div className="relative group scale-110">
                                <div className="w-60 h-60 bg-gradient-to-b from-amber-200 via-amber-500 to-amber-700 rounded-full flex items-center justify-center p-2 shadow-[0_40px_80px_rgba(0,0,0,0.25)]">
                                    <div className="w-full h-full border-[6px] border-[#020617] border-double rounded-full flex items-center justify-center bg-white">
                                        <div className="flex flex-col items-center">
                                            <BadgeCheck className="w-24 h-24 text-amber-500 mb-1" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#020617]">Platinum Secured</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#020617] text-white text-[12px] font-black py-4 px-12 rounded-[24px] uppercase tracking-[0.5em] whitespace-nowrap shadow-4xl border-2 border-amber-500/30">
                                    Verified Official
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="mb-10 relative h-24 w-full flex items-center justify-center">
                                    <p className="text-4xl font-black text-[#020617] font-serif border-b-2 border-zinc-200 px-10 pb-4 whitespace-nowrap tracking-wide">
                                        {completionDate}
                                    </p>
                                </div>
                                <p className="text-[13px] font-black text-zinc-400 uppercase tracking-[0.4em]">Date of Accreditation</p>
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div className="mt-32 w-full border-t border-zinc-50 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-4 bg-zinc-50 px-10 py-5 rounded-[24px] border border-zinc-100 shadow-inner">
                                <ShieldCheck className="w-6 h-6 text-amber-500" />
                                <span className="text-zinc-500 font-bold text-[12px] uppercase tracking-[0.6em]">
                                    REGISTRY ID: {certificateId || "BA" + Math.random().toString(36).substr(2, 10).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex flex-col items-end gap-2 text-right">
                                <p className="text-zinc-300 font-black text-[11px] uppercase tracking-widest leading-none">Global Accreditation Council for Professional Excellence</p>
                                <p className="text-[9px] font-bold text-zinc-200 uppercase tracking-widest italic">Authenticity Guaranteed via Blockchain Ledger</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Premium Interactive Actions */}
            {!silentDownload && (
                <div className="mt-20 flex flex-col sm:flex-row justify-center gap-10 px-4 pb-24 no-print">
                    <Button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="bg-[#020617] hover:bg-black text-white rounded-[40px] h-24 px-20 text-2xl font-black flex items-center gap-6 shadow-6xl transition-all hover:scale-105 active:scale-95 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        {isGenerating ? <Loader2 className="w-8 h-8 animate-spin" /> : <Download className="w-8 h-8 group-hover:translate-y-2 transition-transform" />}
                        {isGenerating ? "Encrypting Document..." : "Download Official PDF"}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleShareLinkedIn}
                        className="border-[3px] border-zinc-100 hover:bg-zinc-50 rounded-[40px] h-24 px-20 text-xl font-black flex items-center gap-6 transition-all hover:border-[#020617] group shadow-2xl"
                    >
                        <Share2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        Share Achievement
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export default Certificate;
