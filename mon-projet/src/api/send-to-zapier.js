import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await fetch('https://hooks.zapier.com/hooks/catch/22649487/2pmy9jw/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body),
            });

            if (!response.ok) {
                return res.status(500).json({ error: 'Erreur en envoyant les données vers Zapier' });
            }

            res.status(200).json({ message: 'Données envoyées avec succès' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    } else {
        // ✅ AJOUTE CETTE LIGNE
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
