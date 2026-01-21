import { useState } from 'react';
import SkeletonStream from './SkeletonStream.jsx';


export default function Stream({ streamUrl }) {
    const [loading, setLoading] = useState(true);

    return (
        <div className="w-full border border-amber-300 p-2 rounded-lg">
            <div>
                <h2 className="text-center font-bold mb-2">Link Status: {loading ? "Loading..." : "Live"}</h2>
            </div>
            <img
            src={streamUrl}
            onLoad={() => setLoading(false)}
            className='w-full h-64 border border-amber-500 rounded-lg'
            />

            {loading && <SkeletonStream />}
        </div>
  );
}
