const { Op, literal } = require('sequelize');
const { Formateur, JournalActivite } = require('../models/index');

class FormateurRepositories {

    // Équivalent de Insert
    async insert(data) {
        return await Formateur.create(data);
    }

    // Équivalent de GetAll
    async getAll() {
        return await Formateur.findAll();
    }

    // Équivalent de GetById
    async getById(id) {
        return await Formateur.findByPk(id);
    }

    // Équivalent de CheckCode (Vérification email et code d'entrée)
    async checkCode(email, entryCode) {
        return await Formateur.findOne({
            where: {
                email: email, // Case-insensitive
                code_entree: entryCode
            }
        });
    }

    // Équivalent de CheckFormateur (Vérifie si le compte est activé avec un mot de passe)
    async checkFormateurActive(email) {
        return await Formateur.findOne({
            where: {
                email: email,
                password: { [Op.ne]: null }
            }
        });
    }

    // Équivalent de ResetCodeStmt (Finalisation de l'inscription/Reset)
    async resetCodeAndActivate(email, nom_prenom, hashedPassword) {
        console.log(hashedPassword, "hash")
        return await Formateur.update({
            nom_prenom: nom_prenom,
            password: hashedPassword,
            statut: 'en_attente',
            code_entree: null
        }, {
            where:  {
                email: email
            }
        });
    }

    // Équivalent de Update
    async update(id, data) {
        return await Formateur.update(data, {
            where: { id: id }
        });
    }

    // Équivalent de Delete
    async delete(id) {
        return await Formateur.destroy({
            where: { id: id }
        });
    }

    // Équivalent de GetForAuth (Récupération des infos de connexion)
    async getForAuth(email) {
        const formateur = await Formateur.findOne({
            where: {
                email: email,
                password: { [Op.ne]: null }
            },
            attributes: ['id', 'email', 'password', 'nom_prenom']
        });
        return formateur ? formateur.toJSON() : null;
    }

    // Équivalent de GetNewFormateur (Statistiques : inscrits dernières 24h)
    async getNewFormateursCount() {
        return await Formateur.count({
            where: {
                created_at: {
                    [Op.gte]: literal('NOW() - INTERVAL 1 DAY')
                }
            }
        });
    }

    // Équivalent de CountFormateur
    async countAll() {
        return await Formateur.count();
    }

    // Équivalent de GetForamteurGestionUser (Recherche et tri dynamique)
    async getForAdmin(search, sortColumn = 'nom_prenom', order = 'ASC') {
        const queryOptions = {
            order: [[sortColumn, order]],
            raw: true
        };

        if (search) {
            queryOptions.where = {
                [Op.or]: [
                    { nom_prenom: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        return await Formateur.findAll(queryOptions);
    }

    // Équivalent de UpdateStatus (avec journalisation intégrée)
    async updateStatus(id, statut, admin_id) {
        // On utilise une transaction pour s'assurer que les deux écritures réussissent
        const result = await Formateur.update({ statut }, { where: { id } });

        await JournalActivite.create({
            admin_id: admin_id,
            action: 'Mise à jour statut formateur',
            details: `Formateur ID: ${id}, Statut: ${statut}`
        });

        return result;
    }

    // Équivalent de UpdateCode
    async updateEntryCode(id, code) {
        return await Formateur.update(
            { code_entree: code },
            { where: { id: id } }
        );
    }
    async countFormateur() {
        try {
            const count = await Formateur.count();

            return count;
        } catch (error) {
            console.error("Erreur lors du comptage des apprenants :", error);
            throw error;
        }
    }
}

module.exports = new FormateurRepositories();