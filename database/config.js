const mongoose = require('mongoose');

const urlDB = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}Z@clustercafe.akx9m.mongodb.net/cafeDB`;
const dbConn = async () => {
  try {
    await mongoose.connect(urlDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  } catch (e) {
    console.log(e);
    throw new Error('Error de conexión a la base de datos');
  }
  console.log('base de datos online');
};

module.exports = {
  dbConn,
};
