const ExcelJs = require('exceljs');
const Client = require('../models/client.model');
const fs = require('fs/promises');
const Summary = require('../models/summary.model');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Partner = require('../models/partner.model');

class ExcelHelper {

    static async convertExcelDataToArray(file) {
        const datas = [];
        const workbook = new ExcelJs.Workbook();
        await workbook.xlsx.readFile(file.path);
        const worksheet = workbook.getWorksheet(1);

        const headerRow = worksheet.getRow(1).values.slice(1);
        worksheet.eachRow(function (row, rowNumber) {
            if (rowNumber > 1) {
                const data = {};
                row.eachCell(function (cell, colNumber) {
                    const headerKey = headerRow[colNumber - 1];
                    data[headerKey] = cell.value;
                });
                datas.push(data);
            }
        });
        await fs.unlink(file.path);
        return datas;
    }

    static async createInterfaceSummary(arrayDatas) {
        const clients = await this.getClients();
        const storedUniqueDatas = [];
        for (const data of arrayDatas) {
            const codeTerminal = data['Terminal ID'].slice(0, 2);
            const typeTransaction = data['Type Trans'];
            const findClient = clients.find(client => client.code === codeTerminal && client.type_trans === typeTransaction);
            if (!findClient) {
                throw new Error(`Client with code ${codeTerminal} not found`);
            }
            const revenue_rts = +data['Acquiring Fee RTS']
            const dpp_revenue_rts = revenue_rts / 1.11;
            const ppn_revenue_rts = dpp_revenue_rts * 11 / 100;
            const pph_revenue_rts = dpp_revenue_rts * 2 / 100;
            const total_settlement_revenue_rts = dpp_revenue_rts + ppn_revenue_rts - pph_revenue_rts;
            const fee_rts = +findClient['acq_fee_rts'];
            const dpp_fee_rts = fee_rts / 1.11;
            const ppn_fee_rts = dpp_fee_rts * 11 / 100;
            const pph_fee_rts = dpp_fee_rts * 2 / 100;
            const total_settlement_fee_rts = dpp_fee_rts + ppn_fee_rts - pph_fee_rts;
            const fee_ndp = +findClient['acq_fee_ndp'];
            const dpp_fee_ndp = fee_ndp / 1.11;
            const ppn_fee_ndp = dpp_fee_ndp * 11 / 100;
            const pph_fee_ndp = dpp_fee_ndp * 2 / 100;
            const total_settlement_fee_ndp = dpp_fee_ndp + ppn_fee_ndp - pph_fee_ndp;
            const fee_ads = +findClient['acq_fee_ads'];
            const dpp_fee_ads = fee_ads / 1.11;
            const ppn_fee_ads = dpp_fee_ads * 11 / 100;
            const pph_fee_ads = dpp_fee_ads * 2 / 100;
            const total_settlement_fee_ads = dpp_fee_ads + ppn_fee_ads - pph_fee_ads;
            const fee_atmi = +findClient['acq_fee_atmi'];
            const dpp_fee_atmi = fee_atmi / 1.11;
            const ppn_fee_atmi = dpp_fee_atmi * 11 / 100;
            const pph_fee_atmi = dpp_fee_atmi * 2 / 100;
            const total_settlement_fee_atmi = dpp_fee_atmi + ppn_fee_atmi - pph_fee_atmi;
            const fee_client = +findClient['acq_fee_client'];
            const dpp_fee_client = fee_client / 1.11;
            const ppn_fee_client = dpp_fee_client * 11 / 100;
            const pph_fee_client = dpp_fee_client * 2 / 100;
            const total_fee_client = dpp_fee_client + ppn_fee_client - pph_fee_client;
            let amount_req_cashwithdrawal_client = 0;
            if (data['Type Trans'] === 'Cash Withdrawal') {
                amount_req_cashwithdrawal_client = +data['Amount Req']
            }
            const total_settlement_fee_client = total_fee_client + amount_req_cashwithdrawal_client;

            const uniqueData = {
                no_batch: data['Batch No.'],
                date: data['Date'],
                client_id: findClient.id,
                revenue_rts,
                dpp_revenue_rts,
                ppn_revenue_rts,
                pph_revenue_rts,
                total_settlement_revenue_rts,
                fee_rts,
                dpp_fee_rts,
                ppn_fee_rts,
                pph_fee_rts,
                total_settlement_fee_rts,
                fee_ndp,
                dpp_fee_ndp,
                ppn_fee_ndp,
                pph_fee_ndp,
                total_settlement_fee_ndp,
                fee_atmi,
                dpp_fee_atmi,
                ppn_fee_atmi,
                pph_fee_atmi,
                total_settlement_fee_atmi,
                fee_ads,
                dpp_fee_ads,
                ppn_fee_ads,
                pph_fee_ads,
                total_settlement_fee_ads,
                fee_client,
                dpp_fee_client,
                ppn_fee_client,
                pph_fee_client,
                total_fee_client,
                amount_req_cashwithdrawal_client,
                total_settlement_fee_client,
            };
            const findUniqueData = storedUniqueDatas.find(data => {
                return data.no_batch === uniqueData.no_batch && data.date === uniqueData.date && data.client_id === uniqueData.client_id;
            })
            if (!findUniqueData) {
                storedUniqueDatas.push(uniqueData);
            } else {
                findUniqueData.revenue_rts += +uniqueData.revenue_rts
                findUniqueData.dpp_revenue_rts += +uniqueData.dpp_revenue_rts
                findUniqueData.ppn_revenue_rts += +uniqueData.ppn_revenue_rts
                findUniqueData.pph_revenue_rts += +uniqueData.pph_revenue_rts
                findUniqueData.total_settlement_revenue_rts += +uniqueData.total_settlement_revenue_rts
                findUniqueData.fee_rts += +uniqueData.fee_rts
                findUniqueData.dpp_fee_rts += +uniqueData.dpp_fee_rts
                findUniqueData.ppn_fee_rts += +uniqueData.ppn_fee_rts
                findUniqueData.pph_fee_rts += +uniqueData.pph_fee_rts
                findUniqueData.total_settlement_fee_rts += +uniqueData.total_settlement_fee_rts
                findUniqueData.fee_ndp += +uniqueData.fee_ndp
                findUniqueData.dpp_fee_ndp += +uniqueData.dpp_fee_ndp
                findUniqueData.ppn_fee_ndp += +uniqueData.ppn_fee_ndp
                findUniqueData.pph_fee_ndp += +uniqueData.pph_fee_ndp
                findUniqueData.total_settlement_fee_ndp += +uniqueData.total_settlement_fee_ndp
                findUniqueData.fee_ads += +uniqueData.fee_ads
                findUniqueData.dpp_fee_ads += +uniqueData.dpp_fee_ads
                findUniqueData.ppn_fee_ads += +uniqueData.ppn_fee_ads
                findUniqueData.pph_fee_ads += +uniqueData.pph_fee_ads
                findUniqueData.total_settlement_fee_ads += +uniqueData.total_settlement_fee_ads
                findUniqueData.fee_atmi += +uniqueData.fee_atmi
                findUniqueData.dpp_fee_atmi += +uniqueData.dpp_fee_atmi
                findUniqueData.ppn_fee_atmi += +uniqueData.ppn_fee_atmi
                findUniqueData.pph_fee_atmi += +uniqueData.pph_fee_atmi
                findUniqueData.total_settlement_fee_atmi += +uniqueData.total_settlement_fee_atmi
                findUniqueData.fee_client += +uniqueData.fee_client
                findUniqueData.dpp_fee_client += +uniqueData.dpp_fee_client
                findUniqueData.ppn_fee_client += +uniqueData.ppn_fee_client
                findUniqueData.pph_fee_client += +uniqueData.pph_fee_client
                findUniqueData.total_fee_client += +uniqueData.total_fee_client
                findUniqueData.amount_req_cashwithdrawal_client += +uniqueData.amount_req_cashwithdrawal_client
                findUniqueData.total_settlement_fee_client += +uniqueData.total_settlement_fee_client
            }
        }
        return storedUniqueDatas;
    }

