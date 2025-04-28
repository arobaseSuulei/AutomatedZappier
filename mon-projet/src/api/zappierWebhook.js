// api/zapierWebhook.js
module.exports = async (req, res) => {
    // Vérifie si la méthode est POST
    if (req.method === 'POST') {
        try {
            // Envoie les données à Zapier via son webhook
            const response = await fetch('https://hooks.zapier.com/hooks/catch/22649487/2pmy9jw/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body), // Envoie les données JSON du frontend
            });

            if (response.ok) {
                return res.status(200).json({ message: 'Données envoyées avec succès à Zapier' });
            } else {
                return res.status(400).json({ message: 'Erreur de Zapier' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Erreur serveur' });
        }
    } else {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }
};
