'use client';

import { ExternalLink, Eye, EyeOff, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { Path } from '@/constants/path.constants';
import { N } from '@/constants/theme.constants';
import { useAuth } from '@/contexts/AuthContext';

const raised = `9px 9px 18px ${N.dark}, -9px -9px 18px ${N.light}`;
const raisedSm = `5px 5px 10px ${N.dark}, -5px -5px 10px ${N.light}`;
const inset = `inset 4px 4px 9px ${N.dark}, inset -4px -4px 9px ${N.light}`;
const pressed = `inset 3px 3px 7px ${N.dark}, inset -3px -3px 7px ${N.light}`;

export default function AuthPage() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [btnDown, setBtnDown] = useState(false);
  const [eyeDown, setEyeDown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (!apiKey.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      await login(apiKey);
      router.push(Path.DASHBOARD);
    } catch {
      setError('API 키가 유효하지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      {/* Page */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: N.base,
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Card */}
        <div
          className='animate-fade-up'
          style={{
            width: '100%',
            maxWidth: '380px',
            background: N.base,
            borderRadius: '32px',
            padding: '52px 40px 44px',
            boxShadow: raised,
            position: 'relative',
          }}
        >
          {/* Title */}
          <h1
            style={{
              textAlign: 'center',
              fontSize: '22px',
              fontWeight: '700',
              color: N.ink,
              marginBottom: '8px',
              letterSpacing: '-0.4px',
            }}
          >
            API 키 인증
          </h1>
          <p
            style={{
              textAlign: 'center',
              fontSize: '13px',
              color: N.inkDim,
              lineHeight: '1.75',
              marginBottom: '36px',
            }}
          >
            Anthropic Claude API 키를 입력하면
            <br />
            에이전트 팀을 바로 사용할 수 있습니다.
          </p>

          {/* Input field */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '10.5px',
                fontWeight: '700',
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                color: N.inkFaint,
                marginBottom: '10px',
              }}
            >
              Claude API Key
            </label>
            <div style={{ position: 'relative' }}>
              <input
                ref={inputRef}
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder='sk-ant-api03-...'
                style={{
                  width: '100%',
                  padding: '14px 46px 14px 18px',
                  borderRadius: '16px',
                  border: 'none',
                  outline: 'none',
                  background: N.base,
                  boxShadow: inputFocused
                    ? `${inset}, 0 0 0 2px ${N.accentGlow}`
                    : inset,
                  fontSize: '13px',
                  color: N.ink,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'box-shadow .2s ease',
                  caretColor: N.accent,
                }}
              />
              {/* Eye toggle */}
              <button
                type='button'
                onMouseDown={() => setEyeDown(true)}
                onMouseUp={() => setEyeDown(false)}
                onMouseLeave={() => setEyeDown(false)}
                onClick={() => setShowKey(v => !v)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '30px',
                  height: '30px',
                  borderRadius: '9px',
                  background: N.base,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: showKey ? N.accent : N.inkFaint,
                  boxShadow: eyeDown ? pressed : raisedSm,
                  transition: 'box-shadow .15s ease, color .15s ease',
                }}
                aria-label={showKey ? '키 숨기기' : '키 보기'}
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                fontSize: '12px',
                color: '#ef4444',
                textAlign: 'center',
                marginBottom: '12px',
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            disabled={isLoading}
            onMouseDown={() => setBtnDown(true)}
            onMouseUp={() => setBtnDown(false)}
            onMouseLeave={() => setBtnDown(false)}
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '16px',
              border: 'none',
              background: `linear-gradient(135deg, ${N.accent}, ${N.accentHover})`,
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: 'inherit',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              letterSpacing: '.02em',
              marginBottom: '28px',
              boxShadow: btnDown
                ? `inset 2px 2px 6px rgba(0,0,0,.25), inset -1px -1px 3px rgba(255,255,255,.1)`
                : `5px 5px 12px ${N.dark}, -3px -3px 8px ${N.light}, 0 4px 20px ${N.accentGlow}`,
              transform: btnDown ? 'scale(0.985)' : 'scale(1)',
              transition: 'box-shadow .15s ease, transform .1s ease',
            }}
          >
            {isLoading ? '인증 중...' : '인증하고 시작하기 →'}
          </button>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: `linear-gradient(to right, transparent, ${N.dark}60, transparent)`,
              marginBottom: '22px',
            }}
          />

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <a
              href='https://console.anthropic.com/settings/keys'
              target='_blank'
              rel='noreferrer'
              className='text-ink-faint hover:text-violet flex cursor-pointer items-center gap-[5px] text-[11px] font-semibold tracking-[.04em] no-underline transition-colors duration-200'
            >
              <ExternalLink size={11} />
              API 키 발급받기
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
