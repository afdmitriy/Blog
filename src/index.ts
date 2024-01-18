import { rundb } from './db/db';
import { app } from './settings';

const PORT = 3000;

app.listen(PORT, async () => {
   console.log(`App listening on port ${PORT}`);
   await rundb();
});
