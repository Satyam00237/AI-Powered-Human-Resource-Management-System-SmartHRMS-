import app from './app.js';
import config from './config/env.js';
import { ensureConnected } from './config/database.js';

// Local development server runner (Vercel uses the serverless export of app)
if (!config.IS_VERCEL) {
  ensureConnected().then(() => {
    app.listen(config.PORT, () => {
      console.log(`===============================================`);
      console.log(`  SmartHRMS Backend API running on port ${config.PORT} `);
      console.log(`  Targeting database: MongoDB                   `);
      console.log(`===============================================`);
    });
  }).catch((err) => {
    console.error('Failed to start server:', err);
  });
}

export default app;
