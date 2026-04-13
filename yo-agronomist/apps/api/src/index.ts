import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient, ChannelType, FarmerType, CropKey, MessageDirection, MessageStatus, AdvisorySource } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const app = express();
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || "replace_with_secure_secret";

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
const advisorySchema = z.object({ district: z.string(), crop: z.nativeEnum(CropKey), farmerType: z.nativeEnum(FarmerType), farmerId: z.string().optional() });

const cropProfiles: Record<CropKey, { label: string; planting: string; spacing: string; fertilizer: string; pest: string; harvest: string }> = {
  MAIZE: { label: "Maize", planting: "Plant at onset of consistent rains.", spacing: "75 cm x 30 cm", fertilizer: "Use compost or soil-test-guided fertilizer.", pest: "Scout early for fall armyworm.", harvest: "Harvest when cobs dry and grains harden." },
  BEANS: { label: "Beans", planting: "Plant after effective rains are established.", spacing: "50 cm x 10 cm", fertilizer: "Use manure and phosphorus where needed.", pest: "Watch for bean stem maggot.", harvest: "Harvest before pod shattering." },
  BANANA: { label: "Banana", planting: "Plant at start of rainy season.", spacing: "3 m x 3 m", fertilizer: "Apply manure and mulch.", pest: "Monitor for weevils and BXW.", harvest: "Harvest based on bunch maturity." },
  COFFEE: { label: "Coffee", planting: "Plant at onset of rainy season.", spacing: "Depends on variety and system", fertilizer: "Use organic matter and targeted nutrition.", pest: "Watch for leaf rust and berry disease.", harvest: "Pick ripe cherries only." },
  TOMATO: { label: "Tomato", planting: "Transplant when weather is stable.", spacing: "90 cm x 60 cm", fertilizer: "Use decomposed manure and split nutrients.", pest: "Monitor blight and Tuta absoluta.", harvest: "Harvest by market maturity stage." }
};

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !user.passwordHash) return res.status(401).json({ error: "Invalid email or password" });
    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid email or password" });
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Login failed" });
  }
});

app.get("/farmers", async (_req, res) => {
  const farmers = await prisma.farmer.findMany({ include: { cropInterests: true }, orderBy: { createdAt: "desc" } });
  res.json(farmers.map(f => ({ ...f, cropsOfInterest: f.cropInterests.map(c => c.crop) })));
});

app.get("/meta/crops", (_req, res) => {
  res.json(Object.entries(cropProfiles).map(([key, value]) => ({ key, ...value })));
});

app.get("/alerts", async (_req, res) => {
  res.json(await prisma.farmerAlert.findMany({ orderBy: { createdAt: "desc" }, take: 100 }));
});

app.get("/chat", async (_req, res) => {
  const messages = await prisma.messageLog.findMany({ where: { channel: ChannelType.APP }, orderBy: { createdAt: "desc" }, take: 100 });
  res.json(messages.map(m => ({ id: m.id, farmerId: m.farmerId, role: m.direction === MessageDirection.INBOUND ? "user" : "assistant", content: m.content, createdAt: m.createdAt })));
});

app.post("/advisory", async (req, res) => {
  try {
    const input = advisorySchema.parse(req.body);
    const crop = cropProfiles[input.crop];
    const weather = await prisma.weatherSnapshot.findFirst({ where: { district: input.district }, orderBy: { forecastDate: "desc" } });
    const market = await prisma.marketPrice.findFirst({ where: { district: input.district, crop: input.crop }, orderBy: { collectedAt: "desc" } });
    const plantingWindow = weather?.onsetSignal && !weather?.drySpellRisk ? "Plant within the next 7 days after confirming two effective rain events." : weather?.drySpellRisk ? "Delay planting until rainfall stabilizes." : "Wait for rainfall confirmation before planting.";
    const districtAdvice = weather ? `Forecast for ${input.district}: rainfall ${weather.rainfallMm ?? "N/A"} mm, temperatures ${weather.temperatureMinC ?? "N/A"}-${weather.temperatureMaxC ?? "N/A"}°C.` : `No recent weather snapshot found for ${input.district}.`;
    const marketSignal = market ? `${input.crop} price in ${market.district}: ${market.price} ${market.currency}/${market.unit}.` : "No recent market price available.";
    const advisoryText = `${districtAdvice} Recommended planting window: ${plantingWindow} Planting guidance: ${crop.planting} Spacing: ${crop.spacing} Nutrition: ${crop.fertilizer} Pest watch: ${crop.pest} Market signal: ${marketSignal}`;
    const saved = await prisma.advisoryLog.create({ data: { farmerId: input.farmerId, district: input.district, crop: input.crop, plantingWindow, advisoryText, confidence: weather?.onsetSignal ? "High" : "Medium", source: AdvisorySource.HYBRID } });
    res.json({ id: saved.id, district: input.district, crop: crop.label, plantingWindow, districtAdvice, confidence: weather?.onsetSignal ? "High" : "Medium", marketSignal, agronomy: crop, channelMessage: { sms: `YO AGRONOMIST: ${input.district} ${crop.label} advice: ${plantingWindow}`, whatsapp: advisoryText } });
  } catch (e) {
    res.status(400).json({ error: e instanceof Error ? e.message : "Failed to generate advisory" });
  }
});

app.listen(PORT, () => console.log(`API running on ${PORT}`));
