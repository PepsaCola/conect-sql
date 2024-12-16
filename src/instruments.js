const { GetInstrumentsCosmetics } = require('./FortniteAPI.js');
const sql = require('mssql/msnodesqlv8.js');

const config = {
    connectionString:
        'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-V70N1TR\\SQLEXPRESS;Database=FortniteHelper;Trusted_Connection=Yes;',
};

const FortniteAPI = new GetInstrumentsCosmetics();

async function getInstrumentsCosmetics() {
    try{
        const cosmeticsData = await FortniteAPI.getInstruments()

        if (!cosmeticsData || !Array.isArray(cosmeticsData)) {
            console.error('Invalid or empty data received from the API.');
            return;
        }
        await insertCosmeticsData(cosmeticsData);
    }catch(error){
        console.error('Error fetching Cars cosmetics data:', error);
    }
}

async function insertCosmeticsData(data){
    let connection;
    try{
        connection = await sql.connect(config);
        for (const item of data) {

            const typeIDResult = await new sql.Request()
                .input('TypeValue', sql.VarChar, item.type.value)
                .query(`
                    SELECT TypeID
                    FROM InstrumentsTypes
                    WHERE TypeName = @TypeValue
                `);

            // Отримуємо RarityID
            const rarityIDResult = await new sql.Request()
                .input('RarityValue', sql.VarChar, item.rarity.value)
                .query(`
                    SELECT RarityID
                    FROM Rarities
                    WHERE RarityName = @RarityValue
                `);

            const typeID = typeIDResult.recordset.length > 0 ? typeIDResult.recordset[0].TypeID : null;
            const rarityID = rarityIDResult.recordset.length > 0 ? rarityIDResult.recordset[0].RarityID : null;
            const image = item.images.large? item.images.large:item.images.small

            await new sql.Request()
                .input('InstrumentsID', sql.VarChar, item.id)
                .input('ItemName', sql.VarChar, item.name)
                .input('ItemDescription', sql.VarChar, item.description)
                .input('Images', sql.VarChar, image)
                .input('RarityID', sql.Int, rarityID)
                .input('TypeID', sql.Int, typeID)
                .query(`
                    INSERT INTO Instruments (InstrumentsID, ItemName, ItemDescription, Images, RarityID, TypeID)
                    VALUES (@InstrumentsID, @ItemName, @ItemDescription, @Images, @RarityID, @TypeID)
                `);

            await new sql.Request()
                .input('InstrumentsID', sql.VarChar, item.id)
                .input('TracksID', sql.VarChar, 1)
                .query( `
                INSERT INTO Festival (InstrumentsID,TracksID)
                VALUES (@InstrumentsID, @TracksID)
                ` )

            const festivalIDResult = await new sql.Request()
                .input('InstrumentsID',sql.VarChar, item.id)
                .query(`
                    SELECT FestivalID 
                    FROM Festival
                    WHERE InstrumentsID = @InstrumentsID
                `)

            const festival = festivalIDResult.recordset.length > 0 ? festivalIDResult.recordset[0].FestivalID : null;

            await new sql.Request()
                .input('AddedDate', sql.VarChar, item.added || null)
                .input('BRID', sql.VarChar, '1')
                .input('FestivalID', sql.Int, festival)
                .input('CarsID', sql.VarChar, '1')
                .input('LegoID', sql.VarChar, '1')
                .query(`
                    INSERT INTO Items (AddedDate, BRID, FestivalID, CarsID, LegoID)
                    VALUES (@AddedDate, @BRID, @FestivalID, @CarsID, @LegoID)
                `);

        }
    }catch(error){
        console.error('Error inserting data:', error);
    } finally {
        if (connection) await sql.close();
    }
}

getInstrumentsCosmetics()