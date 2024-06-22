import pg from "pg-promise";
const pgp = pg();

const cnstr = `postgresql://postgres:12345@localhost:5432/database_items`;
const database = pgp(cnstr);

database.connect()
  .then(() => {
    console.log("Conexion Exitosa");
  })
  .catch((err) => {
    console.log(`Error de conexion: ${err}`);
  });

export { database };