    static async getClients() {
        const clients = (await Client.findAll()).map(data => data.dataValues);
        return clients
    }

    static async getSummary(startBatch, endBatch) {
        startBatch = +startBatch || 1;
        endBatch = +endBatch || 999999999;
        const summary = await Summary.findAll({
            attributes: [
                'client_id',
                'no_batch',
                [sequelize.fn('SUM', sequelize.col('revenue_rts')), 'revenue_rts'],
                [sequelize.fn('SUM', sequelize.col('dpp_revenue_rts')), 'dpp_revenue_rts'],
                [sequelize.fn('SUM', sequelize.col('ppn_revenue_rts')), 'ppn_revenue_rts'],
                [sequelize.fn('SUM', sequelize.col('pph_revenue_rts')), 'pph_revenue_rts'],
                [sequelize.fn('SUM', sequelize.col('total_settlement_revenue_rts')), 'total_settlement_revenue_rts'],
                [sequelize.fn('SUM', sequelize.col('fee_rts')), 'fee_rts'],
                [sequelize.fn('SUM', sequelize.col('dpp_fee_rts')), 'dpp_fee_rts'],
                [sequelize.fn('SUM', sequelize.col('ppn_fee_rts')), 'ppn_fee_rts'],
                [sequelize.fn('SUM', sequelize.col('pph_fee_rts')), 'pph_fee_rts'],
                [sequelize.fn('SUM', sequelize.col('total_settlement_fee_rts')), 'total_settlement_fee_rts'],
                [sequelize.fn('SUM', sequelize.col('fee_ndp')), 'fee_ndp'],
                [sequelize.fn('SUM', sequelize.col('dpp_fee_ndp')), 'dpp_fee_ndp'],
                [sequelize.fn('SUM', sequelize.col('ppn_fee_ndp')), 'ppn_fee_ndp'],
                [sequelize.fn('SUM', sequelize.col('pph_fee_ndp')), 'pph_fee_ndp'],
                [sequelize.fn('SUM', sequelize.col('total_settlement_fee_ndp')), 'total_settlement_fee_ndp'],
                [sequelize.fn('SUM', sequelize.col('fee_ads')), 'fee_ads'],
                [sequelize.fn('SUM', sequelize.col('dpp_fee_ads')), 'dpp_fee_ads'],
                [sequelize.fn('SUM', sequelize.col('ppn_fee_ads')), 'ppn_fee_ads'],
                [sequelize.fn('SUM', sequelize.col('pph_fee_ads')), 'pph_fee_ads'],
                [sequelize.fn('SUM', sequelize.col('total_settlement_fee_ads')), 'total_settlement_fee_ads'],
                [sequelize.fn('SUM', sequelize.col('fee_atmi')), 'fee_atmi'],
                [sequelize.fn('SUM', sequelize.col('dpp_fee_atmi')), 'dpp_fee_atmi'],
                [sequelize.fn('SUM', sequelize.col('ppn_fee_atmi')), 'ppn_fee_atmi'],
                [sequelize.fn('SUM', sequelize.col('pph_fee_atmi')), 'pph_fee_atmi'],
                [sequelize.fn('SUM', sequelize.col('total_settlement_fee_atmi')), 'total_settlement_fee_atmi'],
                [sequelize.fn('SUM', sequelize.col('fee_client')), 'fee_client'],
                [sequelize.fn('SUM', sequelize.col('dpp_fee_client')), 'dpp_fee_client'],
                [sequelize.fn('SUM', sequelize.col('ppn_fee_client')), 'ppn_fee_client'],
                [sequelize.fn('SUM', sequelize.col('pph_fee_client')), 'pph_fee_client'],
                [sequelize.fn('SUM', sequelize.col('total_fee_client')), 'total_fee_client'],
                [sequelize.fn('SUM', sequelize.col('amount_req_cashwithdrawal_client')), 'amount_req_cashwithdrawal_client'],
                [sequelize.fn('SUM', sequelize.col('total_settlement_fee_client')), 'total_settlement_fee_client'],
            ],
            where: {
                no_batch: {
                    [Op.gte]: startBatch,
                    [Op.lte]: endBatch
                }
            },
            include: [
                {
                    model: Client,
                    attributes: ['name', 'type_trans'],
                }
            ],
            group: ['client_id', 'no_batch', 'name', 'type_trans', 'client.id'],
            order: [['no_batch', 'asc'], ['client_id', 'asc']]
        });
        return summary.map(data => {
            return {
                ...data.dataValues,
                ...data.dataValues.client.dataValues
            }
        });
    }

