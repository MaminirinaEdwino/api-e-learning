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
        return await Post.findAll({
            where: { forum_id: forumId },
            attributes: {
                include: [
                    // COALESCE(f.nom_prenom, u.nom) AS auteur_nom
                    [literal('COALESCE("Utilisateur->Formateur"."nom_prenom", "Utilisateur"."nom")'), 'auteur_nom'],
                    // CASE WHEN p.auteur_id = ? THEN 1 ELSE 0 END AS is_self
                    [literal(`CASE WHEN "Post"."auteur_id" = ${currentUserId} THEN 1 ELSE 0 END`), 'is_self'],
                    // CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END AS is_formateur
                    [literal('CASE WHEN "Utilisateur->Formateur"."id" IS NOT NULL THEN 1 ELSE 0 END'), 'is_formateur']
                ]
            },
            include: [{
                model: User,
                attributes: [], // On ne veut pas les colonnes brutes de l'user ici
                include: [{
                    model: Formateur,
                    attributes: [],
                    // On simule le JOIN u.email = f.email
                    on: literal('"Utilisateur"."email" = "Utilisateur->Formateur"."email"')
                }]
            }],
            order: [['date_post', 'ASC']],
            raw: true
        });
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