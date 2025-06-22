import { log } from 'console';
import 'dotenv/config';
import express from 'express';

const app = express();

app.listen(process.env.PORT ?? 3030, () => {
   log(`Server is running on port ${process.env.PORT ?? 3030}`);
});
