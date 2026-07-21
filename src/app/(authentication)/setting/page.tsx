'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';

type Tab = 'api' | 'workspace';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ApiTab() {
  const { apiKey, login } = useAuth();
  const [showCurrentKey, setShowCurrentKey] = useState(false);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!newKey.trim()) return;
    await login(newKey.trim());
    setNewKey('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* API Key Card */}
      <section className="bg-base neu-raised rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-base neu-raised-sm">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-teal" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="8" cy="15" r="4" />
                <path d="M12 15h8M18 13v4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-ink">Claude API Key</p>
              <p className="text-xs text-ink-faint mt-0.5">Anthropic Console에서 발급</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-online">
            <span className="h-1.5 w-1.5 rounded-full bg-online" />
            인증됨
          </div>
        </div>

        <label className="block mb-2 text-[10.5px] font-bold tracking-[.08em] uppercase text-ink-faint">
          현재 키
        </label>
        <div className="relative mb-4">
          <input
            type={showCurrentKey ? 'text' : 'password'}
            readOnly
            value={apiKey ?? ''}
            className="neu-input w-full rounded-xl bg-base px-4 py-3 pr-12 font-mono text-sm text-ink-dim"
          />
          <button
            type="button"
            onClick={() => setShowCurrentKey(v => !v)}
            className="neu-btn-icon absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg bg-base text-ink-faint"
          >
            <EyeIcon open={showCurrentKey} />
          </button>
        </div>

        <label className="block mb-2 text-[10.5px] font-bold tracking-[.08em] uppercase text-ink-faint">
          새 키로 교체
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type={showNewKey ? 'text' : 'password'}
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="neu-input w-full rounded-xl bg-base px-4 py-3 pr-12 font-mono text-sm text-ink"
            />
            <button
              type="button"
              onClick={() => setShowNewKey(v => !v)}
              className="neu-btn-icon absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg bg-base text-ink-faint"
            >
              <EyeIcon open={showNewKey} />
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={!newKey.trim()}
            className="neu-btn-accent shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: saved ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            {saved ? '저장됨 ✓' : '저장'}
          </button>
        </div>
      </section>

      {/* Model Card */}
      <section className="bg-base neu-raised rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-base neu-raised-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-violet" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" strokeLinejoin="round" />
              <path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-ink">기본 모델</p>
            <p className="text-xs text-ink-faint mt-0.5">에이전트 실행에 사용할 Claude 모델</p>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-violet/5 px-4 py-3">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
          </svg>
          <p className="text-xs text-ink-faint leading-relaxed">
            각 에이전트에는 서브 에이전트가 수행할 LLM 모델이 사전에 지정되어 있습니다.
          </p>
        </div>
      </section>

      {/* Security Note */}
      <div className="bg-base neu-raised rounded-2xl px-5 py-4 flex items-center gap-3">
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" />
        </svg>
        <p className="text-xs text-ink-faint">
          API 키는 브라우저 로컬 스토리지에만 저장되며 외부 서버로 전송되지 않습니다.
        </p>
      </div>
    </div>
  );
}

function WorkspaceTab() {
  const { tenantId, tenantName, updateTenant } = useTenant();
  const [tenantNameInput, setTenantNameInput] = useState(tenantName);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateTenant({ tenantName: tenantNameInput });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Workspace Card */}
      <section className="bg-base neu-raised rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-base neu-raised-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-violet" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-ink">워크스페이스 정보</p>
            <p className="text-xs text-ink-faint mt-0.5">테넌트 기본 설정</p>
          </div>
        </div>

        <label className="block mb-2 text-[10.5px] font-bold tracking-[.08em] uppercase text-ink-faint">
          테넌트 ID
        </label>
        <div className="mb-5">
          <input
            type="text"
            readOnly
            value={tenantId}
            className="neu-input w-full rounded-xl bg-base px-4 py-3 font-mono text-sm text-ink-faint cursor-default"
          />
        </div>

        <label className="block mb-2 text-[10.5px] font-bold tracking-[.08em] uppercase text-ink-faint">
          브랜드명
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tenantNameInput}
            onChange={e => setTenantNameInput(e.target.value)}
            placeholder="회사 또는 브랜드 이름"
            className="neu-input flex-1 rounded-xl bg-base px-4 py-3 text-sm text-ink"
          />
          <button
            onClick={handleSave}
            className="neu-btn-accent shrink-0 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all"
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

      {/* Preview Card */}
      <section className="bg-base neu-raised rounded-2xl p-6">
        <p className="mb-4 text-[10.5px] font-bold tracking-[.08em] uppercase text-ink-faint">
          미리보기
        </p>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-base neu-raised-sm text-sm font-bold text-violet">
            {tenantNameInput.charAt(0).toUpperCase() || 'W'}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{tenantNameInput || '브랜드명'}</p>
            <p className="text-xs text-ink-faint">{tenantId}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('api');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'api', label: 'API Key' },
    { key: 'workspace', label: 'workspace' },
  ];

  return (
    <div className="flex justify-center px-6 py-10">
      <div className="w-full max-w-xl flex flex-col gap-5">
        {/* Tab switcher */}
        <div className="flex rounded-2xl bg-base neu-inset p-1 gap-1">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === key
                  ? 'bg-base neu-raised text-ink'
                  : 'text-ink-faint hover:text-ink-dim'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'api' ? <ApiTab /> : <WorkspaceTab />}
      </div>
    </div>
  );
}
