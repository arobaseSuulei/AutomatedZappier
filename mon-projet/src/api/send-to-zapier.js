import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Envoie des données vers Zapier
            const response = await fetch('https://hooks.zapier.com/hooks/catch/22649487/2pmy9jw/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body), // Les données envoyées depuis le frontend
            });

            if (!response.ok) {
                return res.status(500).json({ error: 'Erreur en envoyant les données vers Zapier' });
            }

            res.status(200).json({ message: 'Données envoyées avec succès' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    } else {
        res.status(405).json({ error: 'Méthode non autorisée' });
    }
}
