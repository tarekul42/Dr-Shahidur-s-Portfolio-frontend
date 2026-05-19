export interface ChamberSchedule {
  daysEn: string;
  daysBn: string;
  timeEn: string;
  timeBn: string;
}

export interface Chamber {
  id: string;
  isPrimary: boolean;
  hospitalEn: string;
  hospitalBn: string;
  addressEn: string;
  addressBn: string;
  roomEn: string;
  roomBn: string;
  schedule: ChamberSchedule[];
  serialPhone: string[];
  appName?: string;
  appUrl?: string;
  assistantEn: string;
  assistantBn: string;
  mapUrl: string;
  /** ISO day-of-week numbers for date picker filtering (0=Sun, 1=Mon, ..., 6=Sat) */
  availableDays: number[];
  /** Time slots for appointment form, in 24h "HH:mm" format */
  timeSlots: string[];
}

export const CHAMBERS: Chamber[] = [
  {
    id: "dhaka",
    isPrimary: true,
    hospitalEn: "Ibn Sina Medical College Hospital",
    hospitalBn: "ইবনে সিনা মেডিকেল কলেজ হাসপাতাল",
    addressEn: "1/1-B, Kalyanpur, Dhaka",
    addressBn: "১/১-বি, কল্যাণপুর, ঢাকা",
    roomEn: "Room 205 (2nd Floor, Lift 1), Hospital Building",
    roomBn: "কক্ষ নং ২০৫ (২য় তলা, লিফটের ১), হাসপাতাল ভবন",
    schedule: [
      {
        daysEn: "Sat, Mon, Wed",
        daysBn: "শনি, সোম, বুধ",
        timeEn: "6:00 PM – 9:00 PM",
        timeBn: "বিকেল ৬ঃ০০টা – রাত ৯ঃ০০টা",
      },
      {
        daysEn: "Friday",
        daysBn: "শুক্রবার",
        timeEn: "8:00 PM – 9:00 PM",
        timeBn: "রাত ৮ঃ০০টা – ৯ঃ০০টা",
      },
    ],
    serialPhone: ["+8809610009616", "01703725590"],
    appName: "Ibn Sina Doctor Appointment",
    appUrl:
      "https://play.google.com/store/search?q=Ibn+Sina+Doctor+Appointment",
    assistantEn: "01777079696 (Farzana)",
    assistantBn: "০১৭৭৭০৭৯৬৯৬ (ফারজানা)",
    mapUrl:
      "https://maps.google.com/?q=Ibn+Sina+Medical+College+Hospital+Kalyanpur+Dhaka",
    availableDays: [1, 3, 5, 6], // Mon=1, Wed=3, Fri=5, Sat=6
    timeSlots: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"],
  },
  {
    id: "jhitka",
    isPrimary: false,
    hospitalEn: "Payra Hospital Limited",
    hospitalBn: "পায়রা হসপিটাল লিমিটেড",
    addressEn: "Jhitkabazar, Harirampur, Manikganj",
    addressBn: "ঝিটকাবাজার, হরিরামপুর, মানিকগঞ্জ",
    roomEn: "Room 103",
    roomBn: "কক্ষ নং ১০৩",
    schedule: [
      {
        daysEn: "Thursday",
        daysBn: "বৃহস্পতিবার",
        timeEn: "4:00 PM – 8:00 PM",
        timeBn: "বিকাল ৪টা থেকে রাত ৮টা",
      },
    ],
    serialPhone: ["01778455552"],
    appName: undefined,
    appUrl: undefined,
    assistantEn: "01619220033 (Mishu)",
    assistantBn: "০১৬১৯২২০০৩৩ (মিশু)",
    mapUrl:
      "https://maps.google.com/?q=Payra+Hospital+Jhitkabazar+Harirampur+Manikganj",
    availableDays: [4], // Thu=4
    timeSlots: [
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
    ],
  },
  {
    id: "manikganj",
    isPrimary: false,
    hospitalEn: "Islami Bank Community Hospital, Manikganj",
    hospitalBn: "ইসলামি ব্যাংক কমিউনিটি হাসপাতাল, মানিকগঞ্জ",
    addressEn: "Joyra Road, Bus Stand, Manikganj",
    addressBn: "জয়রা রোড, বাসস্ট্যান্ড, মানিকগঞ্জ",
    roomEn: "Room 107 (Ground Floor)",
    roomBn: "কক্ষ নং ১০৭ (নীচ তলা)",
    schedule: [
      {
        daysEn: "Friday",
        daysBn: "শুক্রবার",
        timeEn: "10:00 AM – 5:00 PM",
        timeBn: "সকাল ১০টা থেকে বিকাল ৫টা পর্যন্ত",
      },
    ],
    serialPhone: ["01711608502"],
    appName: undefined,
    appUrl: undefined,
    assistantEn: "01777688659 (Rakib), 01619220033 (Mishu)",
    assistantBn: "০১৭৭৭৬৮৮৬৫৯ (রাকিব), ০১৬১৯২২০০৩৩ (মিশু)",
    mapUrl:
      "https://maps.google.com/?q=Islami+Bank+Community+Hospital+Manikganj",
    availableDays: [5], // Fri=5
    timeSlots: [
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
    ],
  },
  {
    id: "singair",
    isPrimary: false,
    hospitalEn: "Singair City Hospital & Diagnostic Center",
    hospitalBn: "সিংগাইর সিটি হাসপিটাল এন্ড ডায়াগনস্টিক সেন্টার",
    addressEn: "Singair, Manikganj",
    addressBn: "সিংগাইর, মানিকগঞ্জ",
    roomEn: "Room 207 (2nd Floor)",
    roomBn: "কক্ষ নং ২০৭ (২য় তলা)",
    schedule: [
      {
        daysEn: "Saturday",
        daysBn: "শনিবার",
        timeEn: "3:00 PM – 5:00 PM",
        timeBn: "দুপুর ৩টা থেকে ৫টা",
      },
    ],
    serialPhone: ["01868783819"],
    appName: undefined,
    appUrl: undefined,
    assistantEn: "01777688659 (Rakib)",
    assistantBn: "০১৭৭৭৬৮৮৬৫৯ (রাকিব)",
    mapUrl:
      "https://maps.google.com/?q=Singair+City+Hospital+Singair+Manikganj",
    availableDays: [6], // Sat=6
    timeSlots: ["15:00", "15:30", "16:00", "16:30", "17:00"],
  },
];

