// TODO [ASAF]: Replace with real API call
'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  CATEGORY_META,
  getAllCategories,
  getServicesByCategory,
  type ServiceBankItem,
} from '@/lib/service-bank';
import { DEFAULT_SERVICE_PRICES } from '@/lib/setup/constants';
import type { SetupSelectedService } from '@/lib/mock';
import type { SetupTranslations } from '@/lib/setup/translations';
import { useLanguage } from '@/lib/i18n/context';
import { FieldError } from './FieldError';

interface ServiceSelectorProps {
  selectedServices: SetupSelectedService[];
  globalShowPrices: boolean;
  globalShowDurations: boolean;
  onGlobalShowPricesChange: (value: boolean) => void;
  onGlobalShowDurationsChange: (value: boolean) => void;
  onSelectedServicesChange: (services: SetupSelectedService[]) => void;
  labels: SetupTranslations['step2'];
}

function getSelected(
  selected: SetupSelectedService[],
  id: string,
): SetupSelectedService | undefined {
  return selected.find((s) => s.id === id);
}

function Toggle({
  checked,
  onChange,
  label,
  sub,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[#111111]">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
          checked ? 'bg-[#111111] justify-end' : 'bg-gray-200 justify-start'
        }`}
      >
        <span className="h-5 w-5 rounded-full bg-white shadow shrink-0" />
      </button>
    </div>
  );
}

function ServiceRow({
  item,
  selected,
  globalShowPrices,
  onToggle,
  onUpdate,
  labels,
  locale,
}: {
  item: ServiceBankItem;
  selected?: SetupSelectedService;
  globalShowPrices: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<SetupSelectedService>) => void;
  labels: SetupTranslations['step2'];
  locale: 'he' | 'en';
}) {
  const isSelected = !!selected;
  const [priceError, setPriceError] = useState<string | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);

  function validatePrice(value: number) {
    if (!globalShowPrices) return null;
    if (Number.isNaN(value)) return 'Price must be a number';
    if (value < 0) return 'Price cannot be negative';
    return null;
  }

  function validateDuration(value: number) {
    if (Number.isNaN(value)) return 'Duration must be a number';
    if (value < 5) return 'Minimum 5 minutes';
    return null;
  }

  return (
    <div className={`rounded-xl border transition-colors ${isSelected ? 'border-gray-200 bg-gray-50' : 'border-transparent'}`}>
      <label className="flex items-center gap-3 p-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-4 h-4 rounded accent-[#111111]"
        />
        <span className="text-lg" aria-hidden>{item.icon}</span>
        <span className="flex-1 text-sm font-medium text-[#111111]">
          {locale === 'he' ? item.nameHe : item.name}
        </span>
        <span className="text-xs text-gray-400 hidden sm:inline">
          {locale === 'he' ? item.name : item.nameHe}
        </span>
        <span className="text-xs text-gray-300">{item.defaultDurationMinutes} min</span>
      </label>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isSelected ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {selected && (
          <div className="px-3 pb-3 pt-1 space-y-3 border-t border-gray-100">
            {globalShowPrices && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{labels.price}</label>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
                  <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-r border-gray-200">₪</span>
                  <input
                    type="number"
                    min={0}
                    value={selected.price}
                    onChange={(e) => {
                      const value = e.target.value === '' ? NaN : Number(e.target.value);
                      const err = e.target.value === '' ? 'Please set a price' : validatePrice(value);
                      setPriceError(err);
                      if (!err && !Number.isNaN(value)) onUpdate({ price: value });
                    }}
                    className={`flex-1 px-3 py-2 text-sm outline-none ${priceError ? 'border-red-500' : ''}`}
                  />
                </div>
                <FieldError message={priceError} />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{labels.duration}</label>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={selected.duration}
                  onChange={(e) => {
                    const value = e.target.value === '' ? NaN : Number(e.target.value);
                    const err = e.target.value === '' ? 'Please set a duration' : validateDuration(value);
                    setDurationError(err);
                    if (!err && !Number.isNaN(value)) onUpdate({ duration: value });
                  }}
                  className="flex-1 px-3 py-2 text-sm outline-none"
                />
                <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-l border-gray-200">min</span>
              </div>
              <FieldError message={durationError} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Service image</label>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {selected.imageUrl ? (
                    <Image src={selected.imageUrl} alt="" fill className="object-cover" sizes="48px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // TODO [ASAF]: Real upload to Supabase Storage
                      console.log('Upload for', item.id);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
                  >
                    {labels.uploadCustom}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate({
                        imageUrl: item.defaultImageUrl,
                        useDefaultImage: true,
                      })
                    }
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
                  >
                    {labels.useDefault}
                  </button>
                </div>
              </div>
              {selected.useDefaultImage && (
                <p className="text-[10px] text-gray-400 mt-1">{labels.defaultImage}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ServiceSelector({
  selectedServices,
  globalShowPrices,
  globalShowDurations,
  onGlobalShowPricesChange,
  onGlobalShowDurationsChange,
  onSelectedServicesChange,
  labels,
}: ServiceSelectorProps) {
  const { locale } = useLanguage();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(getAllCategories().map((c) => [c, true])),
  );

  function toggleService(item: ServiceBankItem) {
    const existing = getSelected(selectedServices, item.id);
    if (existing) {
      onSelectedServicesChange(selectedServices.filter((s) => s.id !== item.id));
    } else {
      onSelectedServicesChange([
        ...selectedServices,
        {
          id: item.id,
          price: DEFAULT_SERVICE_PRICES[item.id] ?? 50,
          duration: item.defaultDurationMinutes,
          imageUrl: item.defaultImageUrl,
          useDefaultImage: true,
        },
      ]);
    }
  }

  function updateService(id: string, patch: Partial<SetupSelectedService>) {
    onSelectedServicesChange(
      selectedServices.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
        <Toggle
          checked={globalShowPrices}
          onChange={onGlobalShowPricesChange}
          label={labels.showPrices}
          sub={labels.showPricesSub}
        />
        <Toggle
          checked={globalShowDurations}
          onChange={onGlobalShowDurationsChange}
          label={labels.showDurations}
          sub={labels.showDurationsSub}
        />
      </div>

      {getAllCategories().map((category) => {
        const meta = CATEGORY_META[category];
        const items = getServicesByCategory(category);
        const count = items.filter((i) => getSelected(selectedServices, i.id)).length;
        const isOpen = expanded[category] ?? true;

        return (
          <div key={category} className="border border-gray-100 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded((prev) => ({ ...prev, [category]: !isOpen }))}
              className="w-full flex items-center justify-between p-4 text-start hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-medium text-[#111111]">
                  {locale === 'he' ? meta.labelHe : meta.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{meta.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-500">{count} selected</span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {isOpen && (
              <div className="px-2 pb-2 space-y-1">
                {items.map((item) => (
                  <ServiceRow
                    key={item.id}
                    item={item}
                    selected={getSelected(selectedServices, item.id)}
                    globalShowPrices={globalShowPrices}
                    onToggle={() => toggleService(item)}
                    onUpdate={(patch) => updateService(item.id, patch)}
                    labels={labels}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function validateSelectedServices(
  selected: SetupSelectedService[],
  globalShowPrices: boolean,
): boolean {
  if (selected.length === 0) return false;
  return selected.every((s) => {
    if (globalShowPrices && (s.price === undefined || s.price < 0 || Number.isNaN(s.price))) {
      return false;
    }
    return s.duration >= 5 && !Number.isNaN(s.duration);
  });
}
