import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialisation de Supabase
const supabase = createClient(
    "https://pxyqknxfvimxdcmplbff.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4eXFrbnhmdmlteGRjbXBsYmZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzMDM4NjIsImV4cCI6MjA0NDg3OTg2Mn0.cuq3c8ejHCSky7BcV1qlj76_QYWcYXYiAbvDolxN6Uk"
);

export default function CSVStorageUploader() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
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

        setUploading(true);

        const filePath = `csv/${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from("zappier") // Bucket existant
            .upload(filePath, file, {
                cacheControl: "3600",
                contentType: "text/csv", // ⚡ Ajout pour éviter 400 Bad Request
                upsert: false, // Facultatif : empêcher l'écrasement
            });

        if (error) {
            console.error(error);
            setMessage("Erreur : " + error.message);
        } else {
            console.log(data);
            setMessage("✅ Fichier uploadé avec succès !");
        }

        setUploading(false);
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
                disabled={uploading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
            >
                {uploading ? "Upload en cours..." : "Uploader"}
            </button>

            {message && (
                <div className="text-center mt-4">
                    <p className="text-gray-700">{message}</p>
                </div>
            )}
        </div>
    );
}
