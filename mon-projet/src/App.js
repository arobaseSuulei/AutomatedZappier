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
                    const response = await fetch('/api/zapier', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(parsedData[0]), // ENVOIE UNE LIGNE (le premier objet du CSV)
                    });

                    if (response.ok) {
                        setMessage('✅ Données envoyées avec succès vers Zapier !');
                    } else {
                        setMessage('❌ Erreur lors de l\'envoi vers Zapier.');
                    }
                } catch (error) {
                    console.error('Erreur en envoyant vers Zapier:', error);
                    setMessage('❌ Erreur de connexion.');
                }
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
