import type { Metadata } from "next";
import { ChambersPageContent } from "@/components/chambers/ChambersPageContent";

export const metadata: Metadata = {
  title: "Chambers & Schedule | Dr. Sahidur Rahman Khan",
  description:
    "Consult with Dr. Md. Sahidur Rahman Khan, Orthopedic & Trauma Surgeon, at any of his 4 chambers in Dhaka and Manikganj. View schedules, assistant details, and book your appointment.",
};

export default function ChambersPage() {
  return <ChambersPageContent />;
}
