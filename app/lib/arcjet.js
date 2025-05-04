import arcjet, { tokenBucket } from "@arcjet/next";

let aj;
try {
  aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["userId"],
    rules: [
      tokenBucket({
        mode: "LIVE",
        refillRate: 10,
        interval: 3600,
        capacity: 10,
      }),
    ],
  });
} catch (err) {
  console.error("Arcjet initialization failed:", err);
}


export default aj;