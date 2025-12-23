import Logs from "./Logs.jsx";
export default function CommandPannel() {
    return(
        <div className="w-full border border-amber-300 p-2">
            <h2 className="text-center font-bold mb-2">Command Pannel</h2>
            <div class="flex flex-col gap-4">
                <button class="bg-amber-500 text-white font-bold py-2 px-4 rounded hover:bg-amber-600">
                    Comando 1
                </button>
                <button class="bg-amber-500 text-white font-bold py-2 px-4 rounded hover:bg-amber-600">
                    Comando 2
                </button>
                <button class="bg-amber-500 text-white font-bold py-2 px-4 rounded hover:bg-amber-600">
                    Comando 3
                </button>
            </div>
            <Logs />
        </div>
    )
}