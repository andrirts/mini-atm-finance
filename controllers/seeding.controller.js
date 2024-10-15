const Client = require("../models/client.model");
const clientSeeds = require("../seed/seedClient");

class SeedingController {
    static async seedClients(req, res, next) {
        await Client.bulkCreate(clientSeeds);
        return res.status(200).json({ message: 'Clients seeded successfully' })
    }
}

module.exports = SeedingController;