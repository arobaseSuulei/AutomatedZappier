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

                // Log des données dans la console avant d'envoyer au backend
                console.log('Données JSON extraites :', parsedData);

                // Envoi des données au backend (tu peux commenter cette partie pour tester)
                /* const response = await fetch('/api/send-to-zapier', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: parsedData }),
                });

                if (response.ok) {
                    setMessage('✅ Données envoyées avec succès !');
                } else {
                    setMessage('Erreur lors de l\'envoi des données.');
                } */

                // Si les données sont correctement affichées, on peut passer à l'étape suivante
                setMessage('✅ Données extraites avec succès et affichées dans la console.');
            },
        });
    };

    return (
        <div className="App">
            <h1>Uploader un fichier CSV</h1>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
            />
            <button onClick={handleUpload}>Envoyer</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default App;