    static async writeSummaryToExcel(summary) {
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet('Summary');
        worksheet.columns = [
            { header: 'No Batch', key: 'no_batch', width: 10, },
            { header: 'Client Name', key: 'client_name', width: 30 },
            { header: 'Type Transactions', key: 'type_trans', width: 18 },
            { header: 'Revenue RTS', key: 'revenue_rts', width: 15 },
            { header: 'DPP Revenue RTS', key: 'dpp_revenue_rts', width: 15 },
            { header: 'PPN Revenue RTS', key: 'ppn_revenue_rts', width: 15 },
            { header: 'PPH Revenue RTS', key: 'pph_revenue_rts', width: 15 },
            { header: 'Total Settlement Revenue RTS', key: 'total_settlement_revenue_rts', width: 15 },
            { header: 'Fee RTS', key: 'fee_rts', width: 15 },
            { header: 'DPP Fee RTS', key: 'dpp_fee_rts', width: 15 },
            { header: 'PPN Fee RTS', key: 'ppn_fee_rts', width: 15 },
            { header: 'PPH Fee RTS', key: 'pph_fee_rts', width: 15 },
            { header: 'Total Settlement Fee RTS', key: 'total_settlement_fee_rts', width: 15 },
            { header: 'Fee NDP', key: 'fee_ndp', width: 15 },
            { header: 'DPP Fee NDP', key: 'dpp_fee_ndp', width: 15 },
            { header: 'PPN Fee NDP', key: 'ppn_fee_ndp', width: 15 },
            { header: 'PPH Fee NDP', key: 'pph_fee_ndp', width: 15 },
            { header: 'Total Settlement Fee NDP', key: 'total_settlement_fee_ndp', width: 15 },
            { header: 'Fee ADS', key: 'fee_ads', width: 15 },
            { header: 'DPP Fee ADS', key: 'dpp_fee_ads', width: 15 },
            { header: 'PPN Fee ADS', key: 'ppn_fee_ads', width: 15 },
            { header: 'PPH Fee ADS', key: 'pph_fee_ads', width: 15 },
            { header: 'Total Settlement Fee ADS', key: 'total_settlement_fee_ads', width: 15 },
            { header: 'Fee ATMI', key: 'fee_atmi', width: 15 },
            { header: 'DPP Fee ATMI', key: 'dpp_fee_atmi', width: 15 },
            { header: 'PPN Fee ATMI', key: 'ppn_fee_atmi', width: 15 },
            { header: 'PPH Fee ATMI', key: 'pph_fee_atmi', width: 15 },
            { header: 'Total Settlement Fee ATMI', key: 'total_settlement_fee_atmi', width: 15 },
            { header: 'Fee Client', key: 'fee_client', width: 15 },
            { header: 'DPP Fee Client', key: 'dpp_fee_client', width: 15 },
            { header: 'PPN Fee Client', key: 'ppn_fee_client', width: 15 },
            { header: 'PPH Fee Client', key: 'pph_fee_client', width: 15 },
            { header: 'Total Fee Client', key: 'total_fee_client', width: 15 },
            { header: 'Amount Req Cash Withdrawal Client', key: 'amount_req_cashwithdrawal_client', width: 15 },
            { header: 'Total Settlement Fee Client', key: 'total_settlement_fee_client', width: 15 },
        ];
        for (const summaryData of summary) {
            const noBatch = summaryData['no_batch'];
            const clientName = summaryData['name'];
            const typeTrans = summaryData['type_trans'];
            const revenue_rts = summaryData['revenue_rts'];
            const dpp_revenue_rts = summaryData['dpp_revenue_rts'];
            const ppn_revenue_rts = summaryData['ppn_revenue_rts'];
            const pph_revenue_rts = summaryData['pph_revenue_rts'];
            const total_settlement_revenue_rts = summaryData['total_settlement_revenue_rts'];
            const fee_rts = summaryData['fee_rts'];
            const dpp_fee_rts = summaryData['dpp_fee_rts'];
            const ppn_fee_rts = summaryData['ppn_fee_rts'];
            const pph_fee_rts = summaryData['pph_fee_rts'];
            const total_settlement_fee_rts = summaryData['total_settlement_fee_rts'];
            const fee_ndp = summaryData['fee_ndp'];
            const dpp_fee_ndp = summaryData['dpp_fee_ndp'];
            const ppn_fee_ndp = summaryData['ppn_fee_ndp'];
            const pph_fee_ndp = summaryData['pph_fee_ndp'];
            const total_settlement_fee_ndp = summaryData['total_settlement_fee_ndp'];
            const fee_ads = summaryData['fee_ads'];
            const dpp_fee_ads = summaryData['dpp_fee_ads'];
            const ppn_fee_ads = summaryData['ppn_fee_ads'];
            const pph_fee_ads = summaryData['pph_fee_ads'];
            const total_settlement_fee_ads = summaryData['total_settlement_fee_ads'];
            const fee_atmi = summaryData['fee_atmi'];
            const dpp_fee_atmi = summaryData['dpp_fee_atmi'];
            const ppn_fee_atmi = summaryData['ppn_fee_atmi'];
            const pph_fee_atmi = summaryData['pph_fee_atmi'];
            const total_settlement_fee_atmi = summaryData['total_settlement_fee_atmi'];
            const fee_client = summaryData['fee_client'];
            const dpp_fee_client = summaryData['dpp_fee_client'];
            const ppn_fee_client = summaryData['ppn_fee_client'];
            const pph_fee_client = summaryData['pph_fee_client'];
            const total_fee_client = summaryData['total_fee_client'];
            const amount_req_cashwithdrawal_client = summaryData['amount_req_cashwithdrawal_client'];
            const total_settlement_fee_client = summaryData['total_settlement_fee_client'];
            worksheet.addRow({
                no_batch: noBatch,
                client_name: clientName,
                type_trans: typeTrans,
                revenue_rts: revenue_rts,
                dpp_revenue_rts: dpp_revenue_rts,
                ppn_revenue_rts: ppn_revenue_rts,
                pph_revenue_rts: pph_revenue_rts,
                total_settlement_revenue_rts: total_settlement_revenue_rts,
                fee_rts: fee_rts,
                dpp_fee_rts: dpp_fee_rts,
                ppn_fee_rts: ppn_fee_rts,
                pph_fee_rts: pph_fee_rts,
                total_settlement_fee_rts: total_settlement_fee_rts,
                fee_ndp: fee_ndp,
                dpp_fee_ndp: dpp_fee_ndp,
                ppn_fee_ndp: ppn_fee_ndp,
                pph_fee_ndp: pph_fee_ndp,
                total_settlement_fee_ndp: total_settlement_fee_ndp,
                fee_ads: fee_ads,
                dpp_fee_ads: dpp_fee_ads,
                ppn_fee_ads: ppn_fee_ads,
                pph_fee_ads: pph_fee_ads,
                total_settlement_fee_ads: total_settlement_fee_ads,
                fee_atmi: fee_atmi,
                dpp_fee_atmi: dpp_fee_atmi,
                ppn_fee_atmi: ppn_fee_atmi,
                pph_fee_atmi: pph_fee_atmi,
                total_settlement_fee_atmi: total_settlement_fee_atmi,
                fee_client: fee_client,
                dpp_fee_client: dpp_fee_client,
                ppn_fee_client: ppn_fee_client,
                pph_fee_client: pph_fee_client,
                total_fee_client: total_fee_client,
                amount_req_cashwithdrawal_client: amount_req_cashwithdrawal_client,
                total_settlement_fee_client: total_settlement_fee_client,
            });
        }

        worksheet.getRow(1).font = { bold: true };
        worksheet.views = [
            {
                state: 'frozen', ySplit: 1
            }
        ]
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }

