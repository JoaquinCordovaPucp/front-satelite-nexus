import { useEffect, useRef, useState } from 'react';
import SkeletonStream from './SkeletonStream.jsx';


export default function Stream({ streamUrl }) {
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [retryToken, setRetryToken] = useState(0);
    const retryTimeoutRef = useRef(null);
    const loadTimeoutRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        setHasError(false);
        setRetryToken(0);

        if (retryTimeoutRef.current) {
            window.clearTimeout(retryTimeoutRef.current);
        }

        if (loadTimeoutRef.current) {
            window.clearTimeout(loadTimeoutRef.current);
        }

        loadTimeoutRef.current = window.setTimeout(() => {
            setHasError(true);
            setLoading(false);
        }, 8000);

        return () => {
            if (loadTimeoutRef.current) {
                window.clearTimeout(loadTimeoutRef.current);
            }
        };
    }, [streamUrl]);

    useEffect(() => {
        if (!hasError) {
            return;
        }

        retryTimeoutRef.current = window.setTimeout(() => {
            setRetryToken((current) => current + 1);
            setLoading(true);
            setHasError(false);
        }, 2000);

        return () => {
            if (retryTimeoutRef.current) {
                window.clearTimeout(retryTimeoutRef.current);
            }
        };
    }, [hasError]);

    useEffect(() => {
        return () => {
            if (retryTimeoutRef.current) {
                window.clearTimeout(retryTimeoutRef.current);
            }

            if (loadTimeoutRef.current) {
                window.clearTimeout(loadTimeoutRef.current);
            }
        };
    }, []);

    const resolvedStreamUrl = `${streamUrl}${streamUrl.includes("?") ? "&" : "?"}retry=${retryToken}`;

    return (
        <div className="w-full rounded-2xl border border-white/10 bg-slate-950/45 p-2 text-slate-100 shadow-[0_16px_50px_rgba(2,6,23,0.24)] backdrop-blur">
            <div className='text-white'>
                <h2 className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Link Status: {loading ? "Loading..." : "Live"}</h2>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/60">
                <img
                    key={resolvedStreamUrl}
                    src={resolvedStreamUrl}
                    alt="Stream en vivo"
                    onLoad={() => {
                        setLoading(false);
                        setHasError(false);

                        if (loadTimeoutRef.current) {
                            window.clearTimeout(loadTimeoutRef.current);
                        }

                        if (retryTimeoutRef.current) {
                            window.clearTimeout(retryTimeoutRef.current);
                        }
                    }}
                    onError={() => {
                        setLoading(false);
                        setHasError(true);

                        if (loadTimeoutRef.current) {
                            window.clearTimeout(loadTimeoutRef.current);
                        }
                    }}
                    className={`w-full ${loading ? "min-h-32 opacity-0" : "h-32 opacity-100"} object-cover transition-opacity duration-300`}
                />

                {loading && <div className="absolute inset-0"><SkeletonStream /></div>}

                {hasError && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/85 px-4 text-center text-sm text-slate-400">
                        No se pudo abrir el stream en {streamUrl}.
                    </div>
                )}
            </div>
        </div>
  );
}