export interface ChamberFallback {
  id: string;
  chemberName: string;
  map: string;
  activeDates: Array<{
    activeDay: string;
    startTime: string;
    endTime: string;
  }>;
  address: string;
  addressBn: string;
  phone: string;
  assistantName: string;
  assistantNameBn: string;
  room: string;
  isPrimary: boolean;
  roomBn?: string;
}

export const CHAMBERS_FALLBACK: ChamberFallback[] = [
  {
    id: "dhaka",
    chemberName: "Ibn Sina Medical College Hospital",
    map: "https://maps.google.com/?q=Ibn+Sina+Medical+College+Hospital+Kalyanpur+Dhaka",
    activeDates: [
      { activeDay: "SATURDAY", startTime: "18:00", endTime: "21:00" },
      { activeDay: "MONDAY", startTime: "18:00", endTime: "21:00" },
      { activeDay: "WEDNESDAY", startTime: "18:00", endTime: "21:00" },
      { activeDay: "FRIDAY", startTime: "20:00", endTime: "21:00" },
    ],
    address: "1/1-B, Kalyanpur, Dhaka",
    addressBn: "১/১-বি, কল্যাণপুর, ঢাকা",
    phone: "+8809610009616",
    assistantName: "01777079696 (Farzana)",
    assistantNameBn: "০১৭৭৭০৭৯৬৯৬ (ফারজানা)",
    room: "Room 205 (2nd Floor, Lift 1), Hospital Building",
    roomBn: "কক্ষ নং ২০৫ (২য় তলা, লিফটের ১), হাসপাতাল ভবন",
    isPrimary: true,
  },
  {
    id: "jhitka",
    chemberName: "Payra Hospital Limited",
    map: "https://maps.google.com/?q=Payra+Hospital+Jhitkabazar+Harirampur+Manikganj",
    activeDates: [
      { activeDay: "THURSDAY", startTime: "16:00", endTime: "20:00" },
    ],
    address: "Jhitkabazar, Harirampur, Manikganj",
    addressBn: "ঝিটকাবাজার, হরিরামপুর, মানিকগঞ্জ",
    phone: "01778455552",
    assistantName: "01619220033 (Mishu)",
    assistantNameBn: "০১৬১৯২২০০৩৩ (মিশু)",
    room: "Room 103",
    roomBn: "কক্ষ নং ১০৩",
    isPrimary: false,
  },
  {
    id: "manikganj",
    chemberName: "Islami Bank Community Hospital, Manikganj",
    map: "https://maps.google.com/?q=Islami+Bank+Community+Hospital+Manikganj",
    activeDates: [
      { activeDay: "FRIDAY", startTime: "10:00", endTime: "17:00" },
    ],
    address: "Joyra Road, Bus Stand, Manikganj",
    addressBn: "জয়রা রোড, বাসস্ট্যান্ড, মানিকগঞ্জ",
    phone: "01711608502",
    assistantName: "01777688659 (Rakib), 01619220033 (Mishu)",
    assistantNameBn: "০১৭৭৭৬৮৮৬৫৯ (রাকিব), ০১৬১৯২২০০৩৩ (মিশু)",
    room: "Room 107 (Ground Floor)",
    roomBn: "কক্ষ নং ১০৭ (নীচ তলা)",
    isPrimary: false,
  },
  {
    id: "singair",
    chemberName: "Singair City Hospital & Diagnostic Center",
    map: "https://maps.google.com/?q=Singair+City+Hospital+Singair+Manikganj",
    activeDates: [
      { activeDay: "SATURDAY", startTime: "15:00", endTime: "17:00" },
    ],
    address: "Singair, Manikganj",
    addressBn: "সিংগাইর, মানিকগঞ্জ",
    phone: "01868783819",
    assistantName: "01777688659 (Rakib)",
    assistantNameBn: "০১৭৭৭৬৮৮৬৫৯ (রাকিব)",
    room: "Room 207 (2nd Floor)",
    roomBn: "কক্ষ নং ২০৭ (২য় তলা)",
    isPrimary: false,
  },
];

