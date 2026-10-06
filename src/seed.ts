import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())

import { getPayload } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  events as seedEvents,
  projects as seedProjects,
  stories as seedStories,
  articles as seedArticles,
  boardYears as seedBoardYears,
  partners as seedPartners,
} from './lib/site-data'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const TRANSLATIONS: Record<string, string> = {
  // Event Titles
  "ENTREPRENEUR CLUB 7: YOUNG TO YAK": "ENTREPRENEUR CLUB à¸„à¸£à¸±à¹‰à¸‡à¸—à¸µà¹ˆ 7 - YOUNG TO YAK -",
  "ENTREPRENEUR CLUB 8: LECTURE BAR": "ENTREPRENEUR CLUB 8 LECTURE BAR",
  "JCI TOYP 2026: HUMAN ADVANTAGE IN THE AI ERA": "JCI TOYP 2026: à¸¨à¸±à¸à¸¢à¸ à¸²à¸žà¸‚à¸­à¸‡à¸¡à¸™à¸¸à¸©à¸¢à¹Œà¹ƒà¸™à¸¢à¸¸à¸„ AI",
  "Bangkok Leadership Lab": "à¸«à¹‰à¸­à¸‡à¸›à¸à¸´à¸šà¸±à¸•à¸´à¸à¸²à¸£à¸„à¸§à¸²à¸¡à¹€à¸›à¹‡à¸™à¸œà¸¹à¹‰à¸™à¸³à¸à¸£à¸¸à¸‡à¹€à¸—à¸žà¸¯",
  "Impact Mixer with Mission-Driven Founders": "à¸‡à¸²à¸™à¸žà¸šà¸›à¸°à¸ªà¸±à¸‡à¸ªà¸£à¸£à¸„à¹Œà¹à¸¥à¸°à¹à¸¥à¸à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸„à¸§à¸²à¸¡à¸£à¸¹à¹‰à¸à¸±à¸šà¸œà¸¹à¹‰à¸à¹ˆà¸­à¸•à¸±à¹‰à¸‡à¸˜à¸¸à¸£à¸à¸´à¸ˆ",
  "Community Action Day": "à¸§à¸±à¸™à¸šà¸³à¹€à¸žà¹‡à¸à¸›à¸£à¸°à¹‚à¸¢à¸Šà¸™à¹Œà¹€à¸žà¸·à¹ˆà¸­à¸Šà¸¸à¸¡à¸Šà¸™",

  // Event Venues
  "Formosa Potetato (MRT Phetchaburi)": "Formosa Potetato (MRT à¹€à¸žà¸Šà¸£à¸šà¸¸à¸£à¸µ)",
  "YELLOW CLOUD CRAFT BEER & BOTTLE SHOP": "YELLOW CLOUD CRAFT BEER & BOTTLE SHOP",
  "UTCC à¸­à¸²à¸„à¸²à¸£ 5 à¸Šà¸±à¹‰à¸™ 2 à¸«à¹‰à¸­à¸‡ 5201": "à¸¡à¸«à¸²à¸§à¸´à¸—à¸¢à¸²à¸¥à¸±à¸¢à¸«à¸­à¸à¸²à¸£à¸„à¹‰à¸²à¹„à¸—à¸¢ UTCC à¸­à¸²à¸„à¸²à¸£ 5 à¸Šà¸±à¹‰à¸™ 2 à¸«à¹‰à¸­à¸‡ 5201",
  "Creative Hall, Sukhumvit": "à¸„à¸£à¸µà¹€à¸­à¸—à¸µà¸Ÿà¸®à¸­à¸¥à¸¥à¹Œ à¸ªà¸¸à¸‚à¸¸à¸¡à¸§à¸´à¸—",
  "Riverside Commons, Bangkok": "à¸£à¸´à¹€à¸§à¸­à¸£à¹Œà¹„à¸‹à¸”à¹Œ à¸„à¸­à¸¡à¸¡à¸­à¸™à¸ªà¹Œ à¸à¸£à¸¸à¸‡à¹€à¸—à¸žà¸¯",
  "Khlong Toei District": "à¹€à¸‚à¸•à¸„à¸¥à¸­à¸‡à¹€à¸•à¸¢",

  // Event Summaries & Highlights
  "Hands-on Salepage workshop: Design and build your sales landing page with AI, including domain setup and Q&A.": "à¹€à¸§à¸´à¸£à¹Œà¸à¸Šà¸­à¸›à¸ªà¸£à¹‰à¸²à¸‡ Salepage à¸ˆà¸£à¸´à¸‡à¸”à¹‰à¸§à¸¢ AI à¹à¸šà¸š Hands-on à¸•à¸±à¹‰à¸‡à¹à¸•à¹ˆà¸­à¸­à¸à¹à¸šà¸šà¹„à¸›à¸ˆà¸™à¸–à¸¶à¸‡à¸•à¸±à¹‰à¸‡à¸„à¹ˆà¸² Domain à¸žà¸£à¹‰à¸­à¸¡ Q&A",
  "Learn from Khun Poon Pakpoom, Construction Brain AI Agent Builder at Homitage Co.,Ltd. Includes lunch and roundtable session.": "à¹€à¸£à¸µà¸¢à¸™à¸£à¸¹à¹‰à¸ˆà¸²à¸à¸„à¸¸à¸“à¸›à¸¹à¸™ à¸ à¸²à¸„à¸ à¸¹à¸¡à¸´ Construction Brain AI Agent Builder à¸žà¸£à¹‰à¸­à¸¡à¸­à¸²à¸«à¸²à¸£à¸à¸¥à¸²à¸‡à¸§à¸±à¸™à¹à¸¥à¸° Roundtable Session",
  "A unique lecture bar experience exploring unexpected business risks (Risk Management You Wish You Knew) with industry experts.": "à¸šà¸²à¸£à¹Œà¸§à¸´à¸Šà¸²à¸à¸²à¸£à¸™à¸±à¸à¸˜à¸¸à¸£à¸à¸´à¸ˆà¹€à¸ˆà¸²à¸°à¸¥à¸¶à¸à¸„à¸§à¸²à¸¡à¹€à¸ªà¸µà¹ˆà¸¢à¸‡à¸—à¸²à¸‡à¸˜à¸¸à¸£à¸à¸´à¸ˆà¸—à¸µà¹ˆà¸„à¸¸à¸“à¸­à¸²à¸ˆà¸„à¸²à¸”à¹„à¸¡à¹ˆà¸–à¸¶à¸‡ à¸à¸±à¸šà¸œà¸¹à¹‰à¹€à¸Šà¸µà¹ˆà¸¢à¸§à¸Šà¸²à¸à¹ƒà¸™à¸§à¸‡à¸à¸²à¸£",
  "Featuring Khun Peemai and a panel of experts in a casual bar setting. Limited to 30 seats.": "à¸žà¸šà¸à¸±à¸šà¸„à¸¸à¸“à¸›à¸µà¹ƒà¸«à¸¡à¹ˆà¹à¸¥à¸°à¸„à¸“à¸°à¸§à¸´à¸—à¸¢à¸²à¸à¸£à¸œà¸¹à¹‰à¹€à¸Šà¸µà¹ˆà¸¢à¸§à¸Šà¸²à¸à¹ƒà¸™à¸šà¸£à¸£à¸¢à¸²à¸à¸²à¸¨à¸šà¸²à¸£à¹Œà¹à¸šà¸šà¹€à¸›à¹‡à¸™à¸à¸±à¸™à¹€à¸­à¸‡ à¸ˆà¸³à¸à¸±à¸”à¹€à¸žà¸µà¸¢à¸‡ 30 à¸—à¸µà¹ˆà¸™à¸±à¹ˆà¸‡à¹€à¸—à¹ˆà¸²à¸™à¸±à¹‰à¸™",
  "Ten Outstanding Young Persons 2026 awards. Discover the Human Advantage in the AI Era: Intelligence, Resilience, Inclusion.": "à¹€à¸§à¸—à¸µà¹€à¸ªà¸§à¸™à¸²à¹à¸¥à¸°à¸¡à¸­à¸šà¸£à¸²à¸‡à¸§à¸±à¸¥ 10 à¸ªà¸¸à¸”à¸¢à¸­à¸”à¸œà¸¹à¹‰à¸™à¸³à¸£à¸¸à¹ˆà¸™à¹ƒà¸«à¸¡à¹ˆ TOYP 2026 à¸£à¹ˆà¸§à¸¡à¸–à¸­à¸”à¸£à¸«à¸±à¸ª 3 à¸—à¸±à¸à¸©à¸°à¹à¸«à¹ˆà¸‡à¸­à¸™à¸²à¸„à¸•: Intelligence, Resilience, Inclusion",
  "Meet the 10 outstanding young leaders of 2026 at the University of the Thai Chamber of Commerce.": "à¸žà¸šà¸à¸±à¸š 10 à¸ªà¸¸à¸”à¸¢à¸­à¸”à¸œà¸¹à¹‰à¸™à¸³à¸£à¸¸à¹ˆà¸™à¹ƒà¸«à¸¡à¹ˆà¹à¸«à¹ˆà¸‡à¸›à¸µ 2026 à¸—à¸µà¹ˆà¸¡à¸«à¸²à¸§à¸´à¸—à¸¢à¸²à¸¥à¸±à¸¢à¸«à¸­à¸à¸²à¸£à¸„à¹‰à¸²à¹„à¸—à¸¢",
  "A practical leadership intensive focused on facilitation, speaking, and leading across committees.": "à¸«à¸¥à¸±à¸à¸ªà¸¹à¸•à¸£à¹€à¸£à¹ˆà¸‡à¸£à¸±à¸”à¹€à¸žà¸·à¹ˆà¸­à¸à¸¶à¸à¸à¸™à¸ à¸²à¸§à¸°à¸œà¸¹à¹‰à¸™à¸³à¹€à¸Šà¸´à¸‡à¸›à¸à¸´à¸šà¸±à¸•à¸´ à¸¡à¸¸à¹ˆà¸‡à¹€à¸™à¹‰à¸™à¸à¸²à¸£à¸­à¸³à¸™à¸§à¸¢à¸„à¸§à¸²à¸¡à¸ªà¸°à¸”à¸§à¸ à¸à¸²à¸£à¸žà¸¹à¸”à¹ƒà¸™à¸—à¸µà¹ˆà¸ªà¸²à¸˜à¸²à¸£à¸“à¸° à¹à¸¥à¸°à¸à¸²à¸£à¸™à¸³à¸„à¸“à¸°à¸—à¸³à¸‡à¸²à¸™",
  "Designed for first-time and emerging chapter leaders.": "à¸­à¸­à¸à¹à¸šà¸šà¸ªà¸³à¸«à¸£à¸±à¸šà¸œà¸¹à¹‰à¸™à¸³à¸ªà¸¡à¸²à¸„à¸¡à¸—à¸µà¹ˆà¹€à¸›à¹‡à¸™à¸„à¸£à¸±à¹‰à¸‡à¹à¸£à¸à¹à¸¥à¸°à¸œà¸¹à¹‰à¸™à¸³à¸—à¸µà¹ˆà¸à¸³à¸¥à¸±à¸‡à¹€à¸•à¸´à¸šà¹‚à¸•",
  "An evening of founder stories, civic entrepreneurship, and cross-sector introductions for young professionals.": "à¸„à¹ˆà¸³à¸„à¸·à¸™à¹à¸«à¹ˆà¸‡à¸à¸²à¸£à¹à¸šà¹ˆà¸‡à¸›à¸±à¸™à¹€à¸£à¸·à¹ˆà¸­à¸‡à¸£à¸²à¸§à¸‚à¸­à¸‡à¸œà¸¹à¹‰à¸à¹ˆà¸­à¸•à¸±à¹‰à¸‡ à¸à¸²à¸£à¹€à¸›à¹‡à¸™à¸œà¸¹à¹‰à¸›à¸£à¸°à¸à¸­à¸šà¸à¸²à¸£à¹€à¸žà¸·à¹ˆà¸­à¸ªà¸±à¸‡à¸„à¸¡ à¹à¸¥à¸°à¸à¸²à¸£à¸ªà¸£à¹‰à¸²à¸‡à¹€à¸„à¸£à¸·à¸­à¸‚à¹ˆà¸²à¸¢à¸ªà¸³à¸«à¸£à¸±à¸šà¸„à¸™à¸—à¸³à¸‡à¸²à¸™à¸£à¸¸à¹ˆà¸™à¹ƒà¸«à¸¡à¹ˆ",
  "Blends networking with live case studies from Bangkok builders.": "à¸œà¸ªà¸¡à¸œà¸ªà¸²à¸™à¸à¸²à¸£à¸ªà¸£à¹‰à¸²à¸‡à¹€à¸„à¸£à¸·à¸­à¸‚à¹ˆà¸²à¸¢à¸à¸±à¸šà¸à¸²à¸£à¸¨à¸¶à¸à¸©à¸²à¸à¸£à¸“à¸µà¸¨à¸¶à¸à¸©à¸²à¸ˆà¸£à¸´à¸‡à¸ˆà¸²à¸à¸œà¸¹à¹‰à¸ªà¸£à¹‰à¸²à¸‡à¸à¸£à¸¸à¸‡à¹€à¸—à¸žà¸¯",
  "A volunteer activation that paired local partners, members, and youth leaders around a targeted neighborhood initiative.": "à¸à¸²à¸£à¸—à¸³à¸à¸´à¸ˆà¸à¸£à¸£à¸¡à¸­à¸²à¸ªà¸²à¸ªà¸¡à¸±à¸„à¸£à¸—à¸µà¹ˆà¸£à¸§à¸¡à¸žà¸¥à¸±à¸‡à¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£à¸—à¹‰à¸­à¸‡à¸–à¸´à¹ˆà¸™ à¸ªà¸¡à¸²à¸Šà¸´à¸ à¹à¸¥à¸°à¸œà¸¹à¹‰à¸™à¸³à¹€à¸¢à¸²à¸§à¸Šà¸™à¹€à¸žà¸·à¹ˆà¸­à¸žà¸±à¸’à¸™à¸²à¸Šà¸¸à¸¡à¸Šà¸™à¹ƒà¸™à¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¹€à¸›à¹‰à¸²à¸«à¸¡à¸²à¸¢",
  "Built to demonstrate visible local action, not abstract volunteering.": "à¸ˆà¸±à¸”à¸—à¸³à¸‚à¸¶à¹‰à¸™à¹€à¸žà¸·à¹ˆà¸­à¹à¸ªà¸”à¸‡à¸à¸²à¸£à¸¥à¸‡à¸¡à¸·à¸­à¸—à¸³à¸ˆà¸£à¸´à¸‡à¹ƒà¸™à¸£à¸°à¸”à¸±à¸šà¸—à¹‰à¸­à¸‡à¸–à¸´à¹ˆà¸™ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¸‡à¸²à¸™à¸­à¸²à¸ªà¸²à¸ªà¸¡à¸±à¸„à¸£à¸—à¸µà¹ˆà¹€à¸›à¹‡à¸™à¸™à¸²à¸¡à¸˜à¸£à¸£à¸¡",

  // Project Titles
  "Future Skills for Bangkok Youth": "à¸—à¸±à¸à¸©à¸°à¹à¸«à¹ˆà¸‡à¸­à¸™à¸²à¸„à¸•à¸ªà¸³à¸«à¸£à¸±à¸šà¹€à¸¢à¸²à¸§à¸Šà¸™à¸à¸£à¸¸à¸‡à¹€à¸—à¸žà¸¯",
  "Green District Challenge": "à¹‚à¸„à¸£à¸‡à¸à¸²à¸£à¸—à¹‰à¸²à¸—à¸²à¸¢à¹€à¸‚à¸•à¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¸ªà¸µà¹€à¸‚à¸µà¸¢à¸§",
  "Bangkok Social Enterprise Exchange": "à¹à¸žà¸¥à¸•à¸Ÿà¸­à¸£à¹Œà¸¡à¹à¸¥à¸à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸§à¸´à¸ªà¸²à¸«à¸à¸´à¸ˆà¹€à¸žà¸·à¹ˆà¸­à¸ªà¸±à¸‡à¸„à¸¡à¸à¸£à¸¸à¸‡à¹€à¸—à¸žà¸¯",

  // Project Summaries, Beneficiaries, Impacts
  "A workshop series connecting communication, leadership, and career-readiness for young people entering the workforce.": "à¸Šà¸¸à¸”à¸à¸²à¸£à¸›à¸£à¸°à¸Šà¸¸à¸¡à¹€à¸Šà¸´à¸‡à¸›à¸à¸´à¸šà¸±à¸•à¸´à¸à¸²à¸£à¸—à¸µà¹ˆà¹€à¸Šà¸·à¹ˆà¸­à¸¡à¹‚à¸¢à¸‡à¸à¸²à¸£à¸ªà¸·à¹ˆà¸­à¸ªà¸²à¸£ à¸ à¸²à¸§à¸°à¸œà¸¹à¹‰à¸™à¸³ à¹à¸¥à¸°à¸„à¸§à¸²à¸¡à¸žà¸£à¹‰à¸­à¸¡à¹ƒà¸™à¸­à¸²à¸Šà¸µà¸žà¸ªà¸³à¸«à¸£à¸±à¸šà¸„à¸™à¸£à¸¸à¹ˆà¸™à¹ƒà¸«à¸¡à¹ˆà¸—à¸µà¹ˆà¸à¸³à¸¥à¸±à¸‡à¸à¹‰à¸²à¸§à¹€à¸‚à¹‰à¸²à¸ªà¸¹à¹ˆà¸•à¸¥à¸²à¸”à¹à¸£à¸‡à¸‡à¸²à¸™",
  "Upper secondary and university-aged participants": "à¸œà¸¹à¹‰à¹€à¸‚à¹‰à¸²à¸£à¹ˆà¸§à¸¡à¹ƒà¸™à¸£à¸°à¸”à¸±à¸šà¸¡à¸±à¸˜à¸¢à¸¡à¸¨à¸¶à¸à¸©à¸²à¸•à¸­à¸™à¸›à¸¥à¸²à¸¢à¹à¸¥à¸°à¸¡à¸«à¸²à¸§à¸´à¸—à¸¢à¸²à¸¥à¸±à¸¢",
  "Training pathways with volunteer mentors and partner organizations.": "à¹€à¸ªà¹‰à¸™à¸—à¸²à¸‡à¸à¸²à¸£à¹€à¸£à¸µà¸¢à¸™à¸£à¸¹à¹‰à¸žà¸£à¹‰à¸­à¸¡à¹€à¸¡à¸™à¹€à¸—à¸­à¸£à¹Œà¸­à¸²à¸ªà¸²à¸ªà¸¡à¸±à¸„à¸£à¹à¸¥à¸°à¸­à¸‡à¸„à¹Œà¸à¸£à¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£",
  "A community initiative that turns environmental awareness into local action through public campaigns and partnerships.": "à¹‚à¸„à¸£à¸‡à¸à¸²à¸£à¸£à¸´à¹€à¸£à¸´à¹ˆà¸¡à¸‚à¸­à¸‡à¸Šà¸¸à¸¡à¸Šà¸™à¸—à¸µà¹ˆà¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¸„à¸§à¸²à¸¡à¸•à¸£à¸°à¸«à¸™à¸±à¸à¸£à¸¹à¹‰à¸”à¹‰à¸²à¸™à¸ªà¸´à¹ˆà¸‡à¹à¸§à¸”à¸¥à¹‰à¸­à¸¡à¹€à¸›à¹‡à¸™à¸à¸²à¸£à¸›à¸à¸´à¸šà¸±à¸•à¸´à¹ƒà¸™à¸—à¹‰à¸­à¸‡à¸–à¸´à¹ˆà¸™à¸œà¹ˆà¸²à¸™à¸à¸²à¸£à¸£à¸“à¸£à¸‡à¸„à¹Œà¹à¸¥à¸°à¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£",
  "Neighborhood communities and civic partners": "à¸Šà¸¸à¸¡à¸Šà¸™à¹à¸¥à¸°à¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£à¸ à¸²à¸„à¸›à¸£à¸°à¸Šà¸²à¸ªà¸±à¸‡à¸„à¸¡à¹ƒà¸™à¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆ",
  "Creates a visible route from participation to measurable city impact.": "à¸ªà¸£à¹‰à¸²à¸‡à¹€à¸ªà¹‰à¸™à¸—à¸²à¸‡à¸—à¸µà¹ˆà¸Šà¸±à¸”à¹€à¸ˆà¸™à¸ˆà¸²à¸à¸à¸²à¸£à¸¡à¸µà¸ªà¹ˆà¸§à¸™à¸£à¹ˆà¸§à¸¡à¹„à¸›à¸ªà¸¹à¹ˆà¸œà¸¥à¸¥à¸±à¸žà¸˜à¹Œà¸—à¸µà¹ˆà¸§à¸±à¸”à¸œà¸¥à¹„à¸”à¹‰à¸‚à¸­à¸‡à¹€à¸¡à¸·à¸­à¸‡",
  "A collaborative platform for founders, members, and partner organizations to exchange ideas around responsible business growth.": "à¹à¸žà¸¥à¸•à¸Ÿà¸­à¸£à¹Œà¸¡à¸à¸²à¸£à¸—à¸³à¸‡à¸²à¸™à¸£à¹ˆà¸§à¸¡à¸à¸±à¸™à¸ªà¸³à¸«à¸£à¸±à¸šà¸œà¸¹à¹‰à¸à¹ˆà¸­à¸•à¸±à¹‰à¸‡ à¸ªà¸¡à¸²à¸Šà¸´à¸ à¹à¸¥à¸°à¸­à¸‡à¸„à¹Œà¸à¸£à¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£à¹€à¸žà¸·à¹ˆà¸­à¹à¸¥à¸à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¹à¸™à¸§à¸„à¸´à¸”à¸à¸²à¸£à¹€à¸•à¸´à¸šà¹‚à¸•à¸—à¸²à¸‡à¸˜à¸¸à¸£à¸à¸´à¸ˆà¸­à¸¢à¹ˆà¸²à¸‡à¸£à¸±à¸šà¸œà¸´à¸”à¸Šà¸­à¸š",
  "Early-stage founders and young professionals": "à¸œà¸¹à¹‰à¸à¹ˆà¸­à¸•à¸±à¹‰à¸‡à¸˜à¸¸à¸£à¸à¸´à¸ˆà¸£à¸°à¸¢à¸°à¹€à¸£à¸´à¹ˆà¸¡à¸•à¹‰à¸™à¹à¸¥à¸°à¸„à¸™à¸—à¸³à¸‡à¸²à¸™à¸£à¸¸à¹ˆà¸™à¹ƒà¸«à¸¡à¹ˆ",
  "Bridges networking with mentorship and real collaboration.": "à¹€à¸Šà¸·à¹ˆà¸­à¸¡à¹‚à¸¢à¸‡à¹€à¸„à¸£à¸·à¸­à¸‚à¹ˆà¸²à¸¢à¹€à¸‚à¹‰à¸²à¸à¸±à¸šà¹€à¸¡à¸™à¹€à¸—à¸­à¸£à¹Œà¹à¸¥à¸°à¸à¸²à¸£à¸—à¸³à¸‡à¸²à¸™à¸£à¹ˆà¸§à¸¡à¸à¸±à¸™à¸ˆà¸£à¸´à¸‡",
  "Successful execution with target objectives met.": "à¸à¸²à¸£à¸”à¸³à¹€à¸™à¸´à¸™à¸‡à¸²à¸™à¸—à¸µà¹ˆà¸›à¸£à¸°à¸ªà¸šà¸„à¸§à¸²à¸¡à¸ªà¸³à¹€à¸£à¹‡à¸ˆà¸•à¸²à¸¡à¸§à¸±à¸•à¸–à¸¸à¸›à¸£à¸°à¸ªà¸‡à¸„à¹Œà¸—à¸µà¹ˆà¸•à¸±à¹‰à¸‡à¹„à¸§à¹‰",
  "Participants": "à¸œà¸¹à¹‰à¹€à¸‚à¹‰à¸²à¸£à¹ˆà¸§à¸¡",
  "Partner Organizations": "à¸­à¸‡à¸„à¹Œà¸à¸£à¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£",

  // Article Titles & Summaries
  "Why young leaders in Bangkok need practice, not just inspiration": "à¸—à¸³à¹„à¸¡à¸œà¸¹à¹‰à¸™à¸³à¸£à¸¸à¹ˆà¸™à¹ƒà¸«à¸¡à¹ˆà¹ƒà¸™à¸à¸£à¸¸à¸‡à¹€à¸—à¸žà¸¯ à¸–à¸¶à¸‡à¸•à¹‰à¸­à¸‡à¸à¸²à¸£à¸à¸²à¸£à¸¥à¸‡à¸¡à¸·à¸­à¸›à¸à¸´à¸šà¸±à¸•à¸´à¸ˆà¸£à¸´à¸‡ à¹„à¸¡à¹ˆà¹ƒà¸Šà¹ˆà¹à¸„à¹ˆà¹à¸£à¸‡à¸šà¸±à¸™à¸”à¸²à¸¥à¹ƒà¸ˆ",
  "A perspective on building confidence through committees, projects, and public-facing responsibility.": "à¸¡à¸¸à¸¡à¸¡à¸­à¸‡à¹ƒà¸™à¸à¸²à¸£à¸ªà¸£à¹‰à¸²à¸‡à¸„à¸§à¸²à¸¡à¸¡à¸±à¹ˆà¸™à¹ƒà¸ˆà¸œà¹ˆà¸²à¸™à¸à¸²à¸£à¸—à¸³à¸‡à¸²à¸™à¹ƒà¸™à¸„à¸“à¸°à¸—à¸³à¸‡à¸²à¸™ à¹‚à¸„à¸£à¸‡à¸à¸²à¸£ à¹à¸¥à¸°à¸à¸²à¸£à¸£à¸±à¸šà¸œà¸´à¸”à¸Šà¸­à¸šà¸‡à¸²à¸™à¸ªà¸²à¸˜à¸²à¸£à¸“à¸°",
  "Inside Community Action Day: what local impact looked like on the ground": "à¹€à¸ˆà¸²à¸°à¸¥à¸¶à¸à¸§à¸±à¸™à¸šà¸³à¹€à¸žà¹‡à¸à¸›à¸£à¸°à¹‚à¸¢à¸Šà¸™à¹Œà¹€à¸žà¸·à¹ˆà¸­à¸Šà¸¸à¸¡à¸Šà¸™: à¸ à¸²à¸žà¸ªà¸°à¸—à¹‰à¸­à¸™à¸‚à¸­à¸‡à¸à¸²à¸£à¸ªà¸£à¹‰à¸²à¸‡à¸œà¸¥à¸¥à¸±à¸žà¸˜à¹Œà¹ƒà¸™à¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¸ˆà¸£à¸´à¸‡",
  "A recap of how local partners and members worked together on a focused district initiative.": "à¸ªà¸£à¸¸à¸›à¸œà¸¥à¸à¸²à¸£à¸—à¸³à¸‡à¸²à¸™à¸£à¹ˆà¸§à¸¡à¸à¸±à¸™à¸‚à¸­à¸‡à¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£à¸—à¹‰à¸­à¸‡à¸–à¸´à¹ˆà¸™à¹à¸¥à¸°à¸ªà¸¡à¸²à¸Šà¸´à¸à¹ƒà¸™à¹‚à¸„à¸£à¸‡à¸à¸²à¸£à¸£à¸°à¸”à¸±à¸šà¹€à¸‚à¸•",
  "A new chapter year with a global mission and a Bangkok mindset": "à¸›à¸µà¹à¸«à¹ˆà¸‡à¸šà¸—à¸šà¸²à¸—à¹ƒà¸«à¸¡à¹ˆà¸à¸±à¸šà¸žà¸±à¸™à¸˜à¸à¸´à¸ˆà¸£à¸°à¸”à¸±à¸šà¹‚à¸¥à¸à¹à¸¥à¸°à¹à¸™à¸§à¸„à¸´à¸”à¹à¸šà¸šà¸„à¸™à¸à¸£à¸¸à¸‡à¹€à¸—à¸žà¸¯",
  "A message about turning the JCI mission into grounded local opportunities for young active citizens.": "à¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡à¹€à¸à¸µà¹ˆà¸¢à¸§à¸à¸±à¸šà¸à¸²à¸£à¹à¸›à¸¥à¸‡à¸žà¸±à¸™à¸˜à¸à¸´à¸ˆà¸‚à¸­à¸‡ JCI à¹€à¸›à¹‡à¸™à¹‚à¸­à¸à¸²à¸ªà¹ƒà¸™à¸à¸²à¸£à¸›à¸à¸´à¸šà¸±à¸•à¸´à¸ˆà¸£à¸´à¸‡à¸ªà¸³à¸«à¸£à¸±à¸šà¸žà¸¥à¹€à¸¡à¸·à¸­à¸‡à¸•à¸·à¹ˆà¸™à¸£à¸¹à¹‰à¸£à¸¸à¹ˆà¸™à¹ƒà¸«à¸¡à¹ˆ",

  // Member Names & Roles & Quotes
  "Mina S.": "à¸¡à¸´à¸™à¸² à¹€à¸­à¸ª.",
  "Member and program lead": "à¸ªà¸¡à¸²à¸Šà¸´à¸à¹à¸¥à¸°à¸œà¸¹à¹‰à¸™à¸³à¹‚à¸„à¸£à¸‡à¸à¸²à¸£",
  "JCI Bangkok gave me a place to test my leadership in public, with real stakes and a supportive team behind me.": "JCI à¸à¸£à¸¸à¸‡à¹€à¸—à¸žà¸¯ à¸¡à¸­à¸šà¸žà¸·à¹‰à¸™à¸—à¸µà¹ˆà¹ƒà¸«à¹‰à¸‰à¸±à¸™à¹„à¸”à¹‰à¸—à¸”à¸ªà¸­à¸šà¸„à¸§à¸²à¸¡à¹€à¸›à¹‡à¸™à¸œà¸¹à¹‰à¸™à¸³à¹ƒà¸™à¸—à¸µà¹ˆà¸ªà¸²à¸˜à¸²à¸£à¸“à¸° à¸”à¹‰à¸§à¸¢à¹‚à¸„à¸£à¸‡à¸à¸²à¸£à¸ˆà¸£à¸´à¸‡à¹à¸¥à¸°à¸—à¸µà¸¡à¸‡à¸²à¸™à¸—à¸µà¹ˆà¸„à¸­à¸¢à¸ªà¸™à¸±à¸šà¸ªà¸™à¸¸à¸™à¸­à¸¢à¸¹à¹ˆà¹€à¸šà¸·à¹‰à¸­à¸‡à¸«à¸¥à¸±à¸‡",
  "From event volunteer to committee lead within one year.": "à¸ˆà¸²à¸à¸­à¸²à¸ªà¸²à¸ªà¸¡à¸±à¸„à¸£à¸à¸´à¸ˆà¸à¸£à¸£à¸¡à¸ªà¸¹à¹ˆà¸œà¸¹à¹‰à¸™à¸³à¸„à¸“à¸°à¸—à¸³à¸‡à¸²à¸™à¸ à¸²à¸¢à¹ƒà¸™à¸«à¸™à¸¶à¹ˆà¸‡à¸›à¸µ",
  
  "Narin T.": "à¸™à¸£à¸´à¸™à¸—à¸£à¹Œ à¸—à¸µ.",
  "Partnership committee": "à¸„à¸“à¸°à¸—à¸³à¸‡à¸²à¸™à¸à¹ˆà¸²à¸¢à¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£",
  "I joined for community impact and stayed because the network pushed me to think bigger than my day job.": "à¸‰à¸±à¸™à¹€à¸‚à¹‰à¸²à¸£à¹ˆà¸§à¸¡à¹€à¸žà¸£à¸²à¸°à¸­à¸¢à¸²à¸à¸ªà¸£à¹‰à¸²à¸‡à¸œà¸¥à¸¥à¸±à¸žà¸˜à¹Œà¹€à¸žà¸·à¹ˆà¸­à¸Šà¸¸à¸¡à¸Šà¸™ à¹à¸¥à¸°à¸¢à¸±à¸‡à¸„à¸‡à¸­à¸¢à¸¹à¹ˆà¹€à¸žà¸£à¸²à¸°à¹€à¸„à¸£à¸·à¸­à¸‚à¹ˆà¸²à¸¢à¸œà¸¥à¸±à¸à¸”à¸±à¸™à¹ƒà¸«à¹‰à¸‰à¸±à¸™à¸„à¸´à¸”à¹„à¸”à¹‰à¹„à¸à¸¥à¸à¸§à¹ˆà¸²à¸‡à¸²à¸™à¸›à¸£à¸°à¸ˆà¸³à¸—à¸µà¹ˆà¸—à¸³",
  "Built sponsor conversations into long-term partner relationships.": "à¸žà¸±à¸’à¸™à¸²à¸à¸²à¸£à¹€à¸ˆà¸£à¸ˆà¸²à¸à¸±à¸šà¸œà¸¹à¹‰à¸ªà¸™à¸±à¸šà¸ªà¸™à¸¸à¸™à¸ªà¸¹à¹ˆà¸„à¸§à¸²à¸¡à¸ªà¸±à¸¡à¸žà¸±à¸™à¸˜à¹Œà¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£à¸£à¸°à¸¢à¸°à¸¢à¸²à¸§",
  
  "Aiko P.": "à¹„à¸­à¹‚à¸à¸° à¸žà¸µ.",
  "International relations": "à¸à¹ˆà¸²à¸¢à¸„à¸§à¸²à¸¡à¸ªà¸±à¸¡à¸žà¸±à¸™à¸˜à¹Œà¸£à¸°à¸«à¸§à¹ˆà¸²à¸‡à¸›à¸£à¸°à¹€à¸—à¸¨",
  "The international side of JCI made Bangkok feel connected to something much bigger, while still keeping the work local.": "à¸”à¹‰à¸²à¸™à¸à¸²à¸£à¸•à¹ˆà¸²à¸‡à¸›à¸£à¸°à¹€à¸—à¸¨ of JCI à¸—à¸³à¹ƒà¸«à¹‰à¸à¸£à¸¸à¸‡à¹€à¸—à¸žà¸¯ à¸£à¸¹à¹‰à¸ªà¸¶à¸à¹€à¸Šà¸·à¹ˆà¸­à¸¡à¹‚à¸¢à¸‡à¸à¸±à¸šà¸ªà¸´à¹ˆà¸‡à¸—à¸µà¹ˆà¹ƒà¸«à¸à¹ˆà¸à¸§à¹ˆà¸²à¸¡à¸²à¸à¹ƒà¸™à¸£à¸°à¸”à¸±à¸šà¸ªà¸²à¸à¸¥ à¹ƒà¸™à¸‚à¸“à¸°à¹€à¸”à¸µà¸¢à¸§à¸à¸±à¸™à¸à¹‡à¸¢à¸±à¸‡à¸„à¸‡à¸¥à¸‡à¸¡à¸·à¸­à¸—à¸³à¹ƒà¸™à¸—à¹‰à¸­à¸‡à¸–à¸´à¹ˆà¸™à¸‚à¸­à¸‡à¹€à¸£à¸²",
  "Led collaboration with visiting delegates and regional partners.": "à¸™à¸³à¸—à¸µà¸¡à¸›à¸£à¸°à¸ªà¸²à¸™à¸‡à¸²à¸™à¸£à¹ˆà¸§à¸¡à¸à¸±à¸šà¸œà¸¹à¹‰à¹à¸—à¸™à¸—à¸µà¹ˆà¸¡à¸²à¹€à¸¢à¸·à¸­à¸™à¹à¸¥à¸°à¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£à¹ƒà¸™à¸ à¸¹à¸¡à¸´à¸ à¸²à¸„",

  // Board Members
  "Pimnara L.": "à¸žà¸´à¸¡à¸™à¸²à¸£à¸² à¹à¸­à¸¥.",
  "Local President": "à¸™à¸²à¸¢à¸à¸ªà¸¡à¸²à¸„à¸¡à¸›à¸µ 2026",
  "Strategy and partnerships": "à¸à¸¥à¸¢à¸¸à¸—à¸˜à¹Œà¹à¸¥à¸°à¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£",
  "Leads the yearly chapter direction, external relations, and board alignment.": "à¸™à¸³à¸—à¸²à¸‡à¸—à¸´à¸¨à¸—à¸²à¸‡à¸›à¸£à¸°à¸ˆà¸³à¸›à¸µà¸‚à¸­à¸‡à¸ªà¸¡à¸²à¸„à¸¡ à¸„à¸§à¸²à¸¡à¸ªà¸±à¸¡à¸žà¸±à¸™à¸˜à¹Œà¸ à¸²à¸¢à¸™à¸­à¸ à¹à¸¥à¸°à¸à¸²à¸£à¸›à¸£à¸°à¸ªà¸²à¸™à¸‡à¸²à¸™à¸‚à¸­à¸‡à¸„à¸“à¸°à¸à¸£à¸£à¸¡à¸à¸²à¸£",
  
  "Thanawat C.": "à¸˜à¸™à¸§à¸±à¸’à¸™à¹Œ à¸‹à¸µ.",
  "Executive Vice President": "à¸£à¸­à¸‡à¸™à¸²à¸¢à¸à¸ªà¸¡à¸²à¸„à¸¡à¸à¹ˆà¸²à¸¢à¸šà¸£à¸´à¸«à¸²à¸£",
  "Operations": "à¸à¸²à¸£à¸”à¸³à¹€à¸™à¸´à¸™à¸‡à¸²à¸™",
  "Coordinates chapter execution across committees and annual goals.": "à¸›à¸£à¸°à¸ªà¸²à¸™à¸‡à¸²à¸™à¸à¸²à¸£à¸”à¸³à¹€à¸™à¸´à¸™à¸‡à¸²à¸™à¸‚à¸­à¸‡à¸ªà¸¡à¸²à¸„à¸¡à¸‚à¹‰à¸²à¸¡à¸„à¸“à¸°à¸—à¸³à¸‡à¸²à¸™à¹à¸¥à¸°à¹€à¸›à¹‰à¸²à¸«à¸¡à¸²à¸¢à¸›à¸£à¸°à¸ˆà¸³à¸›à¸µ",
  
  "Kanya R.": "à¸à¸±à¸™à¸¢à¸² à¸­à¸²à¸£à¹Œ.",
  "Vice President for Membership": "à¸£à¸­à¸‡à¸™à¸²à¸¢à¸à¸ªà¸¡à¸²à¸„à¸¡à¸à¹ˆà¸²à¸¢à¸ªà¸¡à¸²à¸Šà¸´à¸à¸ à¸²à¸ž",
  "Member development": "à¸à¹ˆà¸²à¸¢à¸žà¸±à¸’à¸™à¸²à¸ªà¸¡à¸²à¸Šà¸´à¸",
  "Focuses on recruitment, onboarding, and tracking active member pathways.": "à¸¡à¸¸à¹ˆà¸‡à¹€à¸™à¹‰à¸™à¸à¸²à¸£à¸ªà¸£à¸£à¸«à¸² à¸›à¸à¸¡à¸™à¸´à¹€à¸—à¸¨ à¹à¸¥à¸°à¸•à¸´à¸”à¸•à¸²à¸¡à¹€à¸ªà¹‰à¸™à¸—à¸²à¸‡à¸à¸²à¸£à¹€à¸£à¸µà¸¢à¸™à¸£à¸¹à¹‰à¸‚à¸­à¸‡à¸ªà¸¡à¸²à¸Šà¸´à¸à¸ à¸²à¸ž",

  "Sarut T.": "à¸¨à¸£à¸¸à¸• à¸—à¸µ.",
  "Vice President for Projects": "à¸£à¸­à¸‡à¸™à¸²à¸¢à¸à¸ªà¸¡à¸²à¸„à¸¡à¸à¹ˆà¸²à¸¢à¹‚à¸„à¸£à¸‡à¸à¸²à¸£",
  "Civic projects": "à¹‚à¸„à¸£à¸‡à¸à¸²à¸£à¹€à¸žà¸·à¹ˆà¸­à¸ªà¸±à¸‡à¸„à¸¡",
  "Oversees execution and partner coordination for major community events.": "à¸”à¸¹à¹à¸¥à¸à¸²à¸£à¸”à¸³à¹€à¸™à¸´à¸™à¸‡à¸²à¸™à¹à¸¥à¸°à¸à¸²à¸£à¸›à¸£à¸°à¸ªà¸²à¸™à¸‡à¸²à¸™à¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£à¸ªà¸³à¸«à¸£à¸±à¸šà¸à¸´à¸ˆà¸à¸£à¸£à¸¡à¸«à¸¥à¸±à¸à¸‚à¸­à¸‡à¸Šà¸¸à¸¡à¸Šà¸™",

  "Nutcha J.": "à¸“à¸±à¸à¸Šà¸² à¹€à¸ˆ.",
  "Secretary General": "à¹€à¸¥à¸‚à¸²à¸˜à¸´à¸à¸²à¸£",
  "Governance and communication": "à¸à¸²à¸£à¸à¸³à¸à¸±à¸šà¸”à¸¹à¹à¸¥à¹à¸¥à¸°à¸à¸²à¸£à¸ªà¸·à¹ˆà¸­à¸ªà¸²à¸£",
  "Manages chapter documentation, communications, and administrative compliance.": "à¸ˆà¸±à¸”à¸à¸²à¸£à¹€à¸­à¸à¸ªà¸²à¸£à¸‚à¸­à¸‡à¸ªà¸¡à¸²à¸„à¸¡ à¸à¸²à¸£à¸ªà¸·à¹ˆà¸­à¸ªà¸²à¸£ à¹à¸¥à¸°à¸à¸²à¸£à¸›à¸à¸´à¸šà¸±à¸•à¸´à¸•à¸²à¸¡à¸à¸Žà¸£à¸°à¹€à¸šà¸µà¸¢à¸šà¸à¸²à¸£à¸šà¸£à¸´à¸«à¸²à¸£à¸‡à¸²à¸™",

  "Chaiwat S.": "à¸Šà¸±à¸¢à¸§à¸±à¸’à¸™à¹Œ à¹€à¸­à¸ª.",
  "Treasurer": "à¹€à¸«à¸£à¸±à¸à¸à¸´à¸",
  "Finance": "à¸à¸²à¸£à¹€à¸‡à¸´à¸™",
  "Manages chapter accounts, budget tracking, and corporate filings.": "à¸ˆà¸±à¸”à¸à¸²à¸£à¸šà¸±à¸à¸Šà¸µà¸‚à¸­à¸‡à¸ªà¸¡à¸²à¸„à¸¡ à¸•à¸´à¸”à¸•à¸²à¸¡à¸‡à¸šà¸›à¸£à¸°à¸¡à¸²à¸“ à¹à¸¥à¸°à¸¢à¸·à¹ˆà¸™à¹€à¸­à¸à¸ªà¸²à¸£à¸—à¸²à¸‡à¸à¸²à¸£à¹€à¸‡à¸´à¸™à¸‚à¸­à¸‡à¸™à¸´à¸•à¸´à¸šà¸¸à¸„à¸„à¸¥",

  "Lead forward, build local trust.": "à¸™à¸³à¸žà¸²à¹„à¸›à¸‚à¹‰à¸²à¸‡à¸«à¸™à¹‰à¸² à¸ªà¸£à¹‰à¸²à¸‡à¸„à¸§à¸²à¸¡à¹„à¸§à¹‰à¸§à¸²à¸‡à¹ƒà¸ˆà¹ƒà¸™à¸—à¹‰à¸­à¸‡à¸–à¸´à¹ˆà¸™",
  "A board focused on member growth, stronger partnerships, and visible project delivery in Bangkok.": "à¸„à¸“à¸°à¸à¸£à¸£à¸¡à¸à¸²à¸£à¸—à¸µà¹ˆà¸¡à¸¸à¹ˆà¸‡à¹€à¸™à¹‰à¸™à¸à¸²à¸£à¹€à¸•à¸´à¸šà¹‚à¸•à¸‚à¸­à¸‡à¸ªà¸¡à¸²à¸Šà¸´à¸ à¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£à¸—à¸µà¹ˆà¹€à¸‚à¹‰à¸¡à¹à¸‚à¹‡à¸‡ à¹à¸¥à¸°à¸à¸²à¸£à¸ªà¹ˆà¸‡à¸¡à¸­à¸šà¹‚à¸„à¸£à¸‡à¸à¸²à¸£à¸—à¸µà¹ˆà¸ˆà¸±à¸šà¸•à¹‰à¸­à¸‡à¹„à¸”à¹‰à¹ƒà¸™à¸à¸£à¸¸à¸‡à¹€à¸—à¸žà¸¯",

  // Partners
  "Global Sponsor A": "à¸œà¸¹à¹‰à¸ªà¸™à¸±à¸šà¸ªà¸™à¸¸à¸™à¸£à¸°à¸”à¸±à¸šà¹‚à¸¥à¸ A",
  "Local Partner B": "à¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£à¸—à¹‰à¸­à¸‡à¸–à¸´à¹ˆà¸™ B",
  "Embassy Partner C": "à¸žà¸±à¸™à¸˜à¸¡à¸´à¸•à¸£à¸ªà¸–à¸²à¸™à¸—à¸¹à¸• C",
  "University D": "à¸¡à¸«à¸²à¸§à¸´à¸—à¸¢à¸²à¸¥à¸±à¸¢ D",
  "Community Sponsor E": "à¸œà¸¹à¹‰à¸ªà¸™à¸±à¸šà¸ªà¸™à¸¸à¸™à¸Šà¸¸à¸¡à¸Šà¸™ E",

  // General Settings
  "JCI Bangkok": "JCI à¸à¸£à¸¸à¸‡à¹€à¸—à¸žà¸¯",
  "Â© 2026 JCI Bangkok. All Rights Reserved.": "Â© 2026 JCI à¸à¸£à¸¸à¸‡à¹€à¸—à¸žà¸¯ à¸ªà¸‡à¸§à¸™à¸¥à¸´à¸‚à¸ªà¸´à¸—à¸˜à¸´à¹Œà¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”"
}

