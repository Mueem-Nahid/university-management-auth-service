import mongoose from "mongoose";

import app from "./app";
import config from "./config";


// database connection
async function bootstrap() {
   try {
      await mongoose.connect(config.database_url as string);
      console.log('Database connection successful !!!');

      app.listen(config.port, () => {
         console.log(`Server listening on port ${config.port} ...`)
      })
   } catch (error) {
      console.log(`Failed to connect data`, error);
   }
}

bootstrap()