import type { ChamberEnrichment } from "@/types/chamber";

export const CHAMBER_ENRICHMENT: Record<string, ChamberEnrichment> = {
  dhaka: {
    chamberId: "dhaka",
    address: "1/1-B, Kalyanpur, Dhaka",
    addressBn: "১/১-বি, কল্যাণপুর, ঢাকা",
    phone: "+8809610009616",
    assistantName: "01777079696 (Farzana)",
    assistantNameBn: "০১৭৭৭০৭৯৬৯৬ (ফারজানা)",
    room: "Room 205 (2nd Floor, Lift 1), Hospital Building",
    roomBn: "কক্ষ নং ২০৫ (২য় তলা, লিফটের ১), হাসপাতাল ভবন",
    isPrimary: true,
  },
  jhitka: {
    chamberId: "jhitka",
    address: "Jhitkabazar, Harirampur, Manikganj",
    addressBn: "ঝিটকাবাজার, হরিরামপুর, মানিকগঞ্জ",
    phone: "01778455552",
    assistantName: "01619220033 (Mishu)",
    assistantNameBn: "০১৬১৯২২০০৩৩ (মিশু)",
    room: "Room 103",
    roomBn: "কক্ষ নং ১০৩",
    isPrimary: false,
  },
  manikganj: {
    chamberId: "manikganj",
    address: "Joyra Road, Bus Stand, Manikganj",
    addressBn: "জয়রা রোড, বাসস্ট্যান্ড, মানিকগঞ্জ",
    phone: "01711608502",
    assistantName: "01777688659 (Rakib), 01619220033 (Mishu)",
    assistantNameBn: "০১৭৭৭৬৮৮৬৫৯ (রাকিব), ০১৬১৯২২০০৩৩ (মিশু)",
    room: "Room 107 (Ground Floor)",
    roomBn: "কক্ষ নং ১০৭ (নীচ তলা)",
    isPrimary: false,
  },
  singair: {
    chamberId: "singair",
    address: "Singair, Manikganj",
    addressBn: "সিংগাইর, মানিকগঞ্জ",
    phone: "01868783819",
    assistantName: "01777688659 (Rakib)",
    assistantNameBn: "০১৭৭৭৬৮৮৬৫৯ (রাকিব)",
    room: "Room 207 (2nd Floor)",
    roomBn: "কক্ষ নং ২০৭ (২য় তলা)",
    isPrimary: false,
  },
};
