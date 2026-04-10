const { Contact } = require('../models/index');

class ContactRepositories {

    // Équivalent de Insert
    async insert(data) {
        // data peut être un objet contenant nom, email, sujet, message
        return await Contact.create({
            nom: data.nom,
            email: data.email,
            sujet: data.sujet,
            message: data.message
        });
    }

    // Équivalent de GetAll
    async getAll() {
        return await Contact.findAll({
            order: [['created_at', 'DESC']] // Optionnel : trier par date
        });
    }

    // Équivalent de GetById
    async getById(id) {
        return await Contact.findByPk(id);
    }

    // Équivalent de Update
    async update(id, data) {
        return await Contact.update({
            nom: data.nom,
            email: data.email,
            sujet: data.sujet,
            message: data.message
        }, {
            where: { id: id }
        });
    }

    // Équivalent de DeleteContact
    async delete(id) {
        return await Contact.destroy({
            where: { id: id }
        });
    }
}

module.exports = new ContactRepositories();