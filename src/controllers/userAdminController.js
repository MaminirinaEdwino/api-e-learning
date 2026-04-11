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

            await userRepo.deactivateUser(userId);
            await journalRepo.logDeactivation(userId);
            res.json({
                message: "user deativate",
                id: userId
            });
        } catch (error) {
            console.error("Erreur désactivation :", error);
            res.status(500).send("Erreur lors de la désactivation de l'utilisateur." + error);
        }
    }

    /**
     * Alterne l'état actif/inactif d'un utilisateur
     */
    async toggleStatus(req, res) {
        try {
            const targetId = parseInt(req.params.id);
            const adminId = req.user.id;

            await userRepo.toggleActive(adminId, targetId);

            res.json({
                message: "user active"
            });
        } catch (error) {
            console.error("Erreur toggle status :", error);
            res.status(500).send("Erreur lors du changement de statut."+error);
        }
    }

    /**
     * Supprime définitivement un utilisateur
     */
    async deleteUser(req, res) {
        try {
            const id = parseInt(req.params.id);

            
            await userRepo.delete(id);
            res.json({
                message: "user deleted"
            });
        } catch (error) {
            console.error("Erreur suppression utilisateur :", error);
            res.status(500).send("Erreur lors de la suppression." + error);
        }
    }
}

module.exports = new UserAdminController();