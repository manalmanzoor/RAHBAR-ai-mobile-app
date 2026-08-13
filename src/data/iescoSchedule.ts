export const IESCO_SNAPSHOT_DATE = "11 August 2026";
export const TARGET_STREET = "Street 12, Soan Garden, Islamabad";
export const FEEDER_NAME = "Soan Garden-I Feeder (132kV Rawat Grid)";

export const IESCO_FEEDERS_DATA = [
  {
    feeder: "Soan Garden-I / II Feeder",
    scheduledOutage: "06:00 AM – 10:00 AM",
    status: "Normal on schedule (03:00 PM - 05:00 PM)",
    notes: "Official schedule lists no planned outage for afternoon, but local grid load peak expected"
  },
  {
    feeder: "Kuri Road Feeder",
    scheduledOutage: "05:00 AM – 10:00 AM (Tomorrow)",
    status: "Scheduled Maintenance Tomorrow",
    notes: "Transformer testing and line maintenance"
  },
  {
    feeder: "132kV GSS Rawat-II",
    scheduledOutage: "08:00 AM – 05:00 PM",
    status: "Grid overload maintenance",
    notes: "Power Transformer T-1 load balancing"
  }
];

export const NEPRA_REPORT_QUOTE = {
  source: "NEPRA Performance Evaluation Report FY 2024–25",
  quote: "Consumers continued to face frequent and unannounced power outages, often linked to system faults. Furthermore, the reliability of outage data remains uncertain, as most DISCOs still lack automated mechanisms for accurately recording and monitoring interruptions, especially in low-tension (LT) networks.",
  impact: "Rahbar fills this exact data gap by sensing ground-level street reports."
};
