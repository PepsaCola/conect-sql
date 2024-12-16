const { GetLegoCosmetics } = require('./FortniteAPI.js');
const sql = require('mssql/msnodesqlv8.js');

const config = {
  connectionString:
    'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-V70N1TR\\SQLEXPRESS;Database=FortniteHelper;Trusted_Connection=Yes;',
};

const fortAPI = new GetLegoCosmetics();

async function getLego1() {
  try {
    const cosmeticsData = await fortAPI.getLego();
    if (!cosmeticsData || !Array.isArray(cosmeticsData)) {
      console.error('Invalid or empty data received from the API.');
      return;
    }

    await insertCosmeticsData(cosmeticsData);
  } catch (error) {
    console.error('Error fetching LEGO cosmetics data:', error);
  }
}

async function insertCosmeticsData(data) {
  let connection;
  try {
    connection = await sql.connect(config);

    for (const item of data) {


      // Вставка в таблицю Lego
      const legoRequest = new sql.Request(); // Новий об'єкт Request
      const legoInsertQuery = `
        INSERT INTO Lego (LegoID, ItemName, Images)
        VALUES (@LegoID, @ItemName, @Images)
      `;
      legoRequest.input('LegoID', sql.VarChar, item.id);
      legoRequest.input('ItemName', sql.VarChar, item.cosmeticId);
      legoRequest.input('Images', sql.VarChar, item.images.large);
      await legoRequest.query(legoInsertQuery);
      console.log(`Inserted into Lego: ${item.id}`);

      // Вставка в таблицю Items
      const itemsRequest = new sql.Request(); // Новий об'єкт Request
      const itemsInsertQuery = `
        INSERT INTO Items (AddedDate, BRID, FestivalID, CarsID, LegoID)
        VALUES (@AddedDate, @BRID, @FestivalID, @CarsID, @LegoID)
      `;
      itemsRequest.input('AddedDate', sql.VarChar, item.added || null);
      itemsRequest.input('BRID', sql.VarChar, '1');
      itemsRequest.input('FestivalID', sql.Int, 3);
      itemsRequest.input('CarsID', sql.VarChar, '1');
      itemsRequest.input('LegoID', sql.VarChar, item.id);
      await itemsRequest.query(itemsInsertQuery);
      console.log(`Inserted into Items: ${item.id}`);
    }
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    if (connection) await sql.close();
  }
}

getLego1();