    static async getDetailSummary(startBatch, endBatch) {
        startBatch = +startBatch || 1;
        endBatch = +endBatch || 999999999;
        const summary = await Summary.findAll({
            attributes: [
                'client_id',
                'no_batch',
                [sequelize.fn('SUM', sequelize.col('revenue_rts')), 'revenue_rts'],
                [sequelize.fn('SUM', sequelize.col('dpp_revenue_rts')), 'dpp_revenue_rts'],
                [sequelize.fn('SUM', sequelize.col('ppn_revenue_rts')), 'ppn_revenue_rts'],
                [sequelize.fn('SUM', sequelize.col('pph_revenue_rts')), 'pph_revenue_rts'],
                [sequelize.fn('SUM', sequelize.col('total_settlement_revenue_rts')), 'total_settlement_revenue_rts'],
                [sequelize.fn('SUM', sequelize.col('fee_rts')), 'fee_rts'],
                [sequelize.fn('SUM', sequelize.col('dpp_fee_rts')), 'dpp_fee_rts'],
                [sequelize.fn('SUM', sequelize.col('ppn_fee_rts')), 'ppn_fee_rts'],
                [sequelize.fn('SUM', sequelize.col('pph_fee_rts')), 'pph_fee_rts'],
                [sequelize.fn('SUM', sequelize.col('total_settlement_fee_rts')), 'total_settlement_fee_rts'],
                [sequelize.fn('SUM', sequelize.col('fee_ndp')), 'fee_ndp'],
                [sequelize.fn('SUM', sequelize.col('dpp_fee_ndp')), 'dpp_fee_ndp'],
                [sequelize.fn('SUM', sequelize.col('ppn_fee_ndp')), 'ppn_fee_ndp'],
                [sequelize.fn('SUM', sequelize.col('pph_fee_ndp')), 'pph_fee_ndp'],
                [sequelize.fn('SUM', sequelize.col('total_settlement_fee_ndp')), 'total_settlement_fee_ndp'],
                [sequelize.fn('SUM', sequelize.col('fee_ads')), 'fee_ads'],
                [sequelize.fn('SUM', sequelize.col('dpp_fee_ads')), 'dpp_fee_ads'],
                [sequelize.fn('SUM', sequelize.col('ppn_fee_ads')), 'ppn_fee_ads'],
                [sequelize.fn('SUM', sequelize.col('pph_fee_ads')), 'pph_fee_ads'],
                [sequelize.fn('SUM', sequelize.col('total_settlement_fee_ads')), 'total_settlement_fee_ads'],
                [sequelize.fn('SUM', sequelize.col('fee_atmi')), 'fee_atmi'],
                [sequelize.fn('SUM', sequelize.col('dpp_fee_atmi')), 'dpp_fee_atmi'],
                [sequelize.fn('SUM', sequelize.col('ppn_fee_atmi')), 'ppn_fee_atmi'],
                [sequelize.fn('SUM', sequelize.col('pph_fee_atmi')), 'pph_fee_atmi'],
                [sequelize.fn('SUM', sequelize.col('total_settlement_fee_atmi')), 'total_settlement_fee_atmi'],
                [sequelize.fn('SUM', sequelize.col('fee_client')), 'fee_client'],
                [sequelize.fn('SUM', sequelize.col('dpp_fee_client')), 'dpp_fee_client'],
                [sequelize.fn('SUM', sequelize.col('ppn_fee_client')), 'ppn_fee_client'],
                [sequelize.fn('SUM', sequelize.col('pph_fee_client')), 'pph_fee_client'],
                [sequelize.fn('SUM', sequelize.col('total_fee_client')), 'total_fee_client'],
                [sequelize.fn('SUM', sequelize.col('amount_req_cashwithdrawal_client')), 'amount_req_cashwithdrawal_client'],
                [sequelize.fn('SUM', sequelize.col('total_settlement_fee_client')), 'total_settlement_fee_client'],
            ],
            where: {
                no_batch: {
                    [Op.gte]: startBatch,
                    [Op.lte]: endBatch
                }
            },
            include: [
                {
                    model: Client,
                    attributes: ['name', 'type_trans'],
                }
            ],
            group: ['client_id', 'no_batch', 'client.id', 'name'],
        });
        return summary.map(data => {
            const datas = {
                ...data.dataValues,
                ...data.dataValues.client.dataValues
            }
            delete datas.client;
            return datas;
        });
    }

