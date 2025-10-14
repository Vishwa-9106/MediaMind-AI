import { motion } from 'framer-motion';
import { Moon, Sun, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useThemeStore } from '@/store/useThemeStore';

const Settings = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-bold">Settings</h1>
            <p className="mt-2 text-xl text-muted-foreground">
              Customize your UniDescribe experience
            </p>
          </div>

          <div className="space-y-6">
            {/* Theme Settings */}
            <Card className="glass-card rounded-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how MediaMind AI looks on your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={isDark}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Language Settings */}
            <Card className="glass-card rounded-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language & Region
                </CardTitle>
                <CardDescription>
                  Choose your preferred language for results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Output Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language" className="rounded-xl">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    AI explanations will be generated in this language
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Processing Preferences */}
            <Card className="glass-card rounded-2xl border-2">
              <CardHeader>
                <CardTitle>Processing Preferences</CardTitle>
                <CardDescription>
                  Control how your files are analyzed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-delete" className="text-base">Auto-delete Files</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically delete files after 24 hours
                    </p>
                  </div>
                  <Switch id="auto-delete" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="detailed" className="text-base">Detailed Analysis</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable more comprehensive AI explanations
                    </p>
                  </div>
                  <Switch id="detailed" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card className="glass-card rounded-2xl border-2">
              <CardHeader>
                <CardTitle>About UniDescribe AI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Version 1.0.0</p>
                <p>
                  UniDescribe AI uses advanced machine learning models to analyze
                  and explain any media content in multiple styles.
                </p>
                <p className="pt-4">
                  © 2025 MediaMind  AI. All rights reserved.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
