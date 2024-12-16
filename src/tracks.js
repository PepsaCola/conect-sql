const {GetTracksCosmetics} =require('./FortniteAPI.js');
const sql = require('mssql/msnodesqlv8.js');

const config = {
    connectionString:
        'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-V70N1TR\\SQLEXPRESS;Database=FortniteHelper;Trusted_Connection=Yes;',
};

const FortniteAPI = new GetTracksCosmetics();

async function getTracksCosmetics() {
    try{
        const cosmeticsData = await FortniteAPI.getTracks()

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

            await new sql.Request()
                .input('TracksID', sql.VarChar, item.id)
                .input('ItemTitle', sql.VarChar, item.title)
                .input('Artist', sql.VarChar, item.artist)
                .input('ReleaseYear', sql.Int, item.releaseYear)
                .input('Duration',sql.Int, item.duration)
                .input('AlbumArt',sql.VarChar, item.albumArt)
                .query(`
                    INSERT INTO Tracks (TracksID, ItemTitle, Artist,ReleaseYear,Duration,AlbumArt)
                    VALUES (@TracksID, @ItemTitle, @Artist, @ReleaseYear, @Duration, @AlbumArt)
                `)

            await new sql.Request()
                .input('InstrumentsID', sql.VarChar, '1')
                .input('TracksID', sql.VarChar, item.id)
                .query( `
                INSERT INTO Festival (InstrumentsID,TracksID)
                VALUES (@InstrumentsID, @TracksID)
                ` )

            const festivalIDResult = await new sql.Request()
                .input('TracksID',sql.VarChar, item.id)
                .query(`
                    SELECT FestivalID 
                    FROM Festival
                    WHERE TracksID = @TracksID
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
getTracksCosmetics()