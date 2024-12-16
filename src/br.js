const { GetBRCosmetics } = require('./FortniteAPI.js');
const sql = require('mssql/msnodesqlv8.js');

const config = {
    connectionString:
        'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-V70N1TR\\SQLEXPRESS;Database=FortniteHelper;Trusted_Connection=Yes;',
};

const FortniteAPI = new GetBRCosmetics();

async function getBRCosmetics() {
    try{
        const cosmeticsData = await FortniteAPI.getBR()

        if (!cosmeticsData || !Array.isArray(cosmeticsData)) {
            console.error('Invalid or empty data received from the API.');
            return;
        }
        await insertCosmeticsData(cosmeticsData);
    }catch(error){
        console.error('Error fetching Cars cosmetics data:', error);
    }
}

async function insertCosmeticsData(data) {
    let connection;
    try {
        connection = await sql.connect(config);
        for (const item of data) {
            console.log(item.id)

            const existenceResult = await new sql.Request()
                .input('BRID', sql.VarChar, item.id)
                .query(`
                    SELECT COUNT(*) AS Count
                    FROM BR
                    WHERE BRID = @BRID
                `);

            if (existenceResult.recordset[0].Count > 0) {
                console.log(`Skipped inserting into Cars: ${item.id} (already exists)`);
                continue; // Пропускаємо, якщо запис існує
            }

            // Отримуємо TypeID
            const typeIDResult = await new sql.Request()
                .input('TypeValue', sql.VarChar, item.type.value)
                .query(`
                    SELECT TypeID
                    FROM BRTypes
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
            const chapter = item.introduction && item.introduction.chapter ? Number(item.introduction.chapter) : null;
            const season = item.introduction && item.introduction.season ? Number(item.introduction.season) : null;
            const image = item.images.icon? item.images.icon:item.images.smallIcon

            await new sql.Request()
                .input('BRID', sql.VarChar, item.id)
                .input('ItemName', sql.VarChar, item.name)
                .input('ItemDescription', sql.VarChar, item.description)
                .input('Images', sql.VarChar, image)
                .input('Chapter', sql.Int, chapter)
                .input('Season', sql.Int, season)
                .input('RarityID', sql.Int, rarityID)
                .input('TypeID', sql.Int, typeID)
                .query(`
                    INSERT INTO BR (BRID, ItemName, ItemDescription, Images, Chapter, Season, RarityID, TypeID)
                    VALUES (@BRID, @ItemName, @ItemDescription, @Images, @Chapter, @Season, @RarityID, @TypeID)
                `);

            console.log(`Inserted into BR: ${item.id}`);

            // Вставка в таблицю Items
            await new sql.Request()
                .input('AddedDate', sql.VarChar, item.added || null)
                .input('BRID', sql.VarChar, item.id)
                .input('FestivalID', sql.Int, 3)
                .input('CarsID', sql.VarChar, '1')
                .input('LegoID', sql.VarChar, '1')
                .query(`
                    INSERT INTO Items (AddedDate, BRID, FestivalID, CarsID, LegoID)
                    VALUES (@AddedDate, @BRID, @FestivalID, @CarsID, @LegoID)
                `);

            console.log(`Inserted into Items: ${item.id}`);
        }

    }catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        if (connection) await sql.close();
    }
}
getBRCosmetics()