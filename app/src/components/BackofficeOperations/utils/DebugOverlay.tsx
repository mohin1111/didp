import { useState, useEffect, useCallback, useRef } from 'react';
import { Bug, Copy, Code, X, Eye, EyeOff } from 'lucide-react';

interface ElementInfo {
  tagName: string;
  id: string;
  className: string;
  textContent: string;
  rect: DOMRect;
  attributes: { name: string; value: string }[];
  xpath: string;
  selector: string;
  reactComponent?: string;
}

function getXPath(element: Element): string {
  if (element.id) return `//*[@id="${element.id}"]`;
  if (element === document.body) return '/html/body';

  let ix = 0;
  const siblings = element.parentNode?.children || [];
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element) {
      const parentPath = element.parentElement ? getXPath(element.parentElement) : '';
      return `${parentPath}/${element.tagName.toLowerCase()}[${ix + 1}]`;
    }
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      ix++;
    }
  }
  return '';
}

function getSelector(element: Element): string {
  if (element.id) return `#${element.id}`;

  let selector = element.tagName.toLowerCase();
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.split(' ').filter(c => c.trim() && !c.includes(':'));
    if (classes.length > 0) {
      selector += '.' + classes.slice(0, 2).join('.');
    }
  }
  return selector;
}

function getReactComponentName(element: Element): string | undefined {
  // Try to find React fiber
  const keys = Object.keys(element);
  const fiberKey = keys.find(key => key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$'));
  if (fiberKey) {
    try {
      const fiber = (element as any)[fiberKey];
      let current = fiber;
      while (current) {
        if (current.type && typeof current.type === 'function') {
          return current.type.displayName || current.type.name || 'Anonymous';
        }
        if (current.type && typeof current.type === 'object' && current.type.displayName) {
          return current.type.displayName;
        }
        current = current.return;
      }
    } catch (e) {
      // Ignore errors
    }
  }
  return undefined;
}

function getElementInfo(element: Element): ElementInfo {
  const rect = element.getBoundingClientRect();
  const attributes: { name: string; value: string }[] = [];

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    if (attr.name !== 'class' && attr.name !== 'style') {
      attributes.push({ name: attr.name, value: attr.value.slice(0, 100) });
    }
  }

  return {
    tagName: element.tagName.toLowerCase(),
    id: element.id,
    className: element.className?.toString() || '',
    textContent: (element.textContent || '').slice(0, 50).trim(),
    rect,
    attributes,
    xpath: getXPath(element),
    selector: getSelector(element),
    reactComponent: getReactComponentName(element),
  };
}

