import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrentLanguage, addLanguageToPath, getPathWithoutLanguage } from '../../utils/language-routing';
import type { Language } from '../../utils/language-routing';
import { languages as languageConfigs } from '../../locales';
import { Button } from '../ui/button';
import { Globe, Check } from 'lucide-react';

export function LanguageToggle() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentLanguage = useCurrentLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = useCallback((lang: Language) => {
    // 首先关闭下拉菜单
    setIsOpen(false);

    // 获取不包含语言前缀的当前路径
    const pathWithoutLanguage = getPathWithoutLanguage(location.pathname);

    // 生成包含所选语言的新路径
    const newPath = addLanguageToPath(pathWithoutLanguage, lang);

    // 导航到新路径
    navigate(newPath);
  }, [navigate, location.pathname]);

  // 点击外部区域时关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="navigation"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label="Select language"
        className="hover:text-foreground"
      >
        <Globe className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 p-2 z-50 min-w-[120px] bg-card border border-border rounded-none shadow flex flex-col gap-2">
          {Object.entries(languageConfigs).map(([code, { name, flag }]) => (
            <Button
              key={code}
              variant="ghost"
              size="sm"
              onClick={() => handleLanguageChange(code as Language)}
              type="button"
              className="w-full px-3 py-2 text-left hover:bg-accent/40 hover:text-foreground flex items-center gap-2 text-sm transition-colors h-auto justify-start focus:bg-accent/70 focus:text-foreground"
            >
              <span>{flag}</span>
              <span>{name}</span>
              {currentLanguage === code && (
                <Check className="h-4 w-4 ml-auto text-red-500" />
              )}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}