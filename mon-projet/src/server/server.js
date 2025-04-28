// server/server.js
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-to-zapier", async (req, res) => {
    try {
        const response = await axios.post(
            "https://hooks.zapier.com/hooks/catch/22649487/2pmy9jw/",
            req.body
        );
        res.status(200).send("Données envoyées à Zapier !");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Erreur lors de l'envoi à Zapier");
    }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Serveur en cours sur http://localhost:${PORT}`));
