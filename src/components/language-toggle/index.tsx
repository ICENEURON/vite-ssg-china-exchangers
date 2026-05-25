import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrentLanguage, addLanguageToPath, getPathWithoutLanguage } from '../../utils/language-routing';
import type { Language } from '../../utils/language-routing';
import { languages as languageConfigs } from '../../locales';
import countries from '../../data/countries.json';
import { Button } from '../ui/button';
import { Globe, Check } from 'lucide-react';

type Country = {
  id: string;
  name: string;
};

const countriesById = new Map((countries as Country[]).map((country) => [country.id, country]));

function getCountryFlag(countryId: string) {
  return countryId
    .toUpperCase()
    .replace(/[A-Z]/g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
}

export function LanguageToggle() {
  const { t } = useTranslation("translation");
  const navigate = useNavigate();
  const location = useLocation();
  const currentLanguage = useCurrentLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleOpen = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    openTimerRef.current = setTimeout(() => {
      setIsOpen(true);
      openTimerRef.current = null;
    }, 220);
  }, [clearOpenTimer, clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, 180);
  }, [clearOpenTimer, clearCloseTimer]);

  const closeMenu = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    setIsOpen(false);
  }, [clearOpenTimer, clearCloseTimer]);

  const handleLanguageChange = useCallback((lang: Language) => {
    // 首先关闭下拉菜单
    closeMenu();

    // 获取不包含语言前缀的当前路径
    const pathWithoutLanguage = getPathWithoutLanguage(location.pathname);

    // 生成包含所选语言的新路径
    const newPath = addLanguageToPath(pathWithoutLanguage, lang);

    // 导航到新路径
    navigate(newPath);
  }, [navigate, location.pathname, closeMenu]);

  // 点击外部区域时关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeMenu]);

  useEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  }, [clearOpenTimer, clearCloseTimer]);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onFocus={() => setIsOpen(true)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          closeMenu();
        }
      }}
    >
      <Button
        variant="ghost"
        size="navigation"
        onClick={() => setIsOpen(true)}
        type="button"
        aria-expanded={isOpen}
        aria-label={t("ui.accessibility.select_language")}
        className="text-navbar-foreground hover:text-navbar-foreground hover:bg-accent/40"
      >
        <Globe className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 min-w-[120px] pt-2">
          <div className="flex flex-col gap-2 border border-border/50 bg-navbar p-2 shadow">
            {Object.entries(languageConfigs).map(([code, { name, countryId }]) => {
              const country = countriesById.get(countryId);

              return (
                <Button
                  key={code}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLanguageChange(code as Language)}
                  type="button"
                  title={country ? `${name} - ${country.name}` : name}
                  className="w-full px-3 py-2 text-left hover:bg-accent/40 hover:text-navbar-foreground flex items-center gap-2 text-sm transition-colors h-auto justify-start focus:bg-accent/70 focus:text-navbar-foreground rounded-none text-navbar-foreground"
                >
                  <span className="text-base leading-none" aria-hidden="true">
                    {getCountryFlag(countryId)}
                  </span>
                  <span>{name}</span>
                  {currentLanguage === code && (
                    <Check className="h-4 w-4 ml-auto text-red-500" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
