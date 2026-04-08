const journalRepo = require('../repositories/journalActiviteRepository');

class JournalController {

    /**
     * Marquer toutes les notifications comme lues
     */
    async markNotificationsRead(req, res) {
        try {
            req.session.notifications_read = true;
            
            await journalRepo.markRead();
            
            res.redirect('/admin/backoffice');
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur lors de la mise à jour des notifications.");
        }
    }

    /**
     * Liste filtrée et triée du journal d'activité
     */
    async listLogs(req, res) {
        try {
            // Récupération des paramètres de requête (Query Params)
            const search = req.query.search || '';
            const sort = req.query.sort || 'created_at';
            const order = req.query.order === 'desc' ? 'DESC' : 'ASC';

            const activites = await journalRepo.getFilterLog(search, sort, order);

            res.render('journal/list', {
                activites: activites,
                sort: sort,
                search: search,
                order: order.toLowerCase()
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur lors du chargement du journal.");
        }
    }

    /**
     * Suppression d'une entrée du journal
     */
    async deleteLog(req, res) {
        const { id } = req.params;

        try {
            await journalRepo.delete(id);
            res.redirect('/journal');
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur lors de la suppression du log.");
        }
    }
}

module.exports = new JournalController();