import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BookOpen, Baby, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResultTabsProps {
  results: {
    simpleSummary: string;
    detailedExplanation: string;
    childFriendly: string;
    storytelling: string;
  };
}

const ResultTabs = ({ results }: ResultTabsProps) => {
  const tabs = [
    {
      value: 'simple',
      label: 'Simple Summary',
      icon: FileText,
      content: results.simpleSummary,
    },
    {
      value: 'detailed',
      label: 'Detailed',
      icon: BookOpen,
      content: results.detailedExplanation,
    },
    {
      value: 'child',
      label: 'For Kids',
      icon: Baby,
      content: results.childFriendly,
    },
    {
      value: 'story',
      label: 'Story Mode',
      icon: Sparkles,
      content: results.storytelling,
    },
  ];

  return (
    <Tabs defaultValue="simple" className="w-full">
      <TabsList className="glass-card mb-8 grid w-full grid-cols-2 gap-2 rounded-2xl p-2 lg:grid-cols-4">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-xl transition-smooth data-[state=active]:ai-gradient data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow"
          >
            <tab.icon className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab, index) => (
        <TabsContent key={tab.value} value={tab.value}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-3xl p-8"
          >
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {tab.value === 'detailed' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{tab.content}</ReactMarkdown>
              ) : (
                <div className="whitespace-pre-wrap text-base leading-relaxed">
                  {tab.content}
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ResultTabs;
