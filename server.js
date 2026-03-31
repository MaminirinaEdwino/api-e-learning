const express = require('express');
const sequelize = require('./src/config/database');

const app = express();

// ... vos routes ...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});