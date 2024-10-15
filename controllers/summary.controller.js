const sequelize = require("../config/database");
const ExcelHelper = require("../helper/excelHelper");
const Client = require("../models/client.model");
const Summary = require("../models/summary.model")

class SummaryController {
    static async postSummary(req, res, next) {
        const file = req.file;

        const datas = await ExcelHelper.convertExcelDataToArray(file);

        const summary = await ExcelHelper.createInterfaceSummary(datas);
        await Summary.bulkCreate(summary);
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
        // for (const client of clientSummaries) {
        //     for (const columnName of Object.keys(client)) {
        //         for (const columnPartner of Object.keys(columnPartners)) {
        //             for (const columnSummary of columnPartners[columnPartner]) {
        //                 if (columnName === columnSummary) {
        //                     if (!partnerSummaries[columnPartner]) {
        //                         partnerSummaries[columnPartner] = {};
        //                         partnerSummaries[columnPartner][columnName] = 0;
        //                     }
        //                     if (!partnerSummaries[columnPartner][columnName]) {
        //                         partnerSummaries[columnPartner][columnName] = 0
        //                     }
        //                     partnerSummaries[columnPartner][columnName] += +client[columnName];
        //                 }
        //             }
        //         }
        //     }
        // }

        return res.status(200).json(partnerSummaries);
    }
}

module.exports = SummaryController