import bcrypt from "bcryptjs";
import {
  AdvisorySource,
  AlertType,
  ChannelType,
  CropKey,
  FarmerType,
  MessageDirection,
  MessageStatus,
  PrismaClient,
  SubscriptionPlan,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.messageLog.deleteMany();
  await prisma.farmerAlert.deleteMany();
  await prisma.advisoryLog.deleteMany();
  await prisma.marketPrice.deleteMany();
  await prisma.pestObservation.deleteMany();
  await prisma.weatherSnapshot.deleteMany();
  await prisma.seasonPlan.deleteMany();
  await prisma.farmProfile.deleteMany();
  await prisma.farmerCrop.deleteMany();
  await prisma.farmer.deleteMany();
  await prisma.alertRule.deleteMany();
  await prisma.knowledgeDocument.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Admin@12345", 10);
  const admin = await prisma.user.create({
    data: { fullName: "System Administrator", email: "admin@yoagronomist.com", passwordHash, role: "admin" }
  });

  const farmer = await prisma.farmer.create({
    data: {
      farmerCode: "YO-PAUL-000001",
      fullName: "Paul Farms",
      phoneNumber: "+256700000001",
      region: "Western",
      district: "Mbarara",
      farmerType: FarmerType.COMMERCIAL,
      preferredChannel: ChannelType.WHATSAPP,
      language: "English",
      farmSizeAcres: 50,
      soilType: "Loam",
      subscriptionPlan: SubscriptionPlan.FREE,
      cropInterests: { create: [{ crop: CropKey.COFFEE, priority: 1 }, { crop: CropKey.BANANA, priority: 2 }] },
      farmProfiles: { create: [{ name: "Paul Main Estate", district: "Mbarara", acreage: 50, soilType: "Loam", irrigationAccess: true }] }
    },
    include: { farmProfiles: true }
  });

  await prisma.weatherSnapshot.createMany({
    data: [
      { district: "Mbarara", forecastDate: new Date(), rainfallMm: 18, temperatureMinC: 22, temperatureMaxC: 28, humidityPct: 72, onsetSignal: true, drySpellRisk: false, source: "seed" },
      { district: "Gulu", forecastDate: new Date(), rainfallMm: 8, temperatureMinC: 24, temperatureMaxC: 33, humidityPct: 60, onsetSignal: false, drySpellRisk: false, source: "seed" }
    ]
  });

  await prisma.pestObservation.create({
    data: { district: "Gulu", crop: CropKey.MAIZE, pestName: "Fall armyworm", riskLevel: "Medium", observedAt: new Date(), source: "seed" }
  });

  await prisma.marketPrice.create({
    data: { district: "Mbarara", crop: CropKey.COFFEE, marketName: "Mbarara Coffee Hub", unit: "kg", price: 9800, currency: "UGX", collectedAt: new Date(), source: "seed" }
  });

  await prisma.knowledgeDocument.create({
    data: { title: "Uganda Coffee Advisory Notes", category: "crop-guideline", crop: CropKey.COFFEE, district: "Mbarara", content: "Coffee should be planted at onset of rainy season with proper spacing, mulching, and regular disease scouting.", source: "seed", version: "1.0" }
  });

  await prisma.advisoryLog.create({
    data: {
      farmerId: farmer.id,
      district: "Mbarara",
      crop: CropKey.COFFEE,
      question: "When should I plant coffee in Mbarara?",
      plantingWindow: "Plant within the next 7 days after confirming two effective rain events.",
      advisoryText: "Conditions are favorable for coffee establishment and field management in Mbarara.",
      confidence: "High",
      source: AdvisorySource.HYBRID
    }
  });

  await prisma.messageLog.createMany({
    data: [
      { farmerId: farmer.id, channel: ChannelType.WHATSAPP, direction: MessageDirection.OUTBOUND, phoneNumber: farmer.phoneNumber, content: "Conditions are favorable in Mbarara for coffee establishment.", provider: "mock-whatsapp", providerMessageId: "wa_10002", status: MessageStatus.DELIVERED },
      { farmerId: farmer.id, channel: ChannelType.APP, direction: MessageDirection.INBOUND, content: "When should I plant coffee in Mbarara?", provider: "seed", status: MessageStatus.DELIVERED }
    ]
  });

  await prisma.auditLog.create({
    data: { actorUserId: admin.id, action: "SEED_DATABASE", entityType: "System", entityId: "initial-seed", details: { farmers: 1 } }
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
