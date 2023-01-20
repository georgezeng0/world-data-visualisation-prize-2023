import csv from 'csvtojson'

const csvFilePath='../data/plot_data.csv'

export async function dataParse() {
    const jsonArray = await csv().fromFile(csvFilePath);
    return jsonArray
}
