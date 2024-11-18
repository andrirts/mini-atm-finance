const ExcelJs = require('exceljs');
const fs = require('fs/promises');


async function processExcelFileStream() {
    const workbook = new ExcelJs.stream.xlsx.WorkbookReader('./tarif mini atm.xlsx');
    const datas = [];
    for await (const worksheet of workbook) {
        for await (const row of worksheet) {
            if (row.number === 1) continue

            const batch = row.values[1];
            const name = row.values[2];
            const code = row.values[3];
            const type_trans = row.values[16];
            const acq_fee_rts = row.values[4];
            const acq_fee_switching_alto = row.values[5];
            const acq_fee_recon_alto = row.values[6];
            const acq_fee_atmi = row.values[7];
            const acq_fee_client = row.values[8];
            const acq_fee_ads = row.values[9];
            const acq_fee_ndp = row.values[10];
            const beneficiary = row.values[11];
            const acq_fee_cashlez = row.values[12];
            const revenue_rts = acq_fee_rts + acq_fee_atmi + acq_fee_client + acq_fee_ads + acq_fee_ndp;
            const total = acq_fee_rts + acq_fee_switching_alto + acq_fee_recon_alto + acq_fee_atmi + acq_fee_client + acq_fee_ads + acq_fee_ndp + beneficiary + acq_fee_cashlez
            datas.push({
                batch,
                name,
                code,
                type_trans,
                acq_fee_rts,
                acq_fee_switching_alto,
                acq_fee_recon_alto,
                acq_fee_atmi,
                acq_fee_client,
                acq_fee_ads,
                acq_fee_ndp,
                beneficiary,
                acq_fee_cashlez,
                revenue_rts,
                total
            })
        }
    }
    return datas;
}

// (async () => {
//     const datas = await processExcelFileStream();
//     console.log(datas);
// })()

module.exports = processExcelFileStream
