import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config({path: './config.env'});

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}).promise();

// <-------------------- NFL -------------------->//

// View All NFL Products
export const getNFLProducts = async()=>{
    const results = await pool.query(`SELECT * FROM nfl_products`)
    const rows = results[0];
    return rows;
}

// View Single NFL Product
export const getNFLProduct = async(id)=>{
    const [results] = await pool.query(`SELECT * FROM nfl_products WHERE id = ?`, id)
    const rows = results[0];
    return rows;
}

// Create New NFL Product
export const createNFLProduct = async (nflObject) => {
    const [results] = await pool.query(
        `INSERT INTO nfl_products (league, team, gender, product_name, product_desc, img, price, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nflObject.league, nflObject.team, nflObject.gender, nflObject.product_name, nflObject.product_desc, nflObject.img, nflObject.price, nflObject.category]
    );
    const rows = results[0];
    return rows;
};


// Update NFL Product
export const updateNFLProduct = async(nflObject)=>{
    const [results] = await pool.query(`UPDATE nfl_products SET league = ?, team = ?, gender = ?, product_name = ?, product_desc = ?, img = ?, price = ?, category = ? WHERE id = ?`,
    [nflObject.league, nflObject.team, nflObject.gender, nflObject.product_name, nflObject.product_desc, nflObject.img, nflObject.price, nflObject.category, nflObject.id]
);

    const rows = results[0];
    return rows;
}

//Delete NFL Product
export const deleteNFLProduct = async (id) => {
    const results = await pool.query(`DELETE FROM nfl_products  WHERE id = ?`,[id]);
    return results;
};




// <-------------------- NBA-------------------->//

// View All NBA Products
export const getNBAProducts = async()=>{
    const results = await pool.query(`SELECT * FROM nba_products`)
    const rows = results[0];
    return rows;
}

// View Single NBA Product
export const getNBAProduct = async(id)=>{
    const [results] = await pool.query(`SELECT * FROM nba_products WHERE id = ?`, id)
    const rows = results[0];
    return rows;
}

export const createNBAProduct = async (nbaObject) => {
    const [results] = await pool.query(
        `INSERT INTO nba_products (league, team, gender, product_name, product_desc, img, price, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nbaObject.league, nbaObject.team, nbaObject.gender, nbaObject.product_name, nbaObject.product_desc, nbaObject.img, nbaObject.price, nbaObject.category]
    );
    const rows = results[0];
    return rows;
};

// Update NBA Product
export const updateNBAProduct = async(nbaObject)=>{
    const [results] = await pool.query(`UPDATE nba_products SET league = ?, team = ?, gender = ?, product_name = ?, product_desc = ?, img = ?, price = ?, category = ? WHERE id = ?`,
    [nbaObject.league, nbaObject.team, nbaObject.gender, nbaObject.product_name, nbaObject.product_desc, nbaObject.img, nbaObject.price, nbaObject.category, nbaObject.id]
);

    const rows = results[0];
    return rows;
}

//Delete NBA Product
export const deleteNBAProduct = async (id) => {
    const results = await pool.query(`DELETE FROM nba_products  WHERE id = ?`,[id]);
    return results;
};




// <-------------------- NHL -------------------->//

// View All NHL Products
export const getNHLProducts = async()=>{
    const results = await pool.query(`SELECT * FROM nhl_products`)
    const rows = results[0];
    return rows;
}

// View Single NHL Product
export const getNHLProduct = async(id)=>{
    const [results] = await pool.query(`SELECT * FROM nhl_products WHERE id = ?`, id)
    const rows = results[0];
    return rows;
}

// Create New NHL Product
export const createNHLProduct = async(nhlObject)=>{
    const [results] = await pool.query(`INSERT INTO nhl_products (league, team, gender, product_name, product_desc, img, price, category)  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    nhlObject.league, nhlObject.team, nhlObject.gender, nhlObject.product_name, nhlObject.product_desc, nhlObject.img, nhlObject.price, nhlObject.category )
    const rows = results[0];
    return rows;
}

// Update NHL Product
export const updateNHLProduct = async(nhlObject)=>{
    const [results] = await pool.query(`UPDATE  nhl_products SET league = ?, team = ?, gender = ?, product_name = ?, product_desc, = ?, img = ?, price = ?, category = ?   WHERE id = ?`,
    nhlObject.league, nhlObject.team, nhlObject.gender, nhlObject.product_name, nhlObject.product_desc, nhlObject.img, nhlObject.price, nhlObject.category, nhlObject.id )
    const rows = results[0];
    return rows;
}

//Delete NHL Product
export const deleteNHLProduct = async (id) => {
    const results = await pool.query(`DELETE FROM nhl_products  WHERE id = ?`,[id]);
    return results;
};



// <-------------------- mlb -------------------->//

// View All MLB Products
export const getMLBProducts = async()=>{
    const results = await pool.query(`SELECT * FROM mlb_products`)
    const rows = results[0];
    return rows;
}

// View Single MLB Product
export const getMLBProduct = async(id)=>{
    const [results] = await pool.query(`SELECT * FROM mlb_products WHERE id = ?`, id)
    const rows = results[0];
    return rows;
}

// Create New MLB Product
export const createMLBProduct = async(mlbObject)=>{
    const [results] = await pool.query(`INSERT INTO mlb_products (league, team, gender, product_name, product_desc, img, price, category)  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    mlbObject.league, mlbObject.team, mlbObject.gender, mlbObject.product_name, mlbObject.product_desc, mlbObject.img, mlbObject.price, mlbObject.category )
    const rows = results[0];
    return rows;
}

// Update MLB Product
export const updateMLBProduct = async(mlbObject)=>{
    const [results] = await pool.query(`UPDATE  mlb_products SET league = ?, team = ?, gender = ?, product_name = ?, product_desc, = ?, img = ?, price = ?, category = ?   WHERE id = ?`,
    mlbObject.league, mlbObject.team, mlbObject.gender, mlbObject.product_name, mlbObject.product_desc, mlbObject.img, mlbObject.price, mlbObject.category, mlbObject.id )
    const rows = results[0];
    return rows;
}

//Delete MLB Product
export const deleteMLBProduct = async (id) => {
    const results = await pool.query(`DELETE FROM mlb_products  WHERE id = ?`,[id]);
    return results;
};



//<------------------------- Admin Login ------------------------->//
//Viewing All Users
export const getAllAdmin = async() => {
    const result = await pool.query(`
                SELECT * FROM admin `);
    const rows = result[0];
    return rows;
}

//View Single Admin
export const getSingleAdmin = async(vID) => {
    const result = await pool.query(`SELECT * FROM admin WHERE id = ?`, [vID]);
    const rows = result[0];
    return rows;
}


//Create Admin
export const saveAdmin = async(oAdmin) =>{
    const result = await pool.query(`INSERT INTO admin(frst_nm, lst_nm, email, password) VALUES(?, ?, ?, ?)`,
     [oAdmin.frst_nm, oAdmin.lst_nm, oAdmin.email, oAdmin.password, ]);
   return result;    
}

export const isLoginCorrect = async(email) => {
    const result = await pool.query(`SELECT * FROM admin WHERE email = ? `, [email]);

    const rows = result[0];

    return rows;
}