export default function DebugOverlay() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<ElementInfo | null>(null);
  const [pinnedElement, setPinnedElement] = useState<ElementInfo | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; info: ElementInfo } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
    setContextMenu(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle debug mode with Ctrl+Shift+D
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsEnabled(prev => !prev);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setContextMenu(null);
        setPinnedElement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      setHoveredElement(null);
      setPinnedElement(null);
      setContextMenu(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (contextMenu) return;

      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (target && !overlayRef.current?.contains(target)) {
        setHoveredElement(getElementInfo(target));
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (target && !overlayRef.current?.contains(target)) {
        e.preventDefault();
        const info = getElementInfo(target);
        setContextMenu({ x: e.clientX, y: e.clientY, info });
        setPinnedElement(info);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (contextMenu && !overlayRef.current?.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, [isEnabled, contextMenu]);

  const displayInfo = pinnedElement || hoveredElement;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`fixed bottom-4 right-4 z-[9999] p-3 rounded-full shadow-lg transition-all ${
          isEnabled
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
        }`}
        title="Toggle Debug Mode (Ctrl+Shift+D)"
      >
        <Bug size={20} />
      </button>

      {isEnabled && (
        <div ref={overlayRef} className="fixed inset-0 pointer-events-none z-[9998]">
          {/* Highlight Box */}
          {displayInfo && (
            <div
              className="absolute border-2 border-red-500 bg-red-500/10 pointer-events-none transition-all duration-75"
              style={{
                top: displayInfo.rect.top,
                left: displayInfo.rect.left,
                width: displayInfo.rect.width,
                height: displayInfo.rect.height,
              }}
            >
              {showLabels && (
                <div className="absolute -top-6 left-0 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                  {displayInfo.reactComponent || displayInfo.tagName}
                  {displayInfo.id && `#${displayInfo.id}`}
                </div>
              )}
            </div>
          )}

          {/* Info Panel */}
          {displayInfo && (
            <div className="fixed top-4 left-4 bg-slate-900/95 border border-slate-600 rounded-lg p-3 max-w-md pointer-events-auto shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code size={14} className="text-red-400" />
                  <span className="text-xs font-bold text-white">Element Inspector</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowLabels(!showLabels)}
                    className="p-1 hover:bg-slate-700 rounded text-slate-400"
                    title="Toggle Labels"
                  >
                    {showLabels ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                  <button
                    onClick={() => { setPinnedElement(null); setHoveredElement(null); }}
                    className="p-1 hover:bg-slate-700 rounded text-slate-400"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px]">
                {displayInfo.reactComponent && (
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400 font-medium">Component:</span>
                    <code className="text-purple-300 bg-purple-500/20 px-1 rounded">{displayInfo.reactComponent}</code>
                    <button onClick={() => copyToClipboard(displayInfo.reactComponent!, 'Component')} className="text-slate-500 hover:text-white">
                      <Copy size={10} />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-medium">Tag:</span>
                  <code className="text-blue-300">&lt;{displayInfo.tagName}&gt;</code>
                </div>

                {displayInfo.id && (
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-medium">ID:</span>
                    <code className="text-green-300">#{displayInfo.id}</code>
                    <button onClick={() => copyToClipboard(`#${displayInfo.id}`, 'ID')} className="text-slate-500 hover:text-white">
                      <Copy size={10} />
                    </button>
                  </div>
                )}

                {displayInfo.className && (
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-medium shrink-0">Classes:</span>
                    <code className="text-amber-300 text-[10px] break-all line-clamp-2">{displayInfo.className}</code>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-medium">Selector:</span>
                  <code className="text-cyan-300">{displayInfo.selector}</code>
                  <button onClick={() => copyToClipboard(displayInfo.selector, 'Selector')} className="text-slate-500 hover:text-white">
                    <Copy size={10} />
                  </button>
                </div>

                {displayInfo.textContent && (
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-medium shrink-0">Text:</span>
                    <span className="text-slate-300 truncate">{displayInfo.textContent}...</span>
                  </div>
                )}

                <div className="text-slate-500 text-[10px] pt-1 border-t border-slate-700 mt-2">
                  Size: {Math.round(displayInfo.rect.width)}×{Math.round(displayInfo.rect.height)} |
                  Pos: ({Math.round(displayInfo.rect.left)}, {Math.round(displayInfo.rect.top)})
                </div>
              </div>
            </div>
          )}

          {/* Context Menu */}
          {contextMenu && (
            <div
              className="fixed bg-slate-800 border border-slate-600 rounded-lg shadow-xl pointer-events-auto py-1 min-w-[200px]"
              style={{ top: contextMenu.y, left: contextMenu.x }}
            >
              <div className="px-3 py-1.5 text-[10px] text-slate-500 border-b border-slate-700">
                Copy Element Info
              </div>

              {contextMenu.info.reactComponent && (
                <button
                  onClick={() => copyToClipboard(contextMenu.info.reactComponent!, 'Component')}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-700 flex items-center gap-2"
                >
                  <Copy size={12} className="text-purple-400" />
                  <span>Component: <code className="text-purple-300">{contextMenu.info.reactComponent}</code></span>
                </button>
              )}

              <button
                onClick={() => copyToClipboard(contextMenu.info.selector, 'Selector')}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-700 flex items-center gap-2"
              >
                <Copy size={12} className="text-cyan-400" />
                <span>Selector: <code className="text-cyan-300">{contextMenu.info.selector}</code></span>
              </button>

              <button
                onClick={() => copyToClipboard(contextMenu.info.xpath, 'XPath')}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-700 flex items-center gap-2"
              >
                <Copy size={12} className="text-amber-400" />
                <span>XPath</span>
              </button>

              {contextMenu.info.className && (
                <button
                  onClick={() => copyToClipboard(contextMenu.info.className, 'Classes')}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-700 flex items-center gap-2"
                >
                  <Copy size={12} className="text-green-400" />
                  <span>All Classes</span>
                </button>
              )}

              <button
                onClick={() => {
                  const code = `<${contextMenu.info.tagName}${contextMenu.info.id ? ` id="${contextMenu.info.id}"` : ''}${contextMenu.info.className ? ` className="${contextMenu.info.className.split(' ').slice(0, 3).join(' ')}"` : ''}>`;
                  copyToClipboard(code, 'Element');
                }}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-700 flex items-center gap-2"
              >
                <Code size={12} className="text-blue-400" />
                <span>Element Code</span>
              </button>

              <button
                onClick={() => {
                  const playwrightCode = contextMenu.info.id
                    ? `page.locator('#${contextMenu.info.id}')`
                    : contextMenu.info.reactComponent
                    ? `page.getByRole('${contextMenu.info.tagName}', { name: '${contextMenu.info.textContent?.slice(0, 20) || ''}' })`
                    : `page.locator('${contextMenu.info.selector}')`;
                  copyToClipboard(playwrightCode, 'Playwright');
                }}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-700 flex items-center gap-2 border-t border-slate-700"
              >
                <Copy size={12} className="text-red-400" />
                <span>Playwright Locator</span>
              </button>
            </div>
          )}

          {/* Copied Toast */}
          {copied && (
            <div className="fixed bottom-20 right-4 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium pointer-events-auto animate-pulse">
              ✓ {copied} copied!
            </div>
          )}

          {/* Instructions */}
          <div className="fixed bottom-4 left-4 bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 pointer-events-auto text-[10px] text-slate-400">
            <span className="text-red-400 font-medium">Debug Mode ON</span> • Hover to inspect • Right-click to copy • Press <kbd className="bg-slate-700 px-1 rounded">Esc</kbd> to close
          </div>
        </div>
      )}
    </>
  );
}
