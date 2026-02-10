import { useState } from 'react';
import SkeletonStream from './SkeletonStream.jsx';


export default function Stream({ streamUrl }) {
    const [loading, setLoading] = useState(true);

    return (
        <div className="w-full border border-slate-600 p-2">
            <div className='text-white'>
                <h2 className="text-center font-bold mb-2">Link Status: {loading ? "Loading..." : "Live"}</h2>
            </div>
            <img
            src={streamUrl}
            onLoad={() => setLoading(false)}
            className={`w-full ${loading ? "h-0" : "h-64"} rounded-lg`}
            />

            {loading && <SkeletonStream />}
        </div>
  );
}
