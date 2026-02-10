
export default function Titular({MET}) {
    return(
        <div className="flex flex-col w-full items-center px-4 py-2 bg-slate-700">
            <img />
            <h1 className="text-2xl font-bold">Nexus Space 📡</h1>
            <p className="text-xl">Fecha: {new Date().toLocaleDateString()}</p>
            <p className="text-xl">Hora: {new Date().toLocaleTimeString()}</p>
            <p className="text-xl">MET: {MET}</p>
        </div>
    )
}