function toRichText(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              type: 'text',
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

function parseDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) {
      return d.toISOString()
    }
  } catch {
    // ignore
  }
  return new Date().toISOString()
}

async function run() {
  console.log('Starting Payload CMS seeding with localized data...')
  
  const configModule = await import('./payload.config')
  const configPromise = configModule.default
  const payload = await getPayload({ config: configPromise })

  // Clean existing data to allow fresh seed
  console.log('Cleaning existing data (except users)...')
  await payload.delete({ collection: 'events', where: { id: { exists: true } } })
  await payload.delete({ collection: 'projects', where: { id: { exists: true } } })
  await payload.delete({ collection: 'articles', where: { id: { exists: true } } })
  await payload.delete({ collection: 'board-members', where: { id: { exists: true } } })
  await payload.delete({ collection: 'member-stories', where: { id: { exists: true } } })
  await payload.delete({ collection: 'partners', where: { id: { exists: true } } })
  await payload.delete({ collection: 'media', where: { id: { exists: true } } })

  // 1. Create Admin User
  console.log('Seeding Admin User...')
  const existingUsers = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'admin@jcibangkok.org',
      },
    },
  })

  let adminUser
  if (existingUsers.docs.length === 0) {
    adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@jcibangkok.org',
        password: 'Password123!',
        roles: ['super-admin'],
      },
    })
    console.log('Admin User created successfully.')
  } else {
    adminUser = existingUsers.docs[0]
    console.log('Admin User already exists.')
  }

  // 2. Upload Media Images
  console.log('Seeding Media images...')
  const imageNames = [
    'hero-community.png',
    'community-project.png',
    'leadership-workshop.png',
    'member-story.png',
    'ux-concept.png',
    'ec7.jpg',
    'ec8.jpg',
    'toyp.jpg',
  ]

  interface SeedMedia {
    id: string | number
  }

  const mediaDocs: Record<string, SeedMedia> = {}

  for (const name of imageNames) {
    const filePath = path.resolve(dirname, '../public/images/home', name)
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath)
      const mediaDoc = await payload.create({
        collection: 'media',
        data: {
          alt: name.replace('-', ' ').replace('.png', ''),
        },
        file: {
          data: fileBuffer,
          name,
          mimetype: name.endsWith('.jpg') ? 'image/jpeg' : 'image/png',
          size: fileBuffer.length,
        },
      })
      mediaDocs[name] = mediaDoc as unknown as SeedMedia
      console.log(`Uploaded media image: ${name}`)
    } else {
      console.warn(`File not found: ${filePath}`)
    }
  }

  // Helper to get fallback media ID
  const getFallbackMediaId = () => {
    const keys = Object.keys(mediaDocs)
    return keys.length > 0 ? mediaDocs[keys[0]].id : null
  }

  // 3. Seed Events
  console.log('Seeding Events...')
  interface SeedEvent {
    id: string | number
  }
  const createdEvents: Record<string, SeedEvent> = {}
  for (const event of seedEvents) {
    let coverImageId = getFallbackMediaId()
    if (event.slug === 'entrepreneur-club-7-young-to-yak' && mediaDocs['ec7.jpg']) {
      coverImageId = mediaDocs['ec7.jpg'].id
    } else if (event.slug === 'entrepreneur-club-8-lecture-bar' && mediaDocs['ec8.jpg']) {
      coverImageId = mediaDocs['ec8.jpg'].id
    } else if (event.slug === 'jci-toyp-2026' && mediaDocs['toyp.jpg']) {
      coverImageId = mediaDocs['toyp.jpg'].id
    } else if (mediaDocs['hero-community.png']) {
      coverImageId = mediaDocs['hero-community.png'].id
    }

    const eventTypeMap: Record<string, string> = {
      'Training': 'training',
      'Networking': 'networking',
      'Community Project': 'community',
      'General Meeting': 'general',
      'International Event': 'international',
      'Partner Event': 'partner',
    }

    const statusMap: Record<string, string> = {
      'Upcoming': 'upcoming',
      'Completed': 'completed',
    }

    // A. Create in English
    const doc = await payload.create({
      collection: 'events',
      locale: 'en',
      data: {
        title: event.title,
        slug: event.slug,
        eventDate: parseDate(event.date),
        venue: event.venue,
        eventType: eventTypeMap[event.type] || 'training',
        shortDescription: event.summary,
        fullDescription: toRichText(event.highlight),
        coverImage: coverImageId,
        status: statusMap[event.status] || 'upcoming',
        featured: event.slug === 'jci-toyp-2026',
      },
    })

    // B. Update in Thai
    await payload.update({
      collection: 'events',
      id: doc.id,
      locale: 'th',
      data: {
        title: TRANSLATIONS[event.title] || event.title,
        venue: TRANSLATIONS[event.venue] || event.venue,
        shortDescription: TRANSLATIONS[event.summary] || event.summary,
        fullDescription: toRichText(TRANSLATIONS[event.highlight] || event.highlight),
      },
    })

    createdEvents[event.slug] = doc as unknown as SeedEvent
    console.log(`Created Event: ${event.title}`)
  }

  // 4. Seed Projects
  console.log('Seeding Projects...')
  const createdProjects: Record<string, { id: string | number }> = {}
  for (const project of seedProjects) {
    const categoryMap: Record<string, string> = {
      'Youth Development': 'youth',
      'Sustainability': 'sustainability',
      'Entrepreneurship': 'entrepreneurship',
      'Community Impact': 'community',
      'International Cooperation': 'international',
    }

    // A. Create in English
    const doc = await payload.create({
      collection: 'projects',
      locale: 'en',
      data: {
        title: project.title,
        slug: project.slug,
        year: parseInt(project.year) || 2026,
        category: categoryMap[project.category] || 'community',
        problemStatement: project.summary,
        targetBeneficiaries: project.beneficiaries,
        activities: toRichText(project.impact),
        outcomes: toRichText('Successful execution with target objectives met.'),
        impactNumbers: [
          { value: '100+', label: 'Participants' },
          { value: '5+', label: 'Partner Organizations' },
        ],
        sdgTags: ['sdg-4', 'sdg-8', 'sdg-17'],
      },
    })

    // B. Update in Thai
    await payload.update({
      collection: 'projects',
      id: doc.id,
      locale: 'th',
      data: {
        title: TRANSLATIONS[project.title] || project.title,
        problemStatement: TRANSLATIONS[project.summary] || project.summary,
        targetBeneficiaries: TRANSLATIONS[project.beneficiaries] || project.beneficiaries,
        activities: toRichText(TRANSLATIONS[project.impact] || project.impact),
        outcomes: toRichText(TRANSLATIONS['Successful execution with target objectives met.'] || 'Successful execution with target objectives met.'),
        impactNumbers: [
          { value: '100+', label: TRANSLATIONS['Participants'] || 'Participants' },
          { value: '5+', label: TRANSLATIONS['Partner Organizations'] || 'Partner Organizations' },
        ],
      },
    })

    createdProjects[project.slug] = doc
    console.log(`Created Project: ${project.title}`)
  }

  // 5. Seed Articles
  console.log('Seeding Articles...')
  for (const article of seedArticles) {
    let coverImageId = getFallbackMediaId()
    if (article.slug === 'inside-community-action-day' && mediaDocs['community-project.png']) {
      coverImageId = mediaDocs['community-project.png'].id
    } else if (mediaDocs['hero-community.png']) {
      coverImageId = mediaDocs['hero-community.png'].id
    }

    const categoryMap: Record<string, string> = {
      'Knowledge Article': 'knowledge',
      'Event Recap': 'event-recap',
      'President Message': 'president-message',
      'News': 'news',
    }

    // Link to related event/project if applicable
    let relatedEvent
    if (article.slug === 'inside-community-action-day' && createdEvents['community-action-day']) {
      relatedEvent = createdEvents['community-action-day'].id
    }

    // A. Create in English
    const doc = await payload.create({
      collection: 'articles',
      locale: 'en',
      data: {
        title: article.title,
        slug: article.slug,
        author: adminUser.id,
        category: categoryMap[article.category] || 'news',
        coverImage: coverImageId,
        summary: article.summary,
        body: toRichText(article.summary),
        publishDate: parseDate(article.publishedAt),
        relatedEvent,
      },
    })

    // B. Update in Thai
    await payload.update({
      collection: 'articles',
      id: doc.id,
      locale: 'th',
      data: {
        title: TRANSLATIONS[article.title] || article.title,
        summary: TRANSLATIONS[article.summary] || article.summary,
        body: toRichText(TRANSLATIONS[article.summary] || article.summary),
      },
    })

    console.log(`Created Article: ${article.title}`)
  }

  // 6. Seed Board Members
  console.log('Seeding Board Members...')
  for (const yearEntry of seedBoardYears) {
    for (const member of yearEntry.members) {
      // Use member story image as fallback
      const photoId = mediaDocs['member-story.png']
        ? mediaDocs['member-story.png'].id
        : getFallbackMediaId()

      // A. Create in English
      const doc = await payload.create({
        collection: 'board-members',
        locale: 'en',
        data: {
          name: member.name,
          position: member.role,
          year: parseInt(yearEntry.year),
          photo: photoId,
          bio: toRichText(member.bio),
          companyRole: member.company,
          displayOrder: member.role.includes('President') ? 1 : 10,
        },
      })

      // B. Update in Thai
      await payload.update({
        collection: 'board-members',
        id: doc.id,
        locale: 'th',
        data: {
          name: TRANSLATIONS[member.name] || member.name,
          position: TRANSLATIONS[member.role] || member.role,
          bio: toRichText(TRANSLATIONS[member.bio] || member.bio),
          companyRole: TRANSLATIONS[member.company] || member.company,
        },
      })

      console.log(`Created Board Member: ${member.name} for ${yearEntry.year}`)
    }
  }

  // 7. Seed Member Stories
  console.log('Seeding Member Stories...')
  for (const story of seedStories) {
    const photoId = mediaDocs['member-story.png']
      ? mediaDocs['member-story.png'].id
      : getFallbackMediaId()

    // A. Create in English
    const doc = await payload.create({
      collection: 'member-stories',
      locale: 'en',
      data: {
        memberName: story.name,
        yearJoined: parseInt(story.yearJoined) || 2024,
        chapterRole: story.role,
        storyTitle: story.highlight,
        quote: story.quote,
        fullStory: toRichText(story.quote),
        photo: photoId,
      },
    })

    // B. Update in Thai
    await payload.update({
      collection: 'member-stories',
      id: doc.id,
      locale: 'th',
      data: {
        memberName: TRANSLATIONS[story.name] || story.name,
        chapterRole: TRANSLATIONS[story.role] || story.role,
        storyTitle: TRANSLATIONS[story.highlight] || story.highlight,
        quote: TRANSLATIONS[story.quote] || story.quote,
        fullStory: toRichText(TRANSLATIONS[story.quote] || story.quote),
      },
    })

    console.log(`Created Member Story for: ${story.name}`)
  }

  // 8. Seed Partners
  console.log('Seeding Partners...')
  for (const partnerName of seedPartners) {
    const logoId = mediaDocs['ux-concept.png']
      ? mediaDocs['ux-concept.png'].id
      : getFallbackMediaId()

    // A. Create in English
    const doc = await payload.create({
      collection: 'partners',
      locale: 'en',
      data: {
        organizationName: partnerName,
        logo: logoId,
        partnerType: partnerName.includes('Sponsor') ? 'sponsor' : 'partner',
        partnershipYear: 2026,
        description: `Seeded partner: ${partnerName}`,
      },
    })

    // B. Update in Thai
    await payload.update({
      collection: 'partners',
      id: doc.id,
      locale: 'th',
      data: {
        organizationName: TRANSLATIONS[partnerName] || partnerName,
        description: TRANSLATIONS[`Seeded partner: ${partnerName}`] || `Seeded partner: ${partnerName}`,
      },
    })

    console.log(`Created Partner: ${partnerName}`)
  }

  // 9. Global Site Settings
  console.log('Updating Global Site Settings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      siteName: 'JCI Bangkok',
      currentYearTheme: seedBoardYears[0]?.theme || 'Lead forward, build local trust.',
      footerText: 'Â© 2026 JCI Bangkok. All Rights Reserved.',
    },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'th',
    data: {
      siteName: TRANSLATIONS['JCI Bangkok'] || 'JCI Bangkok',
      currentYearTheme: TRANSLATIONS[seedBoardYears[0]?.theme || 'Lead forward, build local trust.'] || (seedBoardYears[0]?.theme || 'Lead forward, build local trust.'),
      footerText: TRANSLATIONS['Â© 2026 JCI Bangkok. All Rights Reserved.'] || 'Â© 2026 JCI Bangkok. All Rights Reserved.',
    },
  })
  console.log('Global Site Settings updated.')

  console.log('Seeding process completed successfully!')
  process.exit(0)
}

run().catch((err) => {
  console.error('Seeding failed:')
  console.dir(err, { depth: null })
  process.exit(1)
})
