import { Leva, useControls } from 'leva';
import { useEffect, useMemo, useState } from 'react';
import CustomAnimation from './components/CustomAnimation';

interface AnimationSettings {
  size: number;
  horizontalSpacing: number;
  verticalSpacing: number;
  waveFrequency: number;
  waveAmplitude: number;
  randomnessFactor: number;
  numRows: number;
  numCols: number;
}

const DEFAULT_SETTINGS: AnimationSettings = {
  size: 100,
  horizontalSpacing: 40,
  verticalSpacing: 40,
  waveFrequency: 1000,
  waveAmplitude: 0.5,
  randomnessFactor: 0,
  numRows: 0,
  numCols: 0,
};

const parseNumberParam = (value: string | null): number | undefined => {
  if (value === null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

function App() {
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const isEmbed = searchParams.get('embed') === '1';
  const presetId = searchParams.get('p');
  const [presetSettings, setPresetSettings] = useState<AnimationSettings | null>(null);
  const urlSettings = useMemo<Partial<AnimationSettings>>(() => ({
    size: parseNumberParam(searchParams.get('size')),
    horizontalSpacing: parseNumberParam(searchParams.get('horizontalSpacing')),
    verticalSpacing: parseNumberParam(searchParams.get('verticalSpacing')),
    waveFrequency: parseNumberParam(searchParams.get('waveFrequency')),
    waveAmplitude: parseNumberParam(searchParams.get('waveAmplitude')),
    randomnessFactor: parseNumberParam(searchParams.get('randomnessFactor')),
    numRows: parseNumberParam(searchParams.get('numRows')),
    numCols: parseNumberParam(searchParams.get('numCols')),
  }), [searchParams]);

  useEffect(() => {
    if (!presetId) return;

    const loadPreset = async () => {
      try {
        const response = await fetch(`/presets/${presetId}.json`);
        if (!response.ok) return;
        const data = await response.json();
        if (!data?.settings) return;
        setPresetSettings({
          ...DEFAULT_SETTINGS,
          ...data.settings,
        });
      } catch {
        // Ignore preset loading errors and keep defaults.
      }
    };

    loadPreset();
  }, [presetId]);

  const { 
    size, 
    horizontalSpacing, 
    verticalSpacing,
    waveFrequency, 
    waveAmplitude, 
    randomnessFactor, 
    numRows, 
    numCols 
  } = useControls({
    size: { value: DEFAULT_SETTINGS.size, min: 20, max: 200, step: 1, label: 'size' },
    horizontalSpacing: { value: DEFAULT_SETTINGS.horizontalSpacing, min: 0, max: 80, step: 1, label: 'horizontalSpacing' },
    verticalSpacing: { value: DEFAULT_SETTINGS.verticalSpacing, min: 0, max: 80, step: 1, label: 'verticalSpacing' },
    waveFrequency: { value: DEFAULT_SETTINGS.waveFrequency, min: 100, max: 2000, step: 10, label: 'waveFrequency' },
    waveAmplitude: { value: DEFAULT_SETTINGS.waveAmplitude, min: 0, max: 1, step: 0.01, label: 'waveAmplitude' },
    randomnessFactor: { value: DEFAULT_SETTINGS.randomnessFactor, step: 0.01, label: 'randomnessFactor' },
    numRows: { value: DEFAULT_SETTINGS.numRows, min: 0, max: 50, step: 1, label: 'numRows' },
    numCols: { value: DEFAULT_SETTINGS.numCols, min: 0, max: 50, step: 1, label: 'numCols' },
  });

  const controlSettings: AnimationSettings = {
        size,
        horizontalSpacing,
        verticalSpacing,
        waveFrequency,
        waveAmplitude,
        randomnessFactor,
        numRows,
        numCols,
      };

  const embedBaseSettings = presetSettings ?? DEFAULT_SETTINGS;
  const effectiveSettings: AnimationSettings = isEmbed
    ? { ...embedBaseSettings, ...urlSettings }
    : controlSettings;

  const handleExportJson = () => {
    const animationConfig = {
      type: 'APP_PATRON_ANIMATION',
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: {
        size,
        horizontalSpacing,
        verticalSpacing,
        waveFrequency,
        waveAmplitude,
        randomnessFactor,
        numRows,
        numCols,
      },
    };

    const blob = new Blob([JSON.stringify(animationConfig, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.href = url;
    link.download = `app-patron-animation-${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyEmbedUrl = async () => {
    const params = new URLSearchParams({
      embed: '1',
      size: String(controlSettings.size),
      horizontalSpacing: String(controlSettings.horizontalSpacing),
      verticalSpacing: String(controlSettings.verticalSpacing),
      waveFrequency: String(controlSettings.waveFrequency),
      waveAmplitude: String(controlSettings.waveAmplitude),
      randomnessFactor: String(controlSettings.randomnessFactor),
      numRows: String(controlSettings.numRows),
      numCols: String(controlSettings.numCols),
    });
    const embedUrl = `${window.location.origin}/?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(embedUrl);
      window.alert('Embed URL copied');
    } catch {
      window.prompt('Copy this Embed URL:', embedUrl);
    }
  };

  return (
    <div>
      <Leva hidden={isEmbed} />
      {!isEmbed && (
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 9999,
            display: 'flex',
            gap: 8,
          }}
        >
          <button
            onClick={handleExportJson}
            style={{
              border: 'none',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              color: '#fff',
              background: '#ff5521',
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
            }}
          >
            Export JSON
          </button>
          <button
            onClick={handleCopyEmbedUrl}
            style={{
              border: 'none',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              color: '#fff',
              background: '#1d4ed8',
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
            }}
          >
            Copy Embed URL
          </button>
        </div>
      )}
      <CustomAnimation 
        size={effectiveSettings.size}
        horizontalSpacing={effectiveSettings.horizontalSpacing}
        verticalSpacing={effectiveSettings.verticalSpacing}
        waveFrequency={effectiveSettings.waveFrequency}
        waveAmplitude={effectiveSettings.waveAmplitude}
        randomnessFactor={effectiveSettings.randomnessFactor}
        numRows={effectiveSettings.numRows}
        numCols={effectiveSettings.numCols}
      />
    </div>
  )
}

export default App;
