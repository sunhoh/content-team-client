'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { tenantConfigs } from '@/configs/tenant.config';
import { useTenant } from '@/contexts/TenantContext';

export function WorkspaceTab() {
  const { tenantId, companyName, updateTenant } = useTenant();
  const [selectedTenantId, setSelectedTenantId] = useState(tenantId);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSelectedTenantId(tenantId);
  }, [tenantId]);

  const tenantOptions = Object.values(tenantConfigs);

  const handleSave = () => {
    updateTenant({ tenantId: selectedTenantId });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast.success('워크스페이스가 저장되었습니다.');
  };

  return (
    <div className='flex flex-col gap-5'>
      <section className='bg-base neu-raised rounded-2xl p-6'>
        <div className='mb-5 flex items-center gap-3'>
          <div className='bg-base neu-raised-sm flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'>
            <svg
              viewBox='0 0 24 24'
              className='text-violet h-5 w-5'
              fill='none'
              stroke='currentColor'
              strokeWidth={1.5}
            >
              <path
                d='M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21V12h6v9'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <div>
            <p className='text-ink text-sm font-bold'>워크스페이스 정보</p>
            <p className='text-ink-faint mt-0.5 text-xs'>테넌트 기본 설정</p>
          </div>
        </div>

        <label className='text-ink-faint mb-2 block text-[10.5px] font-bold tracking-[.08em] uppercase'>
          기업명
        </label>
        <div className='mb-5'>
          <input
            type='text'
            readOnly
            value={companyName}
            className='neu-input bg-base text-ink-faint w-full cursor-default rounded-xl px-4 py-3 font-mono text-sm'
          />
        </div>

        <label className='text-ink-faint mb-2 block text-[10.5px] font-bold tracking-[.08em] uppercase'>
          테넌트 ID
        </label>
        <div className='flex items-center gap-2'>
          <div className='flex-1'>
            <Select
              value={selectedTenantId}
              onValueChange={v => v && setSelectedTenantId(v)}
            >
              <SelectTrigger>
                <span className='text-ink text-sm'>{selectedTenantId}</span>
              </SelectTrigger>
              <SelectContent>
                {tenantOptions.map(tenant => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={handleSave}
            disabled={selectedTenantId === tenantId}
            className='neu-btn-accent shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40'
            style={{
              background: saved
                ? 'linear-gradient(135deg, #16a34a, #15803d)'
                : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            }}
          >
            {saved ? '저장됨 ✓' : '저장'}
          </button>
        </div>
      </section>

      <section className='bg-base neu-raised rounded-2xl p-6'>
        <p className='text-ink-faint mb-4 text-[10.5px] font-bold tracking-[.08em] uppercase'>
          미리보기
        </p>
        <div className='flex items-center gap-3'>
          <div className='bg-base neu-raised-sm text-violet flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold'>
            {tenantId.charAt(0).toUpperCase() || 'W'}
          </div>
          <div>
            <p className='text-ink text-sm font-semibold'>
              {tenantId || '브랜드명'}
            </p>
            <p className='text-ink-faint text-xs'>{companyName}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
