export type Language = "en" | "bn";

type TranslationEntry = { en: string; bn: string };

export const translations: Record<string, TranslationEntry> = {
  // Appointment form step/action keys
  "appointment.step1": { en: "Personal Info", bn: "ব্যক্তিগত তথ্য" },
  "appointment.step2": { en: "Date & Time", bn: "তারিখ ও সময়" },
  "appointment.step3": { en: "Notes", bn: "নোট" },
  "appointment.step1.heading": { en: "Who is the patient?", bn: "রোগী কে?" },
  "appointment.step1.sub": {
    en: "Please provide the basic details so we can reach out to you.",
    bn: "আমরা যোগাযোগ করতে পারি তাই মৌলিক তথ্য দিন।",
  },
  "appointment.step2.heading": {
    en: "Preferred Schedule",
    bn: "পছন্দের সময়সূচী",
  },
  "appointment.step2.sub": {
    en: "Select a date and time that fits your schedule best.",
    bn: "আপনার জন্য সুবিধাজনক তারিখ ও সময় বেছে নিন।",
  },
  "appointment.step3.heading": { en: "Anything else?", bn: "আর কিছু জানাতে চান?" },
  "appointment.step3.sub": {
    en: "(Optional) Help us understand your concerns before the visit.",
    bn: "(ঐচ্ছিক) ভিজিটের আগে আপনার সমস্যা সম্পর্কে জানান।",
  },
  "appointment.received": { en: "Request Received", bn: "আবেদন গৃহীত হয়েছে" },
  "appointment.receivedDesc": {
    en: "Thank you for reaching out. We have received your request and our team will contact you shortly to finalize your appointment.",
    bn: "যোগাযোগের জন্য ধন্যবাদ। আমরা আপনার আবেদন পেয়েছি এবং শীঘ্রই যোগাযোগ করব।",
  },
  "appointment.bookAnother": {
    en: "Book Another Appointment",
    bn: "আরেকটি অ্যাপয়েন্টমেন্ট বুক করুন",
  },
  "appointment.back": { en: "Back", bn: "পিছনে" },
  "appointment.continue": { en: "Continue", bn: "চালিয়ে যান" },

  // ═══════════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════════
  "nav.home": { en: "Home", bn: "হোম" },
  "nav.articles": { en: "Articles", bn: "আর্টিকেল" },
  "nav.research": { en: "Research", bn: "গবেষণা" },
  "nav.testimonials": { en: "Testimonials", bn: "রোগীর অভিজ্ঞতা" },
  "nav.contact": { en: "Contact", bn: "যোগাযোগ" },
  "nav.bookAppointment": { en: "Book Appointment", bn: "অ্যাপয়েন্টমেন্ট বুক করুন" },

  // ═══════════════════════════════════════════════════════
  // HERO SECTION
  // ═══════════════════════════════════════════════════════
  "hero.badge": {
    en: "Ilizarov, Spine & Orthopedic Trauma Specialist",
    bn: "ইলিজারভ, স্পাইন ও অর্থোপেডিক ট্রমা বিশেষজ্ঞ",
  },
  "hero.title1": { en: "Advanced Surgery", bn: "উন্নত সার্জারী" },
  "hero.title2": { en: "for", bn: "যার জন্য" },
  "hero.title3": {
    en: "Spine, Trauma & Limb Reconstruction",
    bn: "মেরুদন্ড, ট্রমা ও লিম্ব রিকন্সট্রাকশন",
  },
  "hero.subtitle": {
    en: "Dr. Md. Sahidur Rahman Khan — Associate Professor, NITOR — specializes in Ilizarov limb reconstruction, spine surgery, arthroplasty, arthroscopy, and complex orthopedic trauma. Trained in Russia, Singapore, India, Malaysia, China & Bangladesh.",
    bn: "ডাঃ মোঃ সাহিদুর রহমান খান — সহযোগী অধ্যাপক, নিটোর — ইলিজারভ লিম্ব রিকন্সট্রাকশন, স্পাইন সার্জারী, আর্থোপ্লাস্টি, আর্থোস্কপি ও জটিল অর্থোপেডিক ট্রমায় বিশেষজ্ঞ। রাশিয়া, সিংগাপুর, ভারত, মালেশিয়া, চীন ও বাংলাদেশে প্রশিক্ষিত।",
  },
  "hero.cta.primary": { en: "Book Consultation", bn: "কনসালটেশন বুক করুন" },
  "hero.cta.secondary": { en: "Explore Articles", bn: "আর্টিকেল পড়ুন" },
  "hero.stat1": {
    en: "Advanced International Trainings",
    bn: "উচ্চতর আন্তর্জাতিক প্রশিক্ষণ",
  },
  "hero.stat2": {
    en: "Countries — Global Training",
    bn: "দেশ — আন্তর্জাতিক প্রশিক্ষণ",
  },

  // ═══════════════════════════════════════════════════════
  // SPECIALTIES SECTION (6 CORRECT specialties)
  // ═══════════════════════════════════════════════════════
  "specialties.badge": { en: "Specializations", bn: "বিশেষজ্ঞতা" },
  "specialties.title": {
    en: "Focused on Your Physical Freedom",
    bn: "আপনার শারীরিক স্বাধীনতায় নিবেদিত",
  },
  "specialties.subtitle": {
    en: "Comprehensive orthopedic solutions tailored to your unique recovery path.",
    bn: "আপনার পুনরুদ্ধারের পথের জন্য সামগ্রিক অর্থোপেডিক সমাধান।",
  },

  "specialties.ilizarov.title": {
    en: "Ilizarov & Limb Reconstruction",
    bn: "ইলিজারভ ও লিম্ব রিকন্সট্রাকশন",
  },
  "specialties.ilizarov.desc": {
    en: "Limb lengthening, deformity correction, and complex fracture management using the Ilizarov method — trained in Russia.",
    bn: "ইলিজারভ পদ্ধতিতে হাত-পা লম্বা করা, বাকা হাড় সোজা করা ও জটিল ভাঙ্গার চিকিৎসা — রাশিয়ায় প্রশিক্ষিত।",
  },

  "specialties.spine.title": { en: "Spine Surgery", bn: "স্পাইন সার্জারী" },
  "specialties.spine.desc": {
    en: "Treatment for back pain, neck pain, spinal deformity, disc problems, and minimally invasive spine procedures.",
    bn: "কোমর ব্যথা, ঘাড় ব্যথা, বাকা মেরুদন্ড, ডিস্ক সমস্যা ও না কেটে বা অল্প কেটে মেরুদন্ডের অপারেশন।",
  },

  "specialties.arthroplasty.title": {
    en: "Arthroplasty (Joint Replacement)",
    bn: "আর্থোপ্লাস্টি (জয়েন্ট প্রতিস্থাপন)",
  },
  "specialties.arthroplasty.desc": {
    en: "Total hip and knee replacement surgery using advanced techniques for faster recovery and long-lasting results.",
    bn: "উন্নত পদ্ধতিতে টোটাল হিপ ও টোটাল নি জয়েন্ট প্রতিস্থাপন সার্জারী — দ্রুত সুস্থতা ও দীর্ঘস্থায়ী ফলাফল।",
  },

  "specialties.arthroscopy.title": { en: "Arthroscopy", bn: "আর্থোস্কপি" },
  "specialties.arthroscopy.desc": {
    en: "Minimally invasive keyhole surgery for arthritis, ligament tears, and joint problems.",
    bn: "বাত-ব্যথা, লিগামেন্ট ছিঁড়ে যাওয়া ও জয়েন্ট সমস্যার আর্থোস্কপিক অপারেশন।",
  },

  "specialties.reconstructive.title": {
    en: "Plastic Reconstructive Surgery",
    bn: "প্লাস্টিক রিকন্সট্রাক্টিভ সার্জারী",
  },
  "specialties.reconstructive.desc": {
    en: "Correction of congenital and traumatic limb deformities, including hand and foot reconstruction.",
    bn: "জন্মগত ও আঘাতজনিত হাত-পা বিকৃতির চিকিৎসা ও অপারেশন।",
  },

  "specialties.trauma.title": { en: "Orthopedic Trauma", bn: "অর্থোপেডিক ট্রমা" },
  "specialties.trauma.desc": {
    en: "Expert management of complex fractures, open fractures, non-union fractures, and failed surgery cases.",
    bn: "জটিল ভাঙ্গা, ওপেন ফ্রাকচার, পুরাতন ভঙ্গা ও ফেইলড অপারেশনের সর্বাধুনিক চিকিৎসা।",
  },

  // ═══════════════════════════════════════════════════════
  // ABOUT SECTION (homepage teaser)
  // ═══════════════════════════════════════════════════════
  "about.badge": { en: "About the Doctor", bn: "চিকিৎসক সম্পর্কে" },
  "about.title": {
    en: "Associate Professor & Ilizarov Fellow",
    bn: "সহযোগী অধ্যাপক ও ইলিজারভ ফেলো",
  },
  "about.para1": {
    en: "Dr. Md. Sahidur Rahman Khan is an Associate Professor in the Department of Orthopedic & Trauma Surgery at NITOR, Dhaka. An Ilizarov Fellow from RISC RTO, Kurgan, Russia, he is one of Bangladesh's foremost specialists in limb reconstruction and deformity correction.",
    bn: "ডাঃ মোঃ সাহিদুর রহমান খান — জাতীয় অর্থোপেডিক হাসপাতাল ও পুনর্বাসন প্রতিষ্ঠান (নিটোর), ঢাকার অর্থোপেডিক ও ট্রমা সার্জারী বিভাগের সহযোগী অধ্যাপক। রাশিয়ার কুরগান RISC RTO থেকে ইলিজারভ ফেলো, তিনি বাংলাদেশের লিম্ব রিকন্সট্রাকশন ও ডিফরমিটি কারেকশনের অন্যতম প্রধান বিশেষজ্ঞ।",
  },
  "about.para2": {
    en: "Trained across five countries in AO Trauma, AO Spine, AO Recon, and Advanced Limb Reconstruction, he brings world-class expertise to patients across Bangladesh.",
    bn: "পাঁচটি দেশে — রাশিয়া, সিংগাপুর, ভারত, মালেশিয়া ও চীনে — AO ট্রমা, AO স্পাইন, AO রিকন ও এডভান্সড লিম্ব রিকন্সট্রাকশনে প্রশিক্ষিত তিনি বাংলাদেশের রোগীদের জন্য বিশ্বমানের দক্ষতা নিয়ে আসেন।",
  },
  "about.qual.mbbs": { en: "MBBS", bn: "এমবিবিএস" },
  "about.qual.ms": {
    en: "MS (Orthopedic Surgery)",
    bn: "এমএস (অর্থোপেডিক সার্জারী)",
  },
  "about.qual.dortho": { en: "D-Ortho (NITOR)", bn: "ডি-অর্থো (নিটোর)" },
  "about.qual.bcs": { en: "BCS (Health)", bn: "বিসিএস (স্বাস্থ্য)" },
  "about.qual.fellowship": {
    en: "Ilizarov Fellow (RISC RTO, Russia)",
    bn: "ইলিজারভ ফেলো (RISC RTO, রাশিয়া)",
  },
  "about.cta": { en: "Learn More About My Journey", bn: "আমার যাত্রা সম্পর্কে জানুন" },
  "about.patients": { en: "Happy Patients", bn: "সন্তুষ্ট রোগী" },
  "about.trustedCare": { en: "Trusted Care", bn: "বিশ্বস্ত সেবা" },

  // ═══════════════════════════════════════════════════════
  // ABOUT PAGE (dedicated page — after About PR merges)
  // ═══════════════════════════════════════════════════════
  "aboutPage.hero.tagline": {
    en: "Restoring mobility through precision, compassion, and innovation — dedicated to helping every patient reclaim their active life.",
    bn: "নিখুঁততা, সহানুভূতি ও উদ্ভাবনের মাধ্যমে গতিশীলতা ফিরিয়ে আনা — প্রতিটি রোগীকে তাদের সক্রিয় জীবনে ফিরিয়ে আনার প্রতিশ্রুতি।",
  },
  "aboutPage.bio.badge": { en: "My Journey", bn: "আমার যাত্রা" },
  "aboutPage.bio.title": {
    en: "Associate Professor & Ilizarov Fellow — Advancing Orthopedic Surgery in Bangladesh",
    bn: "সহযোগী অধ্যাপক ও ইলিজারভ ফেলো — বাংলাদেশে অর্থোপেডিক সার্জারীর অগ্রগতি",
  },
  "aboutPage.bio.p1": {
    en: "Dr. Md. Sahidur Rahman Khan is an Associate Professor in the Department of Orthopedic & Trauma Surgery at the National Institute of Traumatology & Orthopaedic Rehabilitation (NITOR), Dhaka. An Ilizarov Fellow from RISC RTO, Kurgan, Russia, he is one of Bangladesh's foremost specialists in limb reconstruction and deformity correction.",
    bn: "ডাঃ মোঃ সাহিদুর রহমান খান — জাতীয় অর্থোপেডিক হাসপাতাল ও পুনর্বাসন প্রতিষ্ঠান (নিটোর), ঢাকার অর্থোপেডিক ও ট্রমা সার্জারী বিভাগের সহযোগী অধ্যাপক। রাশিয়ার কুরগান RISC RTO থেকে ইলিজারভ ফেলো, তিনি বাংলাদেশের লিম্ব রিকন্সট্রাকশন ও ডিফরমিটি কারেকশনের অন্যতম প্রধান বিশেষজ্ঞ।",
  },
  "aboutPage.bio.p2": {
    en: "His journey in medicine began with MBBS, followed by MS in Orthopedic Surgery and D-Ortho from NITOR. A subsequent BCS in Health and the prestigious Ilizarov Fellowship from Russia further sharpened his expertise in one of the most demanding subspecialties in orthopedic surgery.",
    bn: "চিকিৎসায় তাঁর যাত্রা শুরু এমবিবিএস দিয়ে, এরপর এমএস (অর্থোপেডিক সার্জারী) ও নিটোর থেকে ডি-অর্থো। বিসিএস (স্বাস্থ্য) এবং রাশিয়ার সুবিখ্যাত ইলিজারভ ফেলোশিপ অর্জন করে তিনি অর্থোপেডিক সার্জারীর অন্যতম কঠিন উপ-বিশেষজ্ঞতায় আরও দক্ষ হন।",
  },
  "aboutPage.bio.p3": {
    en: "Trained across five countries — Russia, Singapore, India, Malaysia, and China — in AO Trauma, AO Spine, AO Recon, and Advanced Limb Reconstruction, he brings world-class expertise to complex spine surgery, arthroplasty, arthroscopy, and Ilizarov procedures for patients across Bangladesh.",
    bn: "পাঁচটি দেশে — রাশিয়া, সিংগাপুর, ভারত, মালেশিয়া ও চীনে — AO ট্রমা, AO স্পাইন, AO রিকন ও এডভান্সড লিম্ব রিকন্সট্রাকশনে প্রশিক্ষিত তিনি বাংলাদেশের রোগীদের জন্য জটিল স্পাইন সার্জারী, আর্থোপ্লাস্টি, আর্থোস্কপি ও ইলিজারভ প্রক্রিয়ায় বিশ্বমানের দক্ষতা নিয়ে আসেন।",
  },
  "aboutPage.bio.p4": {
    en: "As an Associate Professor at NITOR, he is also deeply committed to teaching and mentoring the next generation of orthopedic surgeons, while maintaining an active clinical research portfolio.",
    bn: "নিটোরে সহযোগী অধ্যাপক হিসেবে তিনি পরবর্তী প্রজন্মের অর্থোপেডিক সার্জনদের শিক্ষাদান ও দিকনির্দেশনায় গভীরভাবে নিয়োজিত, পাশাপাশি সক্রিয় ক্লিনিকাল গবেষণা চালিয়ে যাচ্ছেন।",
  },
  "aboutPage.bio.p5": {
    en: "Whether performing a complex Ilizarov procedure, correcting a spinal deformity, or replacing a worn-out joint, Dr. Sahidur's philosophy remains the same: treat every patient as you would want your own family to be treated — with skill, empathy, and respect.",
    bn: "জটিল ইলিজারভ প্রক্রিয়া হোক, বাকা মেরুদন্ড সোজা করা হোক, বা ক্ষয়প্রাপ্ত জয়েন্ট প্রতিস্থাপন হোক — ডাঃ সাহিদুরের দর্শন একই: প্রতিটি রোগীর চিকিৎসা করুন যেভাবে আপনি আপনার পরিবারের চিকিৎসা চান — দক্ষতা, সহানুভূতি ও সম্মানের সাথে।",
  },

  "aboutPage.values.patientFirst.title": {
    en: "Patient First",
    bn: "রোগী সর্বাগ্রে",
  },
  "aboutPage.values.patientFirst.desc": {
    en: "Every decision is guided by what is best for the patient — from diagnosis to recovery.",
    bn: "প্রতিটি সিদ্ধান্ত রোগীর সর্বোত্তম কল্যাণের ভিত্তিতে নেওয়া হয় — রোগ নির্ণয় থেকে সুস্থতা পর্যন্ত।",
  },
  "aboutPage.values.evidenceBased.title": {
    en: "Evidence Based",
    bn: "প্রমাণভিত্তিক",
  },
  "aboutPage.values.evidenceBased.desc": {
    en: "Treatment plans are rooted in the latest clinical research and proven surgical techniques.",
    bn: "চিকিৎসা পরিকল্পনা সর্বাধুনিক ক্লিনিকাল গবেষণা ও প্রমাণিত সার্জিক্যাল পদ্ধতির ওপর ভিত্তি করে তৈরি।",
  },
  "aboutPage.values.innovate.title": {
    en: "Innovate & Teach",
    bn: "উদ্ভাবন ও শিক্ষাদান",
  },
  "aboutPage.values.innovate.desc": {
    en: "Advancing orthopedic care through research while mentoring the next generation of surgeons.",
    bn: "গবেষণার মাধ্যমে অর্থোপেডিক চিকিৎসার উন্নয়ন এবং পরবর্তী প্রজন্মের সার্জনদের দিকনির্দেশনা।",
  },

  "aboutPage.qual.badge": { en: "Credentials", bn: "যোগ্যতা" },
  "aboutPage.qual.title": {
    en: "Education & Specializations",
    bn: "শিক্ষা ও বিশেষজ্ঞতা",
  },

  "aboutPage.qual.mbbs.detail": {
    en: "Bachelor of Medicine, Bachelor of Surgery",
    bn: "এমবিবিএস — চিকিৎসা বিজ্ঞানে স্নাতক",
  },
  "aboutPage.qual.ms.detail": {
    en: "Master of Surgery specializing in orthopedic pathology, trauma management, and reconstructive procedures.",
    bn: "অর্থোপেডিক প্যাথোলজি, ট্রমা ম্যানেজমেন্ট ও রিকন্সট্রাক্টিভ প্রসিডিউরে স্নাতকোত্তর।",
  },
  "aboutPage.qual.dortho.detail": {
    en: "Diploma in Orthopedics from NITOR (Pangu Hospital), Dhaka.",
    bn: "নিটোর (পংগু হাসপাতাল), ঢাকা থেকে অর্থোপেডিক্সে ডিপ্লোমা।",
  },
  "aboutPage.qual.bcs.detail": {
    en: "Bangladesh Civil Service (Health cadre) — serving in government medical institutions.",
    bn: "বাংলাদেশ সিভিল সার্ভিস (স্বাস্থ্য ক্যাডার) — সরকারি চিকিৎসা প্রতিষ্ঠানে সেবাদান।",
  },
  "aboutPage.qual.fellowship.detail": {
    en: "Advanced fellowship in Ilizarov method for trauma and deformity correction at RISC RTO, Kurgan, Russia.",
    bn: "রাশিয়ার কুরগান RISC RTO তে ট্রমা ও ডিফরমিটি কারেকশনে ইলিজারভ পদ্ধতিতে উচ্চতর ফেলোশিপ।",
  },

  "aboutPage.qual.tag.degree": { en: "Degree", bn: "ডিগ্রী" },
  "aboutPage.qual.tag.postgraduate": { en: "Postgraduate", bn: "স্নাতকোত্তর" },
  "aboutPage.qual.tag.diploma": { en: "Diploma", bn: "ডিপ্লোমা" },
  "aboutPage.qual.tag.civilService": { en: "Civil Service", bn: "সিভিল সার্ভিস" },
  "aboutPage.qual.tag.fellowship": { en: "Fellowship", bn: "ফেলোশিপ" },

  "aboutPage.stats.years": { en: "Degrees & Training", bn: "ডিগ্রী ও প্রশিক্ষণ" },
  "aboutPage.stats.countries": { en: "Countries Trained", bn: "প্রশিক্ষণের দেশ" },
  "aboutPage.stats.specialties": {
    en: "Clinical Specialties",
    bn: "ক্লিনিকাল বিশেষজ্ঞতা",
  },
  "aboutPage.stats.chambers": { en: "Chamber Locations", bn: "চেম্বারের অবস্থান" },

  // ═══════════════════════════════════════════════════════
  // CTA SECTION
  // ═══════════════════════════════════════════════════════
  "cta.title": {
    en: "Ready to Take the First Step?",
    bn: "প্রথম পদক্ষেপ নিতে প্রস্তুত?",
  },
  "cta.subtitle": {
    en: "Book a consultation and get a personalized plan for recovery and long-term mobility.",
    bn: "কনসালটেশন বুক করুন এবং পুনরুদ্ধার ও দীর্ঘমেয়াদী গতিশীলতার জন্য ব্যক্তিগত পরিকল্পনা পান।",
  },
  "cta.book": { en: "Book an Appointment", bn: "অ্যাপয়েন্টমেন্ট বুক করুন" },
  "cta.ask": { en: "Ask a Question", bn: "প্রশ্ন করুন" },
  "cta.clinicHours": { en: "Clinic Hours", bn: "চেম্বার সময়" },

  // ═══════════════════════════════════════════════════════
  // TESTIMONIALS CTA
  // ═══════════════════════════════════════════════════════
  "testimonialsCta.badge": { en: "Patient Stories", bn: "রোগীর গল্প" },
  "testimonialsCta.title": {
    en: "Real Stories of Recovery and Renewed Mobility",
    bn: "সুস্থতা ও গতিশীলতা ফিরে পাওয়ার বাস্তব গল্প",
  },
  "testimonialsCta.subtitle": {
    en: "Join thousands of patients who have reclaimed their active lifestyles through personalized orthopedic care.",
    bn: "ব্যক্তিগত অর্থোপেডিক সেবায় হাজারো রোগী তাদের সক্রিয় জীবন ফিরে পেয়েছেন।",
  },
  "testimonialsCta.read": {
    en: "Read Patient Testimonials",
    bn: "রোগীর অভিজ্ঞতা পড়ুন",
  },
  "testimonialsCta.start": {
    en: "Start Your Recovery",
    bn: "আপনার সুস্থতা শুরু করুন",
  },

  // ═══════════════════════════════════════════════════════
  // NEWSLETTER CTA
  // ═══════════════════════════════════════════════════════
  "newsletter.badge": { en: "Newsletter", bn: "নিউজলেটার" },
  "newsletter.title": {
    en: "Stay Ahead of Your Health",
    bn: "স্বাস্থ্য সচেতন থাকুন",
  },
  "newsletter.subtitle": {
    en: "Get expert orthopedic insights, recovery tips, and new article notifications delivered straight to your inbox — no spam, ever.",
    bn: "বিশেষজ্ঞ অর্থোপেডিক পরামর্শ, সুস্থতার টিপস এবং নতুন আর্টিকেলের বিজ্ঞপ্তি সরাসরি আপনার ইনবক্সে পান।",
  },
  "newsletter.placeholder": {
    en: "Enter your email address",
    bn: "আপনার ইমেইল ঠিকানা লিখুন",
  },
  "newsletter.subscribe": { en: "Subscribe", bn: "সাবস্ক্রাইব" },
  "newsletter.subscribing": { en: "Subscribing…", bn: "সাবস্ক্রাইব হচ্ছে…" },
  "newsletter.subscribed": {
    en: "You're subscribed!",
    bn: "আপনি সাবস্ক্রাইব করেছেন!",
  },
  "newsletter.subscribedDesc": {
    en: "We'll be in touch with the latest health insights.",
    bn: "সর্বাধুনিক স্বাস্থ্য তথ্য নিয়ে আমরা যোগাযোগ করব।",
  },
  "newsletter.private": { en: "100% Private", bn: "১০০% গোপনীয়" },
  "newsletter.weekly": { en: "Weekly Digest", bn: "সাপ্তাহিক ডাইজেস্ট" },
  "newsletter.unsubscribe": {
    en: "Unsubscribe Anytime",
    bn: "যেকোনো সময় আনসাবস্ক্রাইব",
  },

  // ═══════════════════════════════════════════════════════
  // FEATURED ARTICLES
  // ═══════════════════════════════════════════════════════
  "articles.badge": { en: "Latest Articles", bn: "সর্বশেষ আর্টিকেল" },
  "articles.title": {
    en: "Health Insights & Guides",
    bn: "স্বাস্থ্য পরামর্শ ও নির্দেশিকা",
  },

  // ═══════════════════════════════════════════════════════
  // TESTIMONIALS CAROUSEL
  // ═══════════════════════════════════════════════════════
  "testimonials.badge": { en: "What Patients Say", bn: "রোগীরা যা বলেন" },
  "testimonials.title": { en: "Trusted by Patients", bn: "রোগীদের বিশ্বাসভাজন" },

  // ═══════════════════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════════════════
  "footer.platform": { en: "Platform", bn: "প্ল্যাটফর্ম" },
  "footer.support": { en: "Support", bn: "সাহায্য" },
  "footer.contact": { en: "Contact", bn: "যোগাযোগ" },
  "footer.aboutDr": { en: "About Dr. Shahid", bn: "ডাঃ শাহিদ সম্পর্কে" },
  "footer.articles": { en: "Articles", bn: "আর্টিকেল" },
  "footer.researchPapers": { en: "Research Papers", bn: "গবেষণা পত্র" },
  "footer.patientTestimonials": {
    en: "Patient Testimonials",
    bn: "রোগীর অভিজ্ঞতা",
  },
  "footer.contactUs": { en: "Contact Us", bn: "যোগাযোগ করুন" },
  "footer.bookAppointment": {
    en: "Book Appointment",
    bn: "অ্যাপয়েন্টমেন্ট বুক করুন",
  },
  "footer.privacyPolicy": { en: "Privacy Policy", bn: "গোপনীয়তা নীতি" },
  "footer.phone": { en: "Phone", bn: "ফোন" },
  "footer.allRightsReserved": {
    en: "ALL RIGHTS RESERVED",
    bn: "সর্বস্বত্ব সংরক্ষিত",
  },
  "footer.termsOfUse": { en: "Terms of Use", bn: "ব্যবহারের শর্ত" },

  // ═══════════════════════════════════════════════════════
  // BREADCRUMBS
  // ═══════════════════════════════════════════════════════
  "breadcrumbs.home": { en: "Home", bn: "হোম" },
  "breadcrumbs.about": { en: "About", bn: "সম্পর্কে" },
  "breadcrumbs.articles": { en: "Articles", bn: "আর্টিকেল" },
  "breadcrumbs.research": { en: "Research", bn: "গবেষণা" },
  "breadcrumbs.appointment": { en: "Appointment", bn: "অ্যাপয়েন্টমেন্ট" },
  "breadcrumbs.contact": { en: "Contact", bn: "যোগাযোগ" },
  "breadcrumbs.testimonials": { en: "Testimonials", bn: "রোগীর অভিজ্ঞতা" },

  // ═══════════════════════════════════════════════════════
  // APPOINTMENT FORM
  // ═══════════════════════════════════════════════════════
  "appointment.badge": { en: "Schedule a Visit", bn: "ভিজিট নির্ধারণ করুন" },
  "appointment.title": {
    en: "Book Your Appointment",
    bn: "আপনার অ্যাপয়েন্টমেন্ট বুক করুন",
  },
  "appointment.name": { en: "Full Name", bn: "পুরো নাম" },
  "appointment.namePlaceholder": {
    en: "Enter your full name",
    bn: "আপনার পুরো নাম লিখুন",
  },
  "appointment.phone": { en: "Phone Number", bn: "ফোন নম্বর" },
  "appointment.phonePlaceholder": {
    en: "Enter your phone number",
    bn: "আপনার ফোন নম্বর লিখুন",
  },
  "appointment.email": { en: "Email Address", bn: "ইমেইল ঠিকানা" },
  "appointment.emailPlaceholder": {
    en: "Enter your email",
    bn: "আপনার ইমেইল লিখুন",
  },
  "appointment.date": { en: "Preferred Date", bn: "পছন্দের তারিখ" },
  "appointment.time": { en: "Preferred Time", bn: "পছন্দের সময়" },
  "appointment.concern": { en: "Primary Concern", bn: "প্রধান সমস্যা" },
  "appointment.concernPlaceholder": {
    en: "Describe your condition or concern",
    bn: "আপনার সমস্যা বা উদ্বেগ বর্ণনা করুন",
  },
  "appointment.submit": { en: "Book Appointment", bn: "অ্যাপয়েন্টমেন্ট বুক করুন" },

  // ═══════════════════════════════════════════════════════
  // CONTACT FORM
  // ═══════════════════════════════════════════════════════
  "contact.badge": { en: "Get in Touch", bn: "যোগাযোগ করুন" },
  "contact.title": {
    en: "I'm Here to Help You Heal",
    bn: "আমি আপনাকে সুস্থ করতে এখানে আছি",
  },
  "contact.subtitle": {
    en: "Whether you have a specific medical question or need guidance on orthopedic recovery, feel free to reach out.",
    bn: "আপনার নির্দিষ্ট কোনো চিকিৎসা সংক্রান্ত প্রশ্ন থাকুক বা অর্থোপেডিক পুনরুদ্ধারে দিকনির্দেশনা প্রয়োজন হোক, নির্দ্বিধায় যোগাযোগ করুন।",
  },
  "contact.name": { en: "Full Name", bn: "পুরো নাম" },
  "contact.email": { en: "Email Address", bn: "ইমেইল ঠিকানা" },
  "contact.phone": { en: "Phone Number", bn: "ফোন নম্বর" },
  "contact.subject": { en: "Subject", bn: "বিষয়" },
  "contact.message": { en: "Message", bn: "বার্তা" },
  "contact.messagePlaceholder": {
    en: "How can we help you?",
    bn: "আমরা কিভাবে সাহায্য করতে পারি?",
  },
  "contact.send": { en: "Send Message", bn: "বার্তা পাঠান" },

  "contact.location": { en: "Clinic Location", bn: "চেম্বারের অবস্থান" },
  "contact.phoneLabel": { en: "Phone & WhatsApp", bn: "ফোন ও হোয়াটসঅ্যাপ" },
  "contact.hours": { en: "Consultation Hours", bn: "রোগী দেখার সময়" },
  "contact.emailLabel": { en: "Email Address", bn: "ইমেইল ঠিকানা" },
  "contact.findClinic": { en: "Find Our Clinic", bn: "আমাদের চেম্বার খুঁজুন" },
  "contact.directions": {
    en: "Interactive Directions",
    bn: "ইন্টারেক্টিভ দিকনির্দেশনা",
  },
  "contact.directionsDesc": {
    en: "Located conveniently in Dhaka, with fully equipped modern consulting chambers.",
    bn: "ঢাকায় সুবিধাজনক অবস্থান, আধুনিক সজ্জিত কনসাল্টিং চেম্বার।",
  },

  // ═══════════════════════════════════════════════════════
  // SHARED / MISC
  // ═══════════════════════════════════════════════════════
  "shared.tryAgain": { en: "Try Again", bn: "আবার চেষ্টা করুন" },
  "shared.somethingWentWrong": {
    en: "Something went wrong",
    bn: "কিছু একটা সমস্যা হয়েছে",
  },
  "shared.backToTop": { en: "Back to top", bn: "উপরে ফিরুন" },
  "shared.skipToContent": { en: "Skip to main content", bn: "মূল বিষয়বস্তুতে যান" },
  // Missing nav keys used by Header & Breadcrumbs
  "nav.about": { en: "About", bn: "সম্পর্কে" },
  "nav.appointment": { en: "Appointment", bn: "অ্যাপয়েন্টমেন্ট" },

  // Breadcrumb (used as "breadcrumb.home" in component)
  "breadcrumb.home": { en: "Home", bn: "হোম" },

  // Footer keys used in Footer.tsx
  "footer.rights": {
    en: "DR. MD. SAHIDUR RAHMAN KHAN. ALL RIGHTS RESERVED.",
    bn: "ডাঃ মোঃ সাহিদুর রহমান খান। সর্বস্বত্ব সংরক্ষিত।",
  },
  "footer.terms": { en: "Terms of Use", bn: "ব্যবহারের শর্ত" },
  "footer.privacy": { en: "Privacy Policy", bn: "গোপনীয়তা নীতি" },

  // AboutHero tagline
  "aboutHero.tagline": {
    en: "Restoring mobility through precision, compassion, and innovation — dedicated to helping every patient reclaim their active life.",
    bn: "নিখুঁততা, সহানুভূতি ও উদ্ভাবনের মাধ্যমে গতিশীলতা ফিরিয়ে আনা — প্রতিটি রোগীকে তাদের সক্রিয় জীবনে ফিরিয়ে আনার প্রতিশ্রুতি।",
  },

  // AboutBio section (short keys used in component)
  "aboutBio.badge": { en: "My Journey", bn: "আমার যাত্রা" },
  "aboutBio.title": {
    en: "Associate Professor & Ilizarov Fellow — Advancing Orthopedic Surgery in Bangladesh",
    bn: "সহযোগী অধ্যাপক ও ইলিজারভ ফেলো — বাংলাদেশে অর্থোপেডিক সার্জারীর অগ্রগতি",
  },
  "aboutBio.val1.title": { en: "Patient First", bn: "রোগী সর্বাগ্রে" },
  "aboutBio.val1.desc": {
    en: "Every decision is guided by what is best for the patient — from diagnosis to recovery.",
    bn: "প্রতিটি সিদ্ধান্ত রোগীর সর্বোত্তম কল্যাণের ভিত্তিতে নেওয়া হয় — রোগ নির্ণয় থেকে সুস্থতা পর্যন্ত।",
  },
  "aboutBio.val2.title": { en: "Evidence Based", bn: "প্রমাণভিত্তিক" },
  "aboutBio.val2.desc": {
    en: "Treatment plans are rooted in the latest clinical research and proven surgical techniques.",
    bn: "চিকিৎসা পরিকল্পনা সর্বাধুনিক ক্লিনিকাল গবেষণা ও প্রমাণিত সার্জিক্যাল পদ্ধতির ওপর ভিত্তি করে তৈরি।",
  },
  "aboutBio.val3.title": { en: "Innovate & Teach", bn: "উদ্ভাবন ও শিক্ষাদান" },
  "aboutBio.val3.desc": {
    en: "Advancing orthopedic care through research while mentoring the next generation of surgeons.",
    bn: "গবেষণার মাধ্যমে অর্থোপেডিক চিকিৎসার উন্নয়ন এবং পরবর্তী প্রজন্মের সার্জনদের দিকনির্দেশনা।",
  },

  // AboutQualifications section
  "aboutQuals.badge": { en: "Credentials", bn: "যোগ্যতা" },
  "aboutQuals.title": {
    en: "Education & Specializations",
    bn: "শিক্ষা ও বিশেষজ্ঞতা",
  },
  "aboutQuals.stat3": { en: "Research Publications", bn: "গবেষণা প্রকাশনা" },
  "aboutQuals.stat4": { en: "Conferences Attended", bn: "সম্মেলনে অংশগ্রহণ" },
  "aboutQuals.tag.gold": { en: "Gold Medal", bn: "গোল্ড মেডেল" },
  "aboutQuals.tag.pg": { en: "Postgraduate", bn: "স্নাতকোত্তর" },
  "aboutQuals.tag.fellowship": { en: "Fellowship", bn: "ফেলোশিপ" },
  "aboutQuals.tag.certified": { en: "Civil Service", bn: "সিভিল সার্ভিস" },
  "aboutQuals.mbbs.detail": {
    en: "Bachelor of Medicine, Bachelor of Surgery — Foundation of clinical excellence.",
    bn: "এমবিবিএস — ক্লিনিকাল দক্ষতার ভিত্তি।",
  },
  "aboutQuals.ms.detail": {
    en: "Master of Surgery specializing in orthopedic pathology, trauma management, and reconstructive procedures.",
    bn: "অর্থোপেডিক প্যাথোলজি, ট্রমা ম্যানেজমেন্ট ও রিকন্সট্রাক্টিভ প্রসিডিউরে স্নাতকোত্তর।",
  },
  "aboutQuals.dortho.detail": {
    en: "Diploma in Orthopedics from NITOR (Pangu Hospital), Dhaka.",
    bn: "নিটোর (পংগু হাসপাতাল), ঢাকা থেকে অর্থোপেডিক্সে ডিপ্লোমা।",
  },
  "aboutQuals.fellowship.detail": {
    en: "Advanced fellowship in Ilizarov method for trauma and deformity correction at RISC RTO, Kurgan, Russia.",
    bn: "রাশিয়ার কুরগান RISC RTO তে ট্রমা ও ডিফরমিটি কারেকশনে ইলিজারভ পদ্ধতিতে উচ্চতর ফেলোশিপ।",
  },
  "aboutQuals.bcs.detail": {
    en: "Bangladesh Civil Service (Health cadre) — serving in government medical institutions.",
    bn: "বাংলাদেশ সিভিল সার্ভিস (স্বাস্থ্য ক্যাডার) — সরকারি চিকিৎসা প্রতিষ্ঠানে সেবাদান।",
  },

  // Contact form labels
  "contact.namePlaceholder": { en: "Your full name", bn: "আপনার পুরো নাম" },
  "contact.emailPlaceholder": { en: "your@email.com", bn: "আপনার ইমেইল" },
  "contact.phonePlaceholder": { en: "+8801XXXXXXXXX", bn: "+৮৮০১XXXXXXXXX" },
  "contact.subjectPlaceholder": {
    en: "How can I help you?",
    bn: "আমি কিভাবে সাহায্য করতে পারি?",
  },
  "contact.reason": { en: "Reason", bn: "কারণ" },
  "contact.reason.medical": { en: "Medical Inquiry", bn: "চিকিৎসা জিজ্ঞাসা" },
  "contact.reason.general": { en: "General", bn: "সাধারণ" },
  "contact.reason.media": { en: "Media", bn: "মিডিয়া" },
  "contact.reason.other": { en: "Other", bn: "অন্যান্য" },
  "contact.phoneOptional": { en: "Phone (optional)", bn: "ফোন (ঐচ্ছিক)" },
  "contact.yourMessage": { en: "Your Message", bn: "আপনার বার্তা" },
  "contact.recaptcha": {
    en: "This site is protected by reCAPTCHA and the Google",
    bn: "এই সাইটটি reCAPTCHA এবং Google দ্বারা সুরক্ষিত",
  },
  "contact.privacyPolicy": { en: "Privacy Policy", bn: "গোপনীয়তা নীতি" },
  "contact.termsOfService": { en: "Terms of Service", bn: "সেবার শর্ত" },
  "contact.apply": { en: "apply.", bn: "প্রযোজ্য।" },
};
