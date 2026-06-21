import Image from 'next/image';
import type { TeamMember } from '@/lib/mock';

interface TeamMemberCardProps {
  member: TeamMember;
  variant?: 'circle' | 'card';
}

export function TeamMemberCard({ member, variant = 'circle' }: TeamMemberCardProps) {
  const serviceNames = member.services.map((s) => s.service.name).join(', ');
  const initial = member.name.charAt(0);

  const Avatar = ({ size }: { size: number }) => (
    <div
      className="relative rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {member.profileImageUrl ? (
        <Image
          src={member.profileImageUrl}
          alt={member.name}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-400 font-semibold text-sm">{initial}</span>
        </div>
      )}
    </div>
  );

  if (variant === 'circle') {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <Avatar size={64} />
        <div>
          <p className="text-sm font-semibold text-[#111111]">{member.name}</p>
          {serviceNames && (
            <p className="text-xs text-gray-400 mt-0.5">{serviceNames}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 border border-gray-100 rounded-xl p-4">
      <Avatar size={48} />
      <div>
        <p className="font-semibold text-sm text-[#111111]">{member.name}</p>
        {serviceNames && (
          <p className="text-xs text-gray-400 mt-0.5">{serviceNames}</p>
        )}
      </div>
    </div>
  );
}
