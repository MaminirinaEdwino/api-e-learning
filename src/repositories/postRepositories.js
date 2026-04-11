const { literal } = require('sequelize');

const { Post, User, Formateur } = require('../models/index')
class PostRepositories {

    /**
     * Équivalent de Insert
     */
    async insert(data) {
        return await Post.create({
            auteur_id: data.auteur_id,
            forum_id: data.forum_id,
            contenu: data.contenu
        });
    }

    /**
     * Équivalent de GetAll
     */
    async getAll() {
        return await Post.findAll();
    }

    /**
     * Équivalent de GetById
     */
    async getById(id) {
        return await Post.findByPk(id);
    }

    /**
     * Équivalent de Update
     */
    async update(id, data) {
        return await Post.update({
            auteur_id: data.auteur_id,
            forum_id: data.forum_id,
            contenu: data.contenu
        }, {
            where: { id: id }
        });
    }

    /**
     * Équivalent de Delete
     */
    async delete(id) {
        return await Post.destroy({
            where: { id: id }
        });
    }

    /**
     * Équivalent de GetPostByForumUser
     * Récupère les messages d'un forum avec indicateurs (est-ce moi ? est-ce un formateur ?)
     */
    async getPostByForumUser(currentUserId, forumId) {
        try {
            const posts = await Post.findAll({
                where: { forum_id: forumId },
                include: [{
                    model: User, // Vérifie que c'est bien l'alias dans ton index.js
                    include: [{
                        model: Formateur,
                        as: 'infosFormateur', // Alias défini dans tes associations
                        required: false // LEFT JOIN
                    }]
                }],
                order: [['date_post', 'ASC']]
            });

            // On transforme les résultats pour retrouver tes colonnes personnalisées
            return posts.map(p => {
                const user = p.Utilisateur;
                const formateur = user ? user.infosFormateur : null;

                return {
                    id: p.id,
                    contenu: p.contenu,
                    date_post: p.date_post,
                    auteur_id: p.auteur_id,
                    // Équivalent de COALESCE(f.nom_prenom, u.nom)
                    auteur_nom: formateur && formateur.nom_prenom ? formateur.nom_prenom : (user ? user.nom : 'Anonyme'),
                    // Équivalent de CASE WHEN auteur_id = currentUserId
                    is_self: p.auteur_id === parseInt(currentUserId) ? 1 : 0,
                    // Équivalent de CASE WHEN f.id IS NOT NULL
                    is_formateur: formateur ? 1 : 0
                };
            });

        } catch (error) {
            console.error("Erreur dans getPostByForumUser :", error);
            throw error;
        }
    }

    /**
     * Équivalent de GetPostFormateurIndicator
     */
    async getPostFormateurIndicator(forumId) {
        try {
            const posts = await Post.findAll({
                where: { forum_id: forumId },
                include: [{
                    model: User,
                    include: [{
                        model: Formateur,
                        as: 'infosFormateur', // L'alias défini plus haut
                        required: false // Force le LEFT JOIN
                    }]
                }],
                order: [['date_post', 'ASC']]
            });

            // On formate les données en sortie pour retrouver la structure PHP
            return posts.map(p => {
                const user = p.User;
                const formateur = user ? user.infosFormateur : null;

                return {
                    id: p.id,
                    contenu: p.contenu,
                    date_post: p.date_post,
                    // COALESCE(f.nom_prenom, u.nom)
                    auteur_nom: formateur ? formateur.nom_prenom : (user ? user.nom : 'Anonyme'),
                    // CASE WHEN f.id IS NOT NULL
                    is_formateur: formateur ? 1 : 0
                };
            });

        } catch (error) {
            console.error("Erreur dans getPostFormateurIndicator :", error);
            throw error;
        }
    }
}

module.exports = new PostRepositories();