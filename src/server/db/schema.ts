// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  role: text("role").default("user").notNull(),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: integer("ban_expires"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  impersonatedBy: text("impersonated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const rateLimitsTable = pgTable("rate_limit", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  lastRequest: integer("last_request").notNull(),
});

export const vehiclesTable = pgTable("vehicles", {
  make: text("make"),
  model: text("model"),
  annualPetroleumConsumptionForFuelType1: doublePrecision(
    "Annual Petroleum Consumption For Fuel Type1",
  ),
  annualPetroleumConsumptionForFuelType2: doublePrecision(
    "Annual Petroleum Consumption For Fuel Type2",
  ),
  timeToChargeAt120V: doublePrecision("Time to charge at 120V"),
  timeToChargeAt240V: doublePrecision("Time to charge at 240V"),
  cityMpgForFuelType1: integer("City Mpg For Fuel Type1"),
  "unroundedCityMpgForFuelType1 (2)": doublePrecision(
    "Unrounded City Mpg For Fuel Type1 (2)",
  ),
  cityMpgForFuelType2: integer("City Mpg For Fuel Type2"),
  unroundedCityMpgForFuelType2: doublePrecision(
    "Unrounded City Mpg For Fuel Type2",
  ),
  cityGasolineConsumption: doublePrecision("City gasoline consumption"),
  cityElectricityConsumption: doublePrecision("City electricity consumption"),
  epaCityUtilityFactor: doublePrecision("EPA city utility factor"),
  co2FuelType1: integer("Co2 Fuel Type1"),
  co2FuelType2: integer("Co2 Fuel Type2"),
  co2TailpipeForFuelType2: doublePrecision("Co2  Tailpipe For Fuel Type2"),
  co2TailpipeForFuelType1: doublePrecision("Co2  Tailpipe For Fuel Type1"),
  combinedMpgForFuelType1: integer("Combined Mpg For Fuel Type1"),
  unroundedCombinedMpgForFuelType1: doublePrecision(
    "Unrounded Combined Mpg For Fuel Type1",
  ),
  combinedMpgForFuelType2: integer("Combined Mpg For Fuel Type2"),
  unroundedCombinedMpgForFuelType2: doublePrecision(
    "Unrounded Combined Mpg For Fuel Type2",
  ),
  combinedElectricityConsumption: doublePrecision(
    "Combined electricity consumption",
  ),
  combinedGasolineConsumption: doublePrecision("Combined gasoline consumption"),
  epaCombinedUtilityFactor: doublePrecision("EPA combined utility factor"),
  cylinders: integer("cylinders"),
  engineDisplacement: doublePrecision("Engine displacement"),
  drive: text("drive"),
  epaModelTypeIndex: text("EPA model type index"),
  engineDescriptor: text("Engine descriptor"),
  epaFuelEconomyScore: text("EPA Fuel Economy Score"),
  annualFuelCostForFuelType1: text("Annual Fuel Cost For Fuel Type1"),
  annualFuelCostForFuelType2: text("Annual Fuel Cost For Fuel Type2"),
  fuelType: text("Fuel Type"),
  fuelType1: text("Fuel Type1"),
  ghgScore: text("GHG Score"),
  ghgScoreAlternativeFuel: text("GHG Score Alternative Fuel"),
  highwayMpgForFuelType1: text("Highway Mpg For Fuel Type1"),
  unroundedHighwayMpgForFuelType1: text("Unrounded Highway Mpg For Fuel Type1"),
  highwayMpgForFuelType2: text("Highway Mpg For Fuel Type2"),
  unroundedHighwayMpgForFuelType2: text("Unrounded Highway Mpg For Fuel Type2"),
  highwayGasolineConsumption: text("Highway gasoline consumption"),
  highwayElectricityConsumption: text("Highway electricity consumption"),
  epaHighwayUtilityFactor: text("EPA highway utility factor"),
  hatchbackLuggageVolume: text("Hatchback luggage volume"),
  hatchbackPassengerVolume: text("Hatchback passenger volume"),
  id: text("id").primaryKey().notNull(),
  "2DoorLuggageVolume": text("2 door luggage volume"),
  "4DoorLuggageVolume": text("4 door luggage volume"),
  mpgData: text("MPG Data"),
  phevBlended: text("PHEV Blended"),
  "2DoorPassengerVolume": text("2-door passenger volume"),
  "4DoorPassengerVolume": text("4-door passenger volume"),
  rangeForFuelType1: text("Range For Fuel Type1"),
  rangeCityForFuelType1: text("Range  City For Fuel Type1"),
  rangeCityForFuelType2: text("Range  City For Fuel Type2"),
  rangeHighwayForFuelType1: text("Range  Highway For Fuel Type1"),
  rangeHighwayForFuelType2: text("Range  Highway For Fuel Type2"),
  transmission: text("transmission"),
  unadjustedCityMpgForFuelType1: text("Unadjusted City Mpg For Fuel Type1"),
  unadjustedCityMpgForFuelType2: text("Unadjusted City Mpg For Fuel Type2"),
  unadjustedHighwayMpgForFuelType1: text(
    "Unadjusted Highway Mpg For Fuel Type1",
  ),
  unadjustedHighwayMpgForFuelType2: text(
    "Unadjusted Highway Mpg For Fuel Type2",
  ),
  vehicleSizeClass: text("Vehicle Size Class"),
  year: text("year"),
  "youSave/spend": text("You Save/Spend"),
  guzzler: text("guzzler"),
  transmissionDescriptor: text("Transmission descriptor"),
  tCharger: text("T Charger"),
  sCharger: text("S Charger"),
  atvType: text("ATV Type"),
  fuelType2: text("Fuel Type2"),
  epaRangeForFuelType2: text("Epa Range For Fuel Type2"),
  electricMotor: text("Electric motor"),
  mfrCode: text("MFR Code"),
  c240Dscr: text("c240dscr"),
  charge240B: text("charge240b"),
  c240BDscr: text("C240B Dscr"),
  createdOn: text("Created On"),
  modifiedOn: text("Modified On"),
  startStop: text("Start-Stop"),
  phevCity: text("PHEV City"),
  phevHighway: text("PHEV Highway"),
  phevCombined: text("PHEV Combined"),
  basemodel: text("basemodel"),
  msrp: doublePrecision("msrp"),
  has3D: boolean("has3D"),
  colorNames: text("color_names"),
  colorCodes: text("color_codes"),
  colorHexCodes: text("color_hex_codes"),
  modelGrade: text("model_grade"),
  modelTag: text("model_tag"),
  imageName: text("image_name"),
  imageCount: integer("image_count"),
});

export const userPreferencesTable = pgTable("user_preferences", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  vehicleTypes: text("vehicle_types").array(),
  otherVehicleType: text("other_vehicle_type"),
  usage: text("usage").array(),
  priorities: text("priorities").array(),
  features: text("features").array(),
  fuelPreference: text("fuel_preference"),
  passengerCount: integer("passenger_count"),
  paymentPlan: text("payment_plan").notNull(),
  paymentBudget: integer("payment_budget"),
  paymentMonthly: integer("payment_monthly"),
  creditScore: text("credit_score"),
  paymentDownPayment: integer("payment_down_payment"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const vehicleFeaturesCache = pgTable("vehicle_features_cache", {
  id: text("id").primaryKey(),
  vehicleId: text("vehicle_id").notNull(),
  features: jsonb("features").notNull(),
  source: text("source").notNull(),
  confidence: doublePrecision("confidence").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});
