import React from 'react';
import Image from 'next/image';

import { mediaUrl } from '@/lib/media';

export type PartnerItem = {
  website?: string | null;
  logo?: unknown;
  organizationName?: string;
  partnerType?: 'sponsor' | 'partner' | string;
  [key: string]: unknown;
};

function PartnerCard({ partner, variant }: { partner: PartnerItem; variant: 'sponsor' | 'partner' }) {
  const isSponsor = variant === 'sponsor';
  return (
    <article className={`${isSponsor ? 'w-[17.5rem] sm:w-[20rem] h-[11rem] sm:h-[12.5rem]' : 'w-[15rem] sm:w-[17rem] h-[10rem] sm:h-[11rem]'} shrink-0 flex flex-col items-center justify-center rounded-2xl border border-[var(--line)] ${isSponsor ? 'bg-white' : 'bg-[var(--paper-soft)]'} p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
      <a href={partner.website || '#'} target={partner.website ? '_blank' : undefined} className="relative w-full h-full flex flex-col items-center justify-center">
        {mediaUrl(partner.logo) ? (
          <div className="relative w-full flex-grow mb-2">
            <Image src={mediaUrl(partner.logo)!} alt={partner.organizationName || ''} fill sizes={isSponsor ? '20rem' : '17rem'} className={`object-contain ${!isSponsor ? 'grayscale hover:grayscale-0 transition-all duration-300' : ''}`} />
          </div>
        ) : null}
        <p className={`${isSponsor ? 'text-sm' : 'text-xs'} font-semibold text-[var(--ink)] mt-1 truncate w-full`}>{partner.organizationName || ''}</p>
      </a>
    </article>
  );
}

export function PartnerMarquee({ 
  partners, 
  locale 
}: { 
  partners: PartnerItem[]; 
  locale: string;
}) {
  const sponsors = partners.filter(p => p.partnerType === 'sponsor');
  const otherPartners = partners.filter(p => p.partnerType === 'partner');

  return (
    <div className="w-full space-y-12 overflow-hidden py-4">
      
      {/* Sponsors Row */}
      {sponsors.length > 0 && (
        <div>
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-[var(--ink)]">{locale === 'th' ? 'ผู้สนับสนุนหลัก' : 'Our Sponsors'}</h3>
            <p className="text-sm text-[var(--muted)] mt-1">{locale === 'th' ? 'ขอขอบคุณผู้สนับสนุนที่ทำให้เกิดกิจกรรมดีๆ' : 'Thank you to our amazing sponsors'}</p>
          </div>
          <div className="relative w-full overflow-hidden group">
            <div className="animate-marquee flex shrink-0 hover:[animation-play-state:paused]">
              {/* First set */}
              <div className="flex gap-6 px-3 shrink-0">
                {sponsors.map((partner, i) => (
                  <PartnerCard key={`s1-${i}`} partner={partner} variant="sponsor" />
                ))}
              </div>
              {/* Duplicate set for seamless loop */}
              <div className="flex gap-6 px-3 shrink-0">
                {sponsors.map((partner, i) => (
                  <PartnerCard key={`s2-${i}`} partner={partner} variant="sponsor" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partners Row */}
      {otherPartners.length > 0 && (
        <div>
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-[var(--ink)]">{locale === 'th' ? 'พันธมิตรโครงการ' : 'Our Partners'}</h3>
            <p className="text-sm text-[var(--muted)] mt-1">{locale === 'th' ? 'เครือข่ายความร่วมมือที่ช่วยขับเคลื่อนสังคม' : 'Collaborators driving community impact'}</p>
          </div>
          <div className="relative w-full overflow-hidden group">
            <div className="animate-marquee-reverse flex shrink-0 hover:[animation-play-state:paused]">
              {/* First set */}
              <div className="flex gap-6 px-3 shrink-0">
                {otherPartners.map((partner, i) => (
                  <PartnerCard key={`p1-${i}`} partner={partner} variant="partner" />
                ))}
              </div>
              {/* Duplicate set for seamless loop */}
              <div className="flex gap-6 px-3 shrink-0">
                {otherPartners.map((partner, i) => (
                  <PartnerCard key={`p2-${i}`} partner={partner} variant="partner" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
