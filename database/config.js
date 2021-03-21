const mongoose = require('mongoose');
const dbConn = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
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
