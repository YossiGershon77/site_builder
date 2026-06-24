'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard/context';
import { useLanguage } from '@/lib/i18n/context';
import type { BarberService, GalleryImage } from '@/lib/mock';

function GalleryImagePicker({
  label,
  selectedUrl,
  galleryImages,
  onSelect,
  clearLabel,
  emptyLabel,
}: {
  label: string;
  selectedUrl: string | null;
  galleryImages: readonly GalleryImage[];
  onSelect: (url: string | null) => void;
  clearLabel: string;
  emptyLabel: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <label className="block text-xs font-medium text-gray-500">{label}</label>
        {selectedUrl && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            {clearLabel}
          </button>
        )}
      </div>

      {galleryImages.length === 0 ? (
        <p className="text-xs text-gray-400">{emptyLabel}</p>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {galleryImages.map((image) => {
            const selected = selectedUrl === image.url;
            return (
              <button
                key={image.id}
                type="button"
                onClick={() => onSelect(image.url)}
                className={`relative aspect-square rounded-lg overflow-hidden border transition-colors ${
                  selected ? 'border-[#111111] ring-2 ring-gray-200' : 'border-gray-200 hover:border-gray-400'
                }`}
                aria-label={`Choose image ${image.displayOrder + 1}`}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OwnerServiceEditor() {
  const { barber } = useDashboard();
  const { t } = useLanguage();
  // TODO: Service management page — edit descriptions,
  // manage custom services, reorder
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(barber.heroImageUrl);
  const [instagramUrl, setInstagramUrl] = useState(barber.instagramUrl ?? '');
  const [services, setServices] = useState<BarberService[]>(() =>
    barber.services.map((service) => ({ ...service })),
  );

  function updateService(id: string, patch: Partial<BarberService>) {
    setServices((current) =>
      current.map((service) => (service.id === id ? { ...service, ...patch } : service)),
    );
  }

  function addCustomService() {
    setServices((current) => [
      ...current,
      {
        id: `custom-${Date.now()}`,
        bankId: null,
        name: '',
        nameHe: '',
        description: '',
        imageUrl: null,
        priceDisplay: '₪50',
        durationMinutes: 30,
        showDuration: true,
        displayOrder: current.length,
        isActive: true,
      },
    ]);
  }

  function removeService(id: string) {
    setServices((current) => current.filter((service) => service.id !== id));
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('Save owner site edits:', {
      heroImageUrl,
      instagramUrl: instagramUrl.trim() || null,
      services,
    });
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#111111] mb-2">{t.dashboard.services.title}</h1>
          <p className="text-sm text-gray-500">
            {t.dashboard.services.ownerSub}
          </p>
        </div>
        <button
          type="button"
          onClick={addCustomService}
          className="px-4 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          {t.dashboard.services.addCustom}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-[#111111]">{t.dashboard.services.siteImages}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {t.dashboard.services.siteImagesSub}
            </p>
          </div>

          <GalleryImagePicker
            label={t.dashboard.services.heroImage}
            selectedUrl={heroImageUrl}
            galleryImages={barber.galleryImages}
            onSelect={setHeroImageUrl}
            clearLabel={t.dashboard.services.clear}
            emptyLabel={t.dashboard.services.uploadGalleryFirst}
          />
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-[#111111]">{t.dashboard.services.publicDetails}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {t.dashboard.services.publicDetailsSub}
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
              {t.dashboard.services.instagram}
              <span className="font-normal text-gray-400">{t.dashboard.services.optional}</span>
            </label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/yourname"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </section>

        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t.dashboard.services.serviceName}
                </label>
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => updateService(service.id, { name: e.target.value })}
                  placeholder="e.g. Wedding grooming package"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              {service.bankId === null && (
                <button
                  type="button"
                  onClick={() => removeService(service.id)}
                  className="mt-6 text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  {t.dashboard.services.remove}
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t.dashboard.services.description}
              </label>
              <textarea
                rows={3}
                value={service.description}
                onChange={(e) => updateService(service.id, { description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
              />
            </div>

            <GalleryImagePicker
              label={t.dashboard.services.serviceImage}
              selectedUrl={service.imageUrl}
              galleryImages={barber.galleryImages}
              onSelect={(url) => updateService(service.id, { imageUrl: url })}
              clearLabel={t.dashboard.services.clear}
              emptyLabel={t.dashboard.services.uploadGalleryFirst}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t.dashboard.services.priceDisplay}
                </label>
                <input
                  type="text"
                  value={service.priceDisplay ?? ''}
                  onChange={(e) =>
                    updateService(service.id, { priceDisplay: e.target.value || null })
                  }
                  placeholder="₪80"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t.dashboard.services.duration}
                </label>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={service.durationMinutes}
                    onChange={(e) =>
                      updateService(service.id, {
                        durationMinutes: Number(e.target.value) || service.durationMinutes,
                      })
                    }
                    className="flex-1 px-3 py-2 text-sm outline-none"
                  />
                  <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-l border-gray-200">
                    min
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={service.isActive}
                  onChange={(e) => updateService(service.id, { isActive: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                {t.dashboard.services.active}
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={service.showDuration}
                  onChange={(e) => updateService(service.id, { showDuration: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                {t.dashboard.services.showDuration}
              </label>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="px-6 py-3 bg-[#111111] text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          {t.dashboard.services.saveChanges}
        </button>
      </form>
    </div>
  );
}

export default function MyServicesPage() {
  const { user, barber } = useDashboard();
  const { t } = useLanguage();

  if (user.role === 'OWNER') return <OwnerServiceEditor />;

  const member = barber.teamMembers.find((m) => m.id === user.teamMemberId);
  const memberServiceIds = new Set(member?.services.map((s) => s.service.id) ?? []);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const selected = barber.services
      .filter((s) => form.get(`service-${s.id}`) === 'on')
      .map((s) => s.id);
    console.log('Save my services:', selected);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-[#111111] mb-2">{t.dashboard.services.myTitle}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {t.dashboard.services.staffSub}
      </p>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        {barber.services.map((service) => (
          <label
            key={service.id}
            className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              name={`service-${service.id}`}
              defaultChecked={memberServiceIds.has(service.id)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[#111111]">{service.name}</p>
            <p className="text-xs text-gray-400">
                {service.durationMinutes} {t.common.min} · {service.priceDisplay}
              </p>
            </div>
          </label>
        ))}

        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-[#111111] text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            {t.dashboard.services.saveChanges}
          </button>
        </div>
      </form>
    </div>
  );
}
