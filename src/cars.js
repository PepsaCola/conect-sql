const { GetCarsCosmetics } = require('./FortniteAPI.js');
const sql = require('mssql/msnodesqlv8.js');

const config = {
    connectionString:
        'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-V70N1TR\\SQLEXPRESS;Database=FortniteHelper;Trusted_Connection=Yes;',
};

const FortniteAPI = new GetCarsCosmetics();

async function getCarsCosmetics() {
    try {
        const cosmeticsData = await FortniteAPI.getCars();
        console.log(cosmeticsData);

        if (!cosmeticsData || !Array.isArray(cosmeticsData)) {
            console.error('Invalid or empty data received from the API.');
            return;
        }

        await insertCosmeticsData(cosmeticsData);
    } catch (error) {
        console.error('Error fetching Cars cosmetics data:', error);
    }
}

async function insertCosmeticsData(data) {
    let connection;
    try {
        connection = await sql.connect(config);

        for (const item of data) {


            // Перевірка існування запису в таблиці Cars
            const existenceResult = await new sql.Request()
                .input('CarsID', sql.VarChar, item.id)
                .query(`
                    SELECT COUNT(*) AS Count
                    FROM Cars
                    WHERE CarsID = @CarsID
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
                    FROM CarsTypes
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

            if (!item.images || !item.images.large) {
                console.log(`Skipped inserting Cars due to missing images: ${item.id}`);
                continue;
            }

            // Вставка в таблицю Cars
            await new sql.Request()
                .input('CarsID', sql.VarChar, item.id)
                .input('ItemName', sql.VarChar, item.name)
                .input('ItemDescription', sql.VarChar, item.description)
                .input('Images', sql.VarChar, item.images.large)
                .input('RarityID', sql.Int, rarityID)
                .input('TypeID', sql.Int, typeID)
                .query(`
                    INSERT INTO Cars (CarsID, ItemName, ItemDescription, Images, RarityID, TypeID)
                    VALUES (@CarsID, @ItemName, @ItemDescription, @Images, @RarityID, @TypeID)
                `);

            console.log(`Inserted into Cars: ${item.id}`);

            // Вставка в таблицю Items
            await new sql.Request()
                .input('AddedDate', sql.VarChar, item.added || null)
                .input('BRID', sql.VarChar, '1')
                .input('FestivalID', sql.Int, 3)
                .input('CarsID', sql.VarChar, item.id)
                .input('LegoID', sql.VarChar, '1')
                .query(`
                    INSERT INTO Items (AddedDate, BRID, FestivalID, CarsID, LegoID)
                    VALUES (@AddedDate, @BRID, @FestivalID, @CarsID, @LegoID)
                `);

            console.log(`Inserted into Items: ${item.id}`);
        }
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        if (connection) await sql.close();
    }
}

getCarsCosmetics();
