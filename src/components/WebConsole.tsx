/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';

export function WebConsole() {
  const [logs, setLogs] = useState<string[]>([]);
  const logBuffer = useRef<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const captureLog = (type: string, args: any[]) => {
      const logStr = args
        .map((a) => {
          try {
            return typeof a === 'object' ? JSON.stringify(a) : String(a);
          } catch {
            return String(a);
          }
        })
        .join(' ');
      logBuffer.current.push(`[${type}] ${logStr}`);
    };

    console.log = (...args: any[]) => {
      captureLog('LOG', args);
      originalLog(...args);
    };
    console.warn = (...args: any[]) => {
      captureLog('WARN', args);
      originalWarn(...args);
    };
    console.error = (...args: any[]) => {
      captureLog('ERROR', args);
      originalError(...args);
    };

    const interval = setInterval(() => {
      if (logBuffer.current.length > 0) {
        setLogs((prev) => [...prev, ...logBuffer.current]);
        logBuffer.current = [];
      }
    }, 100);

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 left-0 w-full max-h-40 overflow-y-auto bg-black text-green-400 text-xs p-2 z-50 font-mono"
    >
      {logs.map((log, i) => (
        <div key={i}>{log}</div>
      ))}
    </div>
  );
}
