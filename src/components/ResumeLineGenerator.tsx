// src/components/ResumeLineGenerator.tsx - Unique Feature: Resume Line Generator
// "Add this 4th line in your resume" - No platform has this!
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Copy, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface ResumeLineGeneratorProps {
  achievements: any[];
  username?: string;
}

export default function ResumeLineGenerator({ achievements, username }: ResumeLineGeneratorProps) {
  const { toast } = useToast();
  const [selectedFormat, setSelectedFormat] = useState<'resume' | 'linkedin' | 'cover'>('resume');
  const [copied, setCopied] = useState(false);

  const formats = [
    { id: 'resume' as const, label: 'Resume', icon: FileText },
    { id: 'linkedin' as const, label: 'LinkedIn', icon: Sparkles },
    { id: 'cover' as const, label: 'Cover Letter', icon: FileText },
  ];

  const generateResumeLine = () => {
    if (achievements.length === 0) {
      return "Earned verified achievements on AURIN - showcasing professional growth and continuous learning.";
    }

    const badgeCount = achievements.length;
    const categories = [...new Set(achievements.map((a: any) => a.badge?.category).filter(Boolean))];
    const categoryText = categories.length > 0 ? categories.join(', ') : 'various fields';

    switch (selectedFormat) {
      case 'resume':
        return `Earned ${badgeCount} verified ${badgeCount === 1 ? 'badge' : 'badges'} in ${categoryText} on AURIN, demonstrating commitment to professional development and achievement verification.`;
      
      case 'linkedin':
        return `🎯 Earned ${badgeCount} blockchain-verified ${badgeCount === 1 ? 'badge' : 'badges'} on AURIN in ${categoryText} | Showcasing continuous learning and professional achievements | View my verified profile: aurin.com/profile/${username || 'username'}`;
      
      case 'cover':
        return `My commitment to professional growth is evidenced by ${badgeCount} verified ${badgeCount === 1 ? 'achievement' : 'achievements'} on AURIN in ${categoryText}, demonstrating my dedication to continuous learning and excellence in my field.`;
      
      default:
        return '';
    }
  };

  const resumeLine = generateResumeLine();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resumeLine);
    setCopied(true);
    toast({
      title: 'Copied to clipboard!',
      description: 'Paste it in your resume, LinkedIn, or cover letter',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="rounded-2xl bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.04] border border-purple-500/10 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-start gap-6 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
          <FileText size={28} className="text-black" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-purple-400" />
            <h3 className="text-2xl font-black tracking-[-0.02em]">Resume Line Generator</h3>
          </div>
          <p className="text-[15px] text-gray-300 mb-6 leading-relaxed tracking-[-0.01em]">
            <strong className="text-white">No platform has this!</strong> Generate professional resume lines from your achievements. 
            Copy and paste directly into your resume, LinkedIn, or cover letter.
          </p>

          {/* Format Selector */}
          <div className="flex gap-2 mb-6">
            {formats.map((format) => {
              const Icon = format.icon;
              return (
                <motion.button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-[14px] tracking-[-0.01em] transition-all ${
                    selectedFormat === format.id
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-white/[0.02] text-gray-400 border border-white/10 hover:border-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={16} />
                  <span>{format.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Generated Line */}
          <div className="relative">
            <textarea
              value={resumeLine}
              readOnly
              rows={3}
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-gray-200 text-[15px] leading-relaxed tracking-[-0.01em] resize-none focus:outline-none focus:border-purple-500/30"
            />
            <motion.button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <CheckCircle2 size={18} className="text-purple-400" />
              ) : (
                <Copy size={18} className="text-purple-400" />
              )}
            </motion.button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <ArrowRight size={14} />
            <span>Copy this line and add it to your resume, LinkedIn profile, or cover letter</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

