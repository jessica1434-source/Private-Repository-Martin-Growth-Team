import { useState } from 'react';
import LanguageToggle from '../LanguageToggle';
import type { Language } from '@/lib/i18n';

export default function LanguageToggleExample() {
  const [language, setLanguage] = useState<Language>('zh-TW');
  
  return (
    <div className="flex items-center gap-4 p-4">
      <span className="text-sm">Current: {language}</span>
      <LanguageToggle 
        currentLanguage={language} 
        onLanguageChange={setLanguage} 
      />
    </div>
  );
}
