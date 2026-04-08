const userRepo = require('../repositories/utilisateurRepositories');
const journalRepo = require('../repositories/journalActiviteRepositories');

class UserAdminController {
    /**
     * Désactive un utilisateur et log l'action
     */
    async deactivate(req, res) {
        try {
            const userId = parseInt(req.body.deactivate_user_id);
            
            // Vérification de l'existence de la colonne 'active' avant modification
            const hasActiveColumn = await userRepo.hasActiveCol();
            
            if (hasActiveColumn) {
                await userRepo.deactiveUser(userId);
                await journalRepo.deactivateUser(userId);
            }

            res.redirect('/admin/backoffice');
        } catch (error) {
            console.error("Erreur désactivation :", error);
            res.status(500).send("Erreur lors de la désactivation de l'utilisateur.");
        }
    }

    /**
     * Alterne l'état actif/inactif d'un utilisateur
     */
    async toggleStatus(req, res) {
        try {
            const targetId = parseInt(req.params.id);
            const adminId = req.session.user_id;

            await userRepo.toggleActive(adminId, targetId);
            
            res.redirect('/admin/gestionuser');
        } catch (error) {
            console.error("Erreur toggle status :", error);
            res.status(500).send("Erreur lors du changement de statut.");
        }
    }

    /**
     * Supprime définitivement un utilisateur
     */
    async deleteUser(req, res) {
        try {
            const id = parseInt(req.params.id);
            const user = await userRepo.getById(id);
            
            if (user) {
                await userRepo.delete(id);
            }
            
            res.redirect('/admin/gestionuser');
        } catch (error) {
            console.error("Erreur suppression utilisateur :", error);
            res.status(500).send("Erreur lors de la suppression.");
        }
    }
}

module.exports = new UserAdminController();