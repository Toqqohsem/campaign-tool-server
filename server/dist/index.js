"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const campaigns_1 = require("./routes/campaigns");
const personas_1 = require("./routes/personas");
const leads_1 = require("./routes/leads");
const assets_1 = require("./routes/assets");
const adcopy_1 = require("./routes/adcopy");
const ml_1 = require("./routes/ml");
const s3_1 = require("./routes/s3");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use('/api/campaigns', campaigns_1.campaignRoutes);
app.use('/api/personas', personas_1.personaRoutes);
app.use('/api/leads', leads_1.leadRoutes);
app.use('/api/creative-assets', assets_1.creativeAssetRoutes);
app.use('/api/ad-copy', adcopy_1.adCopyRoutes);
app.use('/api/ml', ml_1.mlRoutes);
app.use('/api/s3', s3_1.s3Routes);
app.get('/api/health', (req, res) => {
    res.status(200).send('Backend is healthy!');
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
