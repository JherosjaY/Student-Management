import { createApp } from './app.js';

const PORT = 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`\n🚀 API Server ready at http://localhost:${PORT}`);
  console.log(`🚀 Web Client ready at http://localhost:5173\n`);
});
