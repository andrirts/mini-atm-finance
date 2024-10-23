const { google } = require('googleapis');
const moment = require('moment');
const sheets = google.sheets('v4');
const path = require('path');

class GoogleApi {
    static credentialsPath = path.join(__dirname, '../', 'credentials.json');
    static SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

    static async authorize() {
        const auth = new google.auth.GoogleAuth({
            keyFile: this.credentialsPath,
            scopes: this.SCOPES
        })
        return await auth.getClient();
    }
    static async insertExcel(summaries) {
        const auth = await this.authorize();
        const spreadSheetId = process.env.SPREADSHEET_ID;
        const values = summaries.map(summary => [
            summary.no_batch,
            summary.clientName,
            summary.typeTrans,
            summary.count_transaction,
            summary.revenue_rts,
            summary.dpp_revenue_rts,
            summary.ppn_revenue_rts,
            summary.pph_revenue_rts,
            summary.total_settlement_revenue_rts,
            summary.fee_rts,
            summary.dpp_fee_rts,
            summary.ppn_fee_rts,
            summary.pph_fee_rts,
            summary.total_settlement_fee_rts,
            summary.fee_ndp,
            summary.dpp_fee_ndp,
            summary.ppn_fee_ndp,
            summary.pph_fee_ndp,
            summary.total_settlement_fee_ndp,
            summary.fee_ads,
            summary.dpp_fee_ads,
            summary.ppn_fee_ads,
            summary.pph_fee_ads,
            summary.total_settlement_fee_ads,
            summary.fee_atmi,
            summary.dpp_fee_atmi,
            summary.ppn_fee_atmi,
            summary.pph_fee_atmi,
            summary.total_settlement_fee_atmi,
            summary.fee_client,
            summary.dpp_fee_client,
            summary.ppn_fee_client,
            summary.pph_fee_client,
            summary.total_fee_client,
            summary.amount_req_cashwithdrawal_client,
            summary.total_settlement_fee_client,
        ])
        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: spreadSheetId,
                range: 'Sheet1!A:A',
                auth
            });
            const numRows = response.data.values ? response.data.values.length : 0;
            const newRow = numRows + 1;
            const newRange = `Sheet1!A${newRow}`;
            await this.addMoreRows();
            await sheets.spreadsheets.values.update({
                spreadsheetId: spreadSheetId,
                range: newRange,
                valueInputOption: "USER_ENTERED",
                resource: {
                    values
                },
                auth
            });
            console.log(`${response.data.updatedRows} rows updated successfully.`);
            console.log("FINSIHED INSERT DATA")
        } catch (err) {
            throw new Error(err.message);
        }

    }

    static async addMoreRows() {
        const auth = await this.authorize();
        const requests = [
            {
                "appendDimension": {
                    "sheetId": process.env.SHEET_ID,
                    "dimension": "ROWS",
                    "length": 1000
                }
            }
        ]

        try {
            const response = await sheets.spreadsheets.batchUpdate({
                spreadsheetId: process.env.SPREADSHEET_ID,
                requestBody: {
                    requests,
                },
                auth
            })
            console.log(`${response.data.replies.length} rows added successfully.`);
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = GoogleApi;


