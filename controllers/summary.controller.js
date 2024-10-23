const sequelize = require("../config/database");
const ExcelHelper = require("../helper/excelHelper");
const GoogleApi = require("../helper/googleApi");
const Client = require("../models/client.model");
const Summary = require("../models/summary.model")

class SummaryController {
    static async postSummary(req, res, next) {
        const file = req.file;

        const datas = await ExcelHelper.convertExcelDataToArray(file);

        const plainSummary = await ExcelHelper.createInterfaceSummary(datas);
        const summaries = (await Summary.bulkCreate(plainSummary)).map(summary => summary.get({ plain: true }));
        const clients = await ExcelHelper.getClients();
        for (const summary of summaries) {
            const client = clients.find(client => client.id === summary.client_id);
            if (!client) {
                throw new Error('Client not found');
            }
            summary.clientName = client.name;
            summary.typeTrans = client.type_trans;
        }
        await GoogleApi.insertExcel(summaries);
        return res.status(200).json({ message: 'Summary created successfully' });
    }

    static async getSummary(req, res, next) {
        if (isNaN(+req.query.startBatch) || (isNaN(+req.query.endBatch))) {
            throw new Error('startBatch and endBatch must be numbers');
        }
        const summary = await ExcelHelper.getSummary(req.query.startBatch, req.query.endBatch);
        const writeToExcel = await ExcelHelper.writeSummaryToExcel(summary);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=summary.xlsx');
        return res.status(200).send(writeToExcel);
    }

    static async getDetailSummary(req, res, next) {
        if (isNaN(+req.query.startBatch) || (isNaN(+req.query.endBatch))) {
            throw new Error('startBatch and endBatch must be numbers');
        }
        const summaries = await ExcelHelper.getDetailSummary(req.query.startBatch, req.query.endBatch);
        const clients = await ExcelHelper.getDistinctClients();
        const clientSummaries = ExcelHelper.detailClientsSummary(summaries, clients);
        const listPartners = await ExcelHelper.getPartners();
        const columnPartners = ExcelHelper.getSummaryColumnPartners(listPartners);
        const partnerSummaries = ExcelHelper.detailPartnersSummary(clientSummaries, columnPartners);
        const writeToExcel = await ExcelHelper.writeDetailSummaryToExcel(clientSummaries, partnerSummaries);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=detailsummary.xlsx');
        return res.status(200).send(writeToExcel);

    }
}

module.exports = SummaryController