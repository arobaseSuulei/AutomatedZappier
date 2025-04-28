import React, { useState } from 'react';
import Papa from 'papaparse';

function App() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
    };

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
                    // Envoie les données au webhook Zapier
                    const webhookUrl = 'https://hooks.zapier.com/hooks/catch/22649487/2pmy9jw/'; // Remplace cette URL par ton URL Zapier

                    const response = await fetch(webhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(parsedData), // Envoie le tableau complet des données
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
        <div className="App">
            <h1>Uploader un fichier CSV pour l'envoi d'emails</h1>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
            />
            <button onClick={handleUpload}>Traiter et Envoyer</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default App;
