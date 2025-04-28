import { useState } from "react";
import Papa from "papaparse";

export default function CSVUploader() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage("");
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Veuillez choisir un fichier CSV.");
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const parsedData = results.data;
                console.log(parsedData); // JSON des données

                try {
                    const response = await fetch("https://hooks.zapier.com/hooks/catch/22649487/2pmy9jw/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(parsedData),
                    });

                    if (!response.ok) {
                        throw new Error(`Erreur serveur: ${response.status}`);
                    }

                    setMessage("✅ Données envoyées avec succès !");
                } catch (error) {
                    console.error(error);
                    setMessage("Erreur lors de l'envoi des données.");
                }
            },
        });
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md flex flex-col space-y-4">
            <h1 className="text-2xl font-bold text-center">Uploader un CSV</h1>

            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="border p-2 rounded"
            />

            <button
                onClick={handleUpload}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
                Envoyer
            </button>

            {message && (
                <div className="text-center mt-4">
                    <p className="text-gray-700">{message}</p>
                </div>
            )}
        </div>
    );
}
