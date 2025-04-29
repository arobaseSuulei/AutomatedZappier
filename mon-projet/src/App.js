import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

function App() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
    };

    useEffect(() => {
        document.title = "Automated";
    }, []);

    const handleUpload = async () => {
        if (!file) {
            setMessage('Veuillez choisir un fichier CSV.');
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
                        setMessage('✅ Données envoyées avec succès pour traitement !');
                    } else {
                        const errorData = await response.json();
                        console.error('Erreur lors de l\'envoi à Zapier:', errorData);
                        setMessage(`❌ Erreur lors de l'envoi des données. Détails: ${errorData.message || 'Erreur inconnue'}`);
                    }
                } catch (error) {
                    console.error('Erreur de connexion à Zapier:', error);
                    setMessage('❌ Erreur de connexion à Zapier.');
                }
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
            <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-center">
                <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                    Uploader un fichier CSV
                </h1>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="mb-4 w-full text-sm text-gray-600
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-[#f9e0fa] file:text-[#c10dc1]
               hover:file:bg-[#f3c9f7]"
                />

                <button
                    style={{backgroundColor: '#c10dc1'}}
                    onClick={handleUpload}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                    Envoyer
                </button>
                {message && (
                    <p className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default App;
