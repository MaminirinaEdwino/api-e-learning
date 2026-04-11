const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'public/uploads/lecons/';
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Nom unique : timestamp + nom original nettoyé
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtre pour accepter certains formats (optionnel)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.mp4', '.zip', '.txt', '.png', '.jpg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Format de fichier non supporté'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // Limite à 50 Mo
});

module.exports = upload;