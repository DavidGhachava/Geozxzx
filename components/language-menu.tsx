'use client';

import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type InterfaceLocale = 'en' | 'ru' | 'ka';

const options: { value: InterfaceLocale; short: string; label: string }[] = [
  { value: 'en', short: 'EN', label: 'English' },
  { value: 'ru', short: 'RU', label: 'Русский' },
  { value: 'ka', short: 'GE', label: 'ქართული' },
];

export function LanguageMenu({
  locale,
  onChange,
  label = 'Choose language',
}: {
  locale: InterfaceLocale;
  onChange: (locale: InterfaceLocale) => void;
  label?: string;
}) {
  const current =
    options.find((option) => option.value === locale) ?? options[0];
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="language-menu-trigger" aria-label={label}>
        <span>{current.short}</span>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="language-menu-content">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="language-menu-item"
            onClick={() => onChange(option.value)}
          >
            <b>{option.short}</b>
            <span>{option.label}</span>
            {locale === option.value && <Check />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