    static async getDistinctClients() {
        const clients = (await Client.findAll({
            attributes: ['name'],
            group: ['name']
        })).map(data => data.dataValues);
        return clients;
    }

    static detailClientsSummary(summaries, clients) {
        const partners = [];
        for (const summary of summaries) {
            const client = clients.find(client => client.name === summary.name);
            const partner = partners.find(partner => partner.name === client.name);
            delete summary.type_trans;
            delete summary.client_id;
            delete summary.no_batch;
            summary.revenue_rts = +summary.revenue_rts
            summary.dpp_revenue_rts = +summary.dpp_revenue_rts
            summary.ppn_revenue_rts = +summary.ppn_revenue_rts
            summary.pph_revenue_rts = +summary.pph_revenue_rts
            summary.total_settlement_revenue_rts = +summary.total_settlement_revenue_rts
            summary.fee_rts = +summary.fee_rts
            summary.dpp_fee_rts = +summary.dpp_fee_rts
            summary.ppn_fee_rts = +summary.ppn_fee_rts
            summary.pph_fee_rts = +summary.pph_fee_rts
            summary.total_settlement_fee_rts = +summary.total_settlement_fee_rts
            summary.fee_ndp = +summary.fee_ndp
            summary.dpp_fee_ndp = +summary.dpp_fee_ndp
            summary.ppn_fee_ndp = +summary.ppn_fee_ndp
            summary.pph_fee_ndp = +summary.pph_fee_ndp
            summary.total_settlement_fee_ndp = +summary.total_settlement_fee_ndp
            summary.fee_ads = +summary.fee_ads
            summary.dpp_fee_ads = +summary.dpp_fee_ads
            summary.ppn_fee_ads = +summary.ppn_fee_ads
            summary.pph_fee_ads = +summary.pph_fee_ads
            summary.total_settlement_fee_ads = +summary.total_settlement_fee_ads
            summary.fee_atmi = +summary.fee_atmi
            summary.dpp_fee_atmi = +summary.dpp_fee_atmi
            summary.ppn_fee_atmi = +summary.ppn_fee_atmi
            summary.pph_fee_atmi = +summary.pph_fee_atmi
            summary.total_settlement_fee_atmi = +summary.total_settlement_fee_atmi
            summary.fee_client = +summary.fee_client
            summary.dpp_fee_client = +summary.dpp_fee_client
            summary.ppn_fee_client = +summary.ppn_fee_client
            summary.pph_fee_client = +summary.pph_fee_client
            summary.total_fee_client = +summary.total_fee_client
            summary.amount_req_cashwithdrawal_client = +summary.amount_req_cashwithdrawal_client
            summary.total_settlement_fee_client = +summary.total_settlement_fee_client

            if (!partner) {
                partners.push(summary);
            } else {
                partner.revenue_rts += summary.revenue_rts
                partner.dpp_revenue_rts += summary.dpp_revenue_rts
                partner.ppn_revenue_rts += summary.ppn_revenue_rts
                partner.pph_revenue_rts += summary.pph_revenue_rts
                partner.total_settlement_revenue_rts += summary.total_settlement_revenue_rts
                partner.fee_rts += summary.fee_rts
                partner.dpp_fee_rts += summary.dpp_fee_rts
                partner.ppn_fee_rts += summary.ppn_fee_rts
                partner.pph_fee_rts += summary.pph_fee_rts
                partner.total_settlement_fee_rts += summary.total_settlement_fee_rts
                partner.fee_ndp += summary.fee_ndp
                partner.dpp_fee_ndp += summary.dpp_fee_ndp
                partner.ppn_fee_ndp += summary.ppn_fee_ndp
                partner.pph_fee_ndp += summary.pph_fee_ndp
                partner.total_settlement_fee_ndp += summary.total_settlement_fee_ndp
                partner.fee_ads += summary.fee_ads
                partner.dpp_fee_ads += summary.dpp_fee_ads
                partner.ppn_fee_ads += summary.ppn_fee_ads
                partner.pph_fee_ads += summary.pph_fee_ads
                partner.total_settlement_fee_ads += summary.total_settlement_fee_ads
                partner.fee_atmi += summary.fee_atmi
                partner.dpp_fee_atmi += summary.dpp_fee_atmi
                partner.ppn_fee_atmi += summary.ppn_fee_atmi
                partner.pph_fee_atmi += summary.pph_fee_atmi
                partner.total_settlement_fee_atmi += summary.total_settlement_fee_atmi
                partner.fee_client += summary.fee_client
                partner.dpp_fee_client += summary.dpp_fee_client
                partner.ppn_fee_client += summary.ppn_fee_client
                partner.pph_fee_client += summary.pph_fee_client
                partner.total_fee_client += summary.total_fee_client
                partner.amount_req_cashwithdrawal_client += summary.amount_req_cashwithdrawal_client
                partner.total_settlement_fee_client += summary.total_settlement_fee_client
            }
        }
        const mappedPartners = partners.map(data => {
            data.revenue_rts = data.revenue_rts.toFixed(2)
            data.dpp_revenue_rts = data.dpp_revenue_rts.toFixed(2)
            data.ppn_revenue_rts = data.ppn_revenue_rts.toFixed(2)
            data.pph_revenue_rts = data.pph_revenue_rts.toFixed(2)
            data.total_settlement_revenue_rts = data.total_settlement_revenue_rts.toFixed(2)
            data.fee_rts = data.fee_rts.toFixed(2)
            data.dpp_fee_rts = data.dpp_fee_rts.toFixed(2)
            data.ppn_fee_rts = data.ppn_fee_rts.toFixed(2)
            data.pph_fee_rts = data.pph_fee_rts.toFixed(2)
            data.total_settlement_fee_rts = data.total_settlement_fee_rts.toFixed(2)
            data.fee_ndp = data.fee_ndp.toFixed(2)
            data.dpp_fee_ndp = data.dpp_fee_ndp.toFixed(2)
            data.ppn_fee_ndp = data.ppn_fee_ndp.toFixed(2)
            data.pph_fee_ndp = data.pph_fee_ndp.toFixed(2)
            data.total_settlement_fee_ndp = data.total_settlement_fee_ndp.toFixed(2)
            data.fee_ads = data.fee_ads.toFixed(2)
            data.dpp_fee_ads = data.dpp_fee_ads.toFixed(2)
            data.ppn_fee_ads = data.ppn_fee_ads.toFixed(2)
            data.pph_fee_ads = data.pph_fee_ads.toFixed(2)
            data.total_settlement_fee_ads = data.total_settlement_fee_ads.toFixed(2)
            data.fee_atmi = data.fee_atmi.toFixed(2)
            data.dpp_fee_atmi = data.dpp_fee_atmi.toFixed(2)
            data.ppn_fee_atmi = data.ppn_fee_atmi.toFixed(2)
            data.pph_fee_atmi = data.pph_fee_atmi.toFixed(2)
            data.total_settlement_fee_atmi = data.total_settlement_fee_atmi.toFixed(2)
            data.fee_client = data.fee_client.toFixed(2)
            data.dpp_fee_client = data.dpp_fee_client.toFixed(2)
            data.ppn_fee_client = data.ppn_fee_client.toFixed(2)
            data.pph_fee_client = data.pph_fee_client.toFixed(2)
            data.total_fee_client = data.total_fee_client.toFixed(2)
            data.amount_req_cashwithdrawal_client = data.amount_req_cashwithdrawal_client.toFixed(2)
            data.total_settlement_fee_client = data.total_settlement_fee_client.toFixed(2)
            return data
        })
        return mappedPartners
    }

