const { literal } = require('sequelize');
const Post = require('../models/posts.model');
const Utilisateur = require('../models/Utilisateur');
const Formateur = require('../models/Formateur');

class PostRepository {

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
                model: Utilisateur,
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
        return await Post.findAll({
            where: { forum_id: forumId },
            attributes: [
                'id', 'contenu', 'date_post',
                [literal('COALESCE("Utilisateur->Formateur"."nom_prenom", "Utilisateur"."nom")'), 'auteur_nom'],
                [literal('CASE WHEN "Utilisateur->Formateur"."id" IS NOT NULL THEN 1 ELSE 0 END'), 'is_formateur']
            ],
            include: [{
                model: Utilisateur,
                attributes: [],
                include: [{
                    model: Formateur,
                    attributes: [],
                    on: literal('"Utilisateur"."email" = "Utilisateur->Formateur"."email"')
                }]
            }],
            order: [['date_post', 'ASC']],
            raw: true
        });
    }
}

module.exports = new PostRepository();