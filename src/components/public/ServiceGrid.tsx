'use client';

import { useState } from 'react';
import type { BarberService } from '@/lib/mock';
import { ServiceCard } from '@/components/ServiceCard';
import { ServiceModal } from '@/components/public/ServiceModal';

interface ServiceGridProps {
  services: readonly BarberService[];
  columnsClassName?: string;
}

export function ServiceGrid({
  services,
  columnsClassName = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
}: ServiceGridProps) {
  const [selectedService, setSelectedService] = useState<BarberService | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function openService(service: BarberService) {
    setSelectedService(service);
    setModalOpen(true);
  }

  function closeService() {
    setModalOpen(false);
    window.setTimeout(() => setSelectedService(null), 300);
  }

  return (
    <>
      <div className={`grid ${columnsClassName} gap-6 items-start`}>
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onClick={() => openService(service)}
          />
        ))}
      </div>

      <ServiceModal
        service={selectedService}
        isOpen={modalOpen}
        onClose={closeService}
      />
    </>
  );
}