    static getSummaryColumnPartners(listPartners) {
        const columnNames = Object.keys(Summary.getAttributes());
        const mapPartnerValue = {};
        for (const columnName of columnNames) {
            const column = listPartners.find(str => {
                return columnName.toUpperCase().includes("FEE_" + str.name)
            });
            if (column) {
                if (mapPartnerValue[column.name]) {
                    mapPartnerValue[column.name].push(columnName);
                } else {
                    mapPartnerValue[column.name] = [columnName];
                }
            }
        }
        return mapPartnerValue;
    }

    static async getPartners() {
        const partners = (await Partner.findAll()).map(data => data.dataValues);
        return partners;
    }

    static detailPartnersSummary(clientSummaries, columnPartners) {
        const partnerSummaries = {};
        for (const client of clientSummaries) {
            for (const columnName of Object.keys(client)) {
                for (const columnPartner of Object.keys(columnPartners)) {
                    for (const columnSummary of columnPartners[columnPartner]) {
                        if (columnName === columnSummary) {
                            if (!partnerSummaries[columnPartner]) {
                                partnerSummaries[columnPartner] = {};
                                partnerSummaries[columnPartner][columnName] = 0;
                            }
                            if (!partnerSummaries[columnPartner][columnName]) {
                                partnerSummaries[columnPartner][columnName] = 0
                            }
                            partnerSummaries[columnPartner][columnName] += +client[columnName];
                        }
                    }
                }
            }
        }
        for (const partnerSummary of Object.keys(partnerSummaries)) {
            for (const columnName of Object.keys(partnerSummaries[partnerSummary])) {
                partnerSummaries[partnerSummary][columnName] = partnerSummaries[partnerSummary][columnName].toFixed(2)
            }
        }

        return partnerSummaries;
    }

}

module.exports = ExcelHelper;