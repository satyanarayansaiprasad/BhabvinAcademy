import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Share2, ShieldCheck, Loader2, GraduationCap } from 'lucide-react';
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

            const dataUrl = await toPng(certificateRef.current, {
                cacheBust: true,
                quality: 1,
                pixelRatio: 3
            });

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [certificateRef.current.offsetWidth * 2, certificateRef.current.offsetHeight * 2]
            });

            pdf.addImage(dataUrl, 'PNG', 0, 0, certificateRef.current.offsetWidth * 2, certificateRef.current.offsetHeight * 2);
            pdf.save(`Certificate_${courseTitle.replace(/\s+/g, '_')}.pdf`);

            toast({
                title: "Success",
                description: "Your official premium certificate has been generated.",
            });
        } catch (error) {
            console.error('Download error:', error);
            toast({
                title: "Error",
                description: "Failed to generate PDF.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShareLinkedIn = () => {
        const text = encodeURIComponent(`Excited to announce that I've completed "${courseTitle}" on Bhavin Academy! 🎓🚀`);
        const url = encodeURIComponent(window.location.origin);
        window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}%20${url}`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl mx-auto"
        >
            <div ref={certificateRef} className="bg-white p-6 md:p-12 rounded-[50px]">
                <Card className="relative overflow-hidden border-[20px] border-zinc-900 shadow-3xl rounded-[40px] bg-white">
                    {/* Double Golden Frame */}
                    <div className="absolute inset-0 border-[2px] border-amber-400/40 m-3 pointer-events-none" />
                    <div className="absolute inset-0 border-[1px] border-amber-500 m-6 pointer-events-none" />

                    <CardContent className="relative z-10 p-16 md:p-24 text-center flex flex-col items-center min-h-[750px] justify-between">
                        {/* Elegant Watermark */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
                            <GraduationCap className="w-[800px] h-[800px] text-zinc-900" />
                        </div>

                        {/* Top Branding Section */}
                        <div className="w-full flex flex-col items-center">
                            <div className="flex items-center gap-4 mb-10 translate-y-[-20px]">
                                <div className="bg-zinc-900 p-4 rounded-[24px] rotate-6 shadow-2xl">
                                    <GraduationCap className="w-12 h-12 text-amber-400" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-black text-4xl tracking-tighter text-zinc-900 leading-none">Bhavin Academy.</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 mt-2">Center of Excellence</p>
                                </div>
                            </div>

                            <h1 className="text-sm font-black tracking-[0.8em] text-zinc-400 uppercase mb-4 pl-[0.8em]">
                                Digital Credential of Achievement
                            </h1>
                            <div className="h-[1px] w-96 bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
                        </div>

                        {/* Middle Text Section */}
                        <div className="flex flex-col items-center max-w-4xl">
                            <p className="text-zinc-400 font-serif text-2xl mb-12 italic">
                                This is to officially certify that
                            </p>

                            <h2 className="text-5xl md:text-8xl font-black text-zinc-900 mb-12 tracking-tighter uppercase leading-tight">
                                {userName}
                            </h2>

                            <div className="space-y-6">
                                <p className="text-zinc-500 font-medium text-xl leading-relaxed">
                                    has demonstrated exceptional mastery and successfully completed the professional curriculum of
                                </p>
                                <div className="inline-block relative">
                                    <span className="text-zinc-900 font-black text-3xl md:text-5xl tracking-tight relative z-10 px-4">
                                        {courseTitle}
                                    </span>
                                    <div className="absolute bottom-1 left-0 w-full h-4 bg-amber-100 -z-10" />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Signatures & Seal Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-16 w-full mt-16 pt-12 border-t border-zinc-50">
                            <div className="flex flex-col items-center">
                                <p className="text-2xl font-black text-zinc-900 mb-4 font-serif italic border-b-2 border-zinc-100 px-6 pb-2">
                                    {instructorName}
                                </p>
                                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest text-center leading-relaxed">
                                    Head of Academic Affairs<br />& Lead Instructor
                                </p>
                            </div>

                            <div className="relative">
                                {/* Intricate Golden Seal */}
                                <div className="w-44 h-44 bg-gradient-to-b from-amber-300 via-amber-200 to-amber-600 rounded-full flex items-center justify-center p-1 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                                    <div className="w-full h-full border-[3px] border-white/60 border-dashed rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm">
                                        <Award className="w-16 h-16 text-zinc-900" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-amber-400 text-[10px] font-black py-2 px-6 rounded-2xl uppercase tracking-[0.2em] whitespace-nowrap shadow-2xl border border-white/10">
                                    Verified Achievement
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-2xl font-black text-zinc-900 mb-4 font-serif border-b-2 border-zinc-100 px-6 pb-2">
                                    {completionDate}
                                </p>
                                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Date Issued</p>
                            </div>
                        </div>

                        {/* Credential ID Footer */}
                        <div className="mt-24 pt-8 w-full">
                            <div className="flex items-center justify-center gap-3 text-zinc-300 font-bold text-[10px] uppercase tracking-[0.4em]">
                                <ShieldCheck className="w-4 h-4 text-amber-500" />
                                Credential ID: {certificateId || "BA" + Math.random().toString(36).substr(2, 9).toUpperCase()}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 px-4 pb-12 no-print">
                <Button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="bg-zinc-900 hover:bg-black text-white rounded-[40px] h-20 px-14 text-xl font-black flex items-center gap-4 shadow-3xl transition-all hover:scale-105 group"
                >
                    {isGenerating ? <Loader2 className="w-7 h-7 animate-spin" /> : <Download className="w-7 h-7 group-hover:translate-y-1 transition-transform" />}
                    {isGenerating ? "Preparing High-Def PDF..." : "Download Certificate (PDF)"}
                </Button>

                <Button
                    variant="outline"
                    onClick={handleShareLinkedIn}
                    className="border-2 border-zinc-200 hover:bg-zinc-50 rounded-[40px] h-20 px-14 text-lg font-black flex items-center gap-4 transition-all hover:border-zinc-900 group shadow-xl"
                >
                    <Share2 className="w-7 h-7 group-hover:scale-110 transition-transform" />
                    Share Achievement
                </Button>
            </div>
        </motion.div>
    );
};

export default Certificate;
