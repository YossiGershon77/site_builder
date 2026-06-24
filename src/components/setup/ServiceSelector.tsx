// TODO [ASAF]: Replace with real API call
'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  CATEGORY_META,
  FALLBACK_SERVICE_IMAGE,
  getAllCategories,
  getServicesByCategory,
  type ServiceCategory,
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
  onCustomServiceAdded?: (message: string) => void;
  labels: SetupTranslations['step2'];
}

const MAX_SERVICE_DESCRIPTION_LENGTH = 300;
const CUSTOM_CATEGORY_OPTIONS: ServiceCategory[] = [
  'CUTS',
  'BEARD',
  'COMBOS',
  'TREATMENTS',
  'EXTRAS',
];

function getSelected(
  selected: SetupSelectedService[],
  id: string,
): SetupSelectedService | undefined {
  return selected.find((s) => s.bankId === id);
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
    if (Number.isNaN(value)) return labels.priceMustBeNumber;
    if (value < 0) return labels.priceCannotBeNegative;
    return null;
  }

  function validateDuration(value: number) {
    if (Number.isNaN(value)) return labels.durationMustBeNumber;
    if (value < 5) return labels.minimumFiveMinutes;
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
                      const err = e.target.value === '' ? labels.setPrice : validatePrice(value);
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
                  value={selected.durationMinutes}
                  onChange={(e) => {
                    const value = e.target.value === '' ? NaN : Number(e.target.value);
                    const err = e.target.value === '' ? labels.setDuration : validateDuration(value);
                    setDurationError(err);
                    if (!err && !Number.isNaN(value)) onUpdate({ durationMinutes: value });
                  }}
                  className="flex-1 px-3 py-2 text-sm outline-none"
                />
                <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-l border-gray-200">min</span>
              </div>
              <FieldError message={durationError} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {labels.serviceDescription}
              </label>
              <textarea
                value={selected.description ?? item.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                rows={3}
                maxLength={MAX_SERVICE_DESCRIPTION_LENGTH}
                placeholder={labels.serviceDescriptionPlaceholder}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none bg-white resize-none"
              />
              <div className="mt-1 text-right text-[10px] text-gray-400">
                {(selected.description ?? item.description).length} / {MAX_SERVICE_DESCRIPTION_LENGTH}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">{labels.serviceImage}</label>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {selected.imageUrl ? (
                    <Image
                      src={selected.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                      onError={(event) => {
                        event.currentTarget.src = FALLBACK_SERVICE_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                      {labels.noImage}
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

function CustomServiceRow({
  service,
  globalShowPrices,
  labels,
  onUpdate,
  onRemove,
}: {
  service: SetupSelectedService;
  globalShowPrices: boolean;
  labels: SetupTranslations['step2'];
  onUpdate: (patch: Partial<SetupSelectedService>) => void;
  onRemove: () => void;
}) {
  const [priceError, setPriceError] = useState<string | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
            {labels.customServiceName}
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-500">
              {labels.customBadge}
            </span>
          </label>
          <input
            type="text"
            value={service.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder={labels.customServiceNamePlaceholder}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none bg-white"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(labels.removeCustomConfirm)) {
              onRemove();
            }
          }}
          className="mt-6 text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          {labels.remove}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {labels.hebrewName}
          </label>
          <input
            type="text"
            value={service.nameHe ?? ''}
            onChange={(e) => onUpdate({ nameHe: e.target.value })}
            placeholder={labels.hebrewNamePlaceholder}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {labels.category}
          </label>
          <select
            value={service.category ?? 'COMBOS'}
            onChange={(e) => onUpdate({ category: e.target.value as ServiceCategory })}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none bg-white"
          >
            {CUSTOM_CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_META[category].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          {labels.description}
        </label>
        <p className="text-[10px] text-gray-400 mb-1">{labels.descriptionSub}</p>
        <textarea
          value={service.description ?? ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={3}
          maxLength={MAX_SERVICE_DESCRIPTION_LENGTH}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none bg-white resize-none"
        />
        <div className="mt-1 text-right text-[10px] text-gray-400">
          {(service.description ?? '').length} / {MAX_SERVICE_DESCRIPTION_LENGTH}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {globalShowPrices && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {labels.price}
            </label>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
              <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-r border-gray-200">₪</span>
              <input
                type="number"
                min={0}
                value={service.price}
                onChange={(e) => {
                  const value = e.target.value === '' ? NaN : Number(e.target.value);
                  const err =
                    e.target.value === ''
                      ? labels.setPrice
                      : Number.isNaN(value)
                        ? labels.priceMustBeNumber
                        : value < 0
                          ? labels.priceCannotBeNegative
                          : null;
                  setPriceError(err);
                  if (!err && !Number.isNaN(value)) onUpdate({ price: value });
                }}
                className="flex-1 px-3 py-2 text-sm outline-none"
              />
            </div>
            <FieldError message={priceError} />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {labels.duration}
          </label>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
            <input
              type="number"
              min={5}
              step={5}
              value={service.durationMinutes}
              onChange={(e) => {
                const value = e.target.value === '' ? NaN : Number(e.target.value);
                const err =
                  e.target.value === ''
                    ? labels.setDuration
                    : Number.isNaN(value)
                      ? labels.durationMustBeNumber
                      : value < 5
                        ? labels.minimumFiveMinutes
                        : null;
                setDurationError(err);
                if (!err && !Number.isNaN(value)) onUpdate({ durationMinutes: value });
              }}
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
            <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-l border-gray-200">min</span>
          </div>
          <FieldError message={durationError} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">{labels.serviceImage}</label>
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-5 text-center text-xs text-gray-400">
          {labels.uploadTodo}
        </div>
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
  onCustomServiceAdded,
  labels,
}: ServiceSelectorProps) {
  const { locale } = useLanguage();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(getAllCategories().map((c) => [c, true])),
  );
  const [customFormOpen, setCustomFormOpen] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [customDraft, setCustomDraft] = useState<SetupSelectedService>({
    bankId: null,
    customId: '',
    name: '',
    nameHe: '',
    category: 'COMBOS',
    description: '',
    price: 50,
    durationMinutes: 30,
    imageUrl: null,
    useDefaultImage: false,
    showPrice: globalShowPrices,
    showDuration: globalShowDurations,
    isCustom: true,
  });

  function toggleService(item: ServiceBankItem) {
    const existing = getSelected(selectedServices, item.id);
    if (existing) {
      onSelectedServicesChange(selectedServices.filter((s) => s.bankId !== item.id));
    } else {
      onSelectedServicesChange([
        ...selectedServices,
        {
          bankId: item.id,
          customId: undefined,
          name: item.name,
          nameHe: item.nameHe,
          category: item.category,
          description: null,
          price: DEFAULT_SERVICE_PRICES[item.id] ?? 50,
          durationMinutes: item.defaultDurationMinutes,
          imageUrl: item.defaultImageUrl,
          useDefaultImage: true,
          showPrice: globalShowPrices,
          showDuration: globalShowDurations,
        },
      ]);
    }
  }

  function updateService(id: string, patch: Partial<SetupSelectedService>) {
    onSelectedServicesChange(
      selectedServices.map((s) => (s.bankId === id ? { ...s, ...patch } : s)),
    );
  }

  function addCustomService() {
    const trimmedName = customDraft.name.trim();
    if (!trimmedName) {
      setCustomError(labels.enterServiceName);
      return;
    }
    if (customDraft.durationMinutes < 5 || Number.isNaN(customDraft.durationMinutes)) {
      setCustomError(labels.durationAtLeastFive);
      return;
    }

    const service: SetupSelectedService = {
      ...customDraft,
      customId: `custom-${Date.now()}`,
      name: trimmedName,
      nameHe: customDraft.nameHe?.trim() || undefined,
      description: customDraft.description?.trim() || null,
      showPrice: globalShowPrices,
      showDuration: globalShowDurations,
      isCustom: true,
    };

    console.log('Custom service added', service);
    onSelectedServicesChange([...selectedServices, service]);
    onCustomServiceAdded?.(labels.customServiceAdded);
    setCustomError(null);
    setCustomFormOpen(false);
    setCustomDraft({
      bankId: null,
      customId: '',
      name: '',
      nameHe: '',
      category: 'COMBOS',
      description: '',
      price: 50,
      durationMinutes: 30,
      imageUrl: null,
      useDefaultImage: false,
      showPrice: globalShowPrices,
      showDuration: globalShowDurations,
      isCustom: true,
    });
  }

  function updateCustomService(index: number, patch: Partial<SetupSelectedService>) {
    onSelectedServicesChange(
      selectedServices.map((service, currentIndex) =>
        currentIndex === index ? { ...service, ...patch } : service,
      ),
    );
  }

  function removeCustomService(index: number) {
    onSelectedServicesChange(
      selectedServices.filter((_, currentIndex) => currentIndex !== index),
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
                <span className="text-xs text-gray-500">
                  {count} {labels.selectedCount}
                </span>
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

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-xs font-medium text-gray-400">{labels.dontSeeService}</span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      <div className="border border-gray-100 rounded-xl p-4 space-y-3">
        {selectedServices.map((service, index) =>
          service.isCustom ? (
            <CustomServiceRow
              key={service.customId ?? `custom-${index}`}
              service={service}
              globalShowPrices={globalShowPrices}
              labels={labels}
              onUpdate={(patch) => updateCustomService(index, patch)}
              onRemove={() => removeCustomService(index)}
            />
          ) : null,
        )}

        <button
          type="button"
          onClick={() => setCustomFormOpen((open) => !open)}
          className="w-full rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-gray-500 hover:text-[#111111]"
        >
          {customFormOpen ? labels.closeCustomForm : labels.addCustomService}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            customFormOpen ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {labels.serviceName}
                </label>
                <input
                  type="text"
                  value={customDraft.name}
                  onChange={(e) => {
                    setCustomDraft((draft) => ({ ...draft, name: e.target.value }));
                    setCustomError(null);
                  }}
                  placeholder={labels.customServiceNamePlaceholder}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {labels.hebrewName}
                </label>
                <input
                  type="text"
                  value={customDraft.nameHe ?? ''}
                  onChange={(e) =>
                    setCustomDraft((draft) => ({ ...draft, nameHe: e.target.value }))
                  }
                  placeholder={labels.hebrewNamePlaceholder}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                value={customDraft.description ?? ''}
                onChange={(e) =>
                  setCustomDraft((draft) => ({ ...draft, description: e.target.value }))
                }
                rows={3}
                maxLength={MAX_SERVICE_DESCRIPTION_LENGTH}
                placeholder={labels.serviceDescriptionPlaceholder}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none bg-white resize-none"
              />
              <div className="mt-1 text-right text-[10px] text-gray-400">
                {(customDraft.description ?? '').length} / {MAX_SERVICE_DESCRIPTION_LENGTH}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {labels.category}
                </label>
                <select
                  value={customDraft.category ?? 'COMBOS'}
                  onChange={(e) =>
                    setCustomDraft((draft) => ({
                      ...draft,
                      category: e.target.value as ServiceCategory,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none bg-white"
                >
                  {CUSTOM_CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {CATEGORY_META[category].label}
                    </option>
                  ))}
                </select>
              </div>

              {globalShowPrices && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Price
                  </label>
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
                    <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-r border-gray-200">₪</span>
                    <input
                      type="number"
                      min={0}
                      value={customDraft.price}
                      onChange={(e) =>
                        setCustomDraft((draft) => ({
                          ...draft,
                          price: e.target.value === '' ? 0 : Number(e.target.value),
                        }))
                      }
                      className="flex-1 px-3 py-2 text-sm outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Duration
                </label>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={customDraft.durationMinutes}
                    onChange={(e) => {
                      setCustomDraft((draft) => ({
                        ...draft,
                        durationMinutes:
                          e.target.value === '' ? NaN : Number(e.target.value),
                      }));
                      setCustomError(null);
                    }}
                    className="flex-1 px-3 py-2 text-sm outline-none"
                  />
                  <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-l border-gray-200">min</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-5 text-center text-xs text-gray-400">
              {labels.uploadTodo}
            </div>

            <FieldError message={customError} />

            <button
              type="button"
              onClick={addCustomService}
              className="w-full rounded-xl bg-[#111111] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              {labels.addService}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function validateSelectedServices(
  selected: SetupSelectedService[],
  globalShowPrices: boolean,
): boolean {
  if (selected.length === 0) return false;
  return selected.every((s) => {
    if (s.isCustom && !s.name.trim()) return false;
    if (globalShowPrices && (s.price === undefined || s.price < 0 || Number.isNaN(s.price))) {
      return false;
    }
    return s.durationMinutes >= 5 && !Number.isNaN(s.durationMinutes);
  });
}
