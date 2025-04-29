import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud } from 'lucide-react';

function App() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        document.title = "Automated";
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('📂 Veuillez choisir un fichier CSV.');
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const parsedData = results.data;
                console.log('Données JSON extraites :', parsedData);

                try {
                    const webhookUrl = 'https://hkdk.events/x9vpsp029sg4w7';

                    const response = await fetch(webhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(parsedData),
                    });

                    if (response.ok) {
                        setMessage('✅ Données envoyées avec succès !');
                    } else {
                        const errorData = await response.json();
                        setMessage(`❌ Erreur : ${errorData.message || 'Erreur inconnue'}`);
                    }
                } catch (error) {
                    setMessage('❌ Erreur de connexion.');
                }
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center space-y-6">
                <div className="flex flex-col items-center gap-2">
                    <UploadCloud size={42} className="text-[#c10dc1]" />
                    <h1 className="text-2xl font-bold text-gray-800">Importer votre fichier CSV</h1>
                    <p className="text-gray-500 text-sm">Envoyez votre fichier pour le traitement automatique de mails</p>
                </div>

                <div className="relative">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-600
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:font-semibold file:bg-[#f9e0fa] file:text-[#c10dc1]
                            hover:file:bg-[#f3c9f7]"
                    />
                    {file && (
                        <p className="text-xs text-gray-500 mt-2">
                            Fichier sélectionné : <span className="font-medium">{file.name}</span>
                        </p>
                    )}
                </div>

                <button
                    onClick={handleUpload}
                    className="w-full bg-[#c10dc1] hover:bg-[#a70ea7] text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                    📤 Envoyer
                </button>

                {message && (
                    <div className="text-sm mt-2 text-gray-700 bg-gray-100 rounded-lg py-2 px-4">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
