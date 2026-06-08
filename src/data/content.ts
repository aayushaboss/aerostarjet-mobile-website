import { assets } from './assets'

export type NavLink = { label: string; href: string }

export type CourseCategory = 'aviation' | 'fashion-interior' | 'hospitality' | 'tours'

export type Course = {
  id: string
  code: string
  title: string
  badge: string
  description: string
  duration: string
  schedule: string
  categories: CourseCategory[]
  image: string
  programmeLabel: string
  tagline: string
}

export type WhyChooseItem = {
  title: [string, string]
  description: string
  icon: string
}

export type Testimonial = {
  name: string
  role: string
  quote: string
  initial: string
}

export type PlacementStory = {
  name: string
  role: string
}

export type FaqItem = { question: string; answer: string }

export type Branch = { city: string; address: string; phone: string }

export const site = {
  name: 'Aerostar Aviation Academy',
  phone: '+91 63579-83061',
  email: 'inquiry@aerostarjet.in',
  heroBadge: "GUJARAT'S NO.1 AIR HOSTESS & AIRPORT MANAGEMENT TRAINING INSTITUTE",
  heroLine1: "It's Time To Give",
  heroLine2: 'Your Dreams',
  heroLine2Accent: 'Wings',
  heroHashtag: '#FlyHighWithAerostar',
  heroDescription:
    'Aerostar Aviation Academy is an approved training partner of National Skill Development Corporation (NSDC), Skill India and Aerospace Sector Skill Council (ASSC).',
} as const

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'Placements', href: '/placements' },
  { label: 'Contact', href: '/contact' },
]

export const contactCopy = {
  overline: 'GET IN TOUCH',
  heading: 'Contact',
  headingAccent: '& Support',
  description:
    'Reach our admissions team or visit any of our Gujarat centres. We are here to help you start your aviation career.',
  corporateOffice:
    'Sun Grace 505, 5th Floor, Above Westside, Near Visat Circle, Chandkheda, Ahmedabad — 382424',
  phones: ['+91 90990 83787', '+91 94265 17033'] as const,
  email: 'inquiry@aerostarjet.in',
} as const

export const heroStats = [
  { value: '18+', label: 'Years of Excellence' },
  { value: '20,000+', label: 'Students Placed' },
  { value: '2,500+', label: 'Hiring Partners' },
] as const

export const aboutCopy = {
  overline: 'ABOUT AEROSTAR',
  heading: 'Vocational Training in',
  headingAccent: 'Aviation, Hospitality & Tours & Travel',
  body: 'Aerostar is a training institute that helps and trains students to build a career in aviation and hospitality. Holistic personality development and communication skills development are mostly complimentary to our courses.',
  bullets: [
    '✓ Highest placement records at airlines, airports & hotels',
    '✓ Globally productive alumni network',
    '✓ Exceptional, industry-led academic programs',
  ],
} as const

export const courseCategories: { id: 'all' | CourseCategory; label: string }[] = [
  { id: 'all', label: 'All courses' },
  { id: 'aviation', label: 'Aviation' },
  { id: 'fashion-interior', label: 'Fashion & Interior Designing' },
  { id: 'hospitality', label: 'Hospitality' },
]

export const courses: Course[] = [
  {
    id: 'cchm',
    code: 'CCHM',
    title: 'Cabin Crew & Hospitality Management',
    badge: 'Cabin Crew',
    description:
      'Specialised training in in-flight safety, passenger handling, hospitality protocols and crisis management.',
    duration: '6 Months',
    schedule: '5 days a week',
    categories: ['aviation', 'hospitality'],
    image: assets.courseCchm,
    programmeLabel: 'Cabin Crew Programme',
    tagline: 'Training for Excellence in Air and Hospitality Service',
  },
  {
    id: 'gstm',
    code: 'GSTM',
    title: 'Ground Staff & Travel Management',
    badge: 'Ground Staff',
    description:
      'Training for essential on-ground airport roles — check-in, baggage handling, ticketing and travel coordination.',
    duration: '6 Months',
    schedule: '5 days a week',
    categories: ['aviation', 'tours'],
    image: assets.courseAam,
    programmeLabel: 'Ground Staff Programme',
    tagline: 'Training for Excellence in Air and Hospitality Service',
  },
  {
    id: 'htcs',
    code: 'HTCS',
    title: 'Hospitality, Travel & Customer Service',
    badge: 'Hospitality',
    description:
      'Comprehensive training for guest relations, travel assistance and service-oriented roles to global standards.',
    duration: '6 Months',
    schedule: '5 days a week',
    categories: ['hospitality', 'tours'],
    image: assets.courseTtm,
    programmeLabel: 'Hospitality Programme',
    tagline: 'Training for Excellence in Air and Hospitality Service',
  },
  {
    id: 'pfd',
    code: 'PFD',
    title: 'Professional in Fashion Designing',
    badge: 'Fashion',
    description:
      'Garment construction, textile science, fashion illustration, pattern making and design concepts.',
    duration: '12 Months',
    schedule: '5 days a week',
    categories: ['fashion-interior'],
    image: assets.courseCchm,
    programmeLabel: 'Fashion Designing Programme',
    tagline: 'Build a creative career in fashion design',
  },
  {
    id: 'pid',
    code: 'PID',
    title: 'Professional in Interior Designing',
    badge: 'Interior',
    description:
      'Space planning, material knowledge, colour theory, furniture design and software like AutoCAD and SketchUp.',
    duration: '12 Months',
    schedule: '5 days a week',
    categories: ['fashion-interior'],
    image: assets.courseAam,
    programmeLabel: 'Interior Designing Programme',
    tagline: 'Design functional and beautiful interior spaces',
  },
  {
    id: 'aam',
    code: 'AAM',
    title: 'Aviation & Airport Management',
    badge: 'Aviation',
    description:
      'Comprehensive airport operations, aviation management, customer service and ground handling expertise.',
    duration: '6 Months',
    schedule: '5 days a week',
    categories: ['aviation'],
    image: assets.courseAam,
    programmeLabel: 'Airport Management Programme',
    tagline: 'Training for Excellence in Air and Hospitality Service',
  },
  {
    id: 'ttm',
    code: 'TTM',
    title: 'Tours & Travel Management',
    badge: 'Travel',
    description:
      'Tour planning, ticketing, visa processing, destination knowledge and travel industry operations.',
    duration: '6 Months',
    schedule: '5 days a week',
    categories: ['tours'],
    image: assets.courseTtm,
    programmeLabel: 'Travel Management Programme',
    tagline: 'Training for Excellence in Air and Hospitality Service',
  },
]

export const hiringPartners = [
  'Air India', 'IndiGo', 'Akasa Air', 'SpiceJet', 'Vistara', 'TAJ', 'The Oberoi',
  'ITC Hotels', 'Marriott', 'Hyatt', 'Radisson', 'Lemon Tree', 'Royal Orchid', '+ 490 more',
] as const

export const whyChoose: WhyChooseItem[] = [
  {
    title: ['Industry-Focused', 'Training'],
    description:
      'Practical exposure, real airport-style environments, grooming sessions, personality development, and industry-ready modules.',
    icon: assets.whyChooseIcon1,
  },
  {
    title: ['Placement-Driven', 'Learning'],
    description:
      'Interview preparation, communication enhancement, mock interviews, and placement with leading aviation and hospitality brands.',
    icon: assets.whyChooseIcon2,
  },
  {
    title: ['Professional Personality', 'Development'],
    description: 'Confidence, communication, presentation skills, discipline, and professional etiquette.',
    icon: assets.whyChooseIcon3,
  },
  {
    title: ['Modern Campus &', 'Expert Mentors'],
    description: 'Experienced trainers, advanced classrooms, interactive activities, and mentorship.',
    icon: assets.whyChooseIcon4,
  },
]

export const testimonials: Testimonial[] = [
  {
    quote:
      'The communication skill development must be the best training i needed. Aerostar Academy is the best training academy i could have joined to start off with my career. I am thankful for everyone over there, for getting me ready for the real-life.',
    name: 'Stuti Upadhyay',
    role: 'Ahmedabad International Airport',
    initial: 'S',
  },
  {
    quote:
      'The experienced and knowledgeable faculty members of Aerostar have helped the most for the real life of aviation industry. The mock-aircraft training and experience of our faculties trained me in the best way for the professional career.',
    name: 'Mausin Sharfi',
    role: 'Spice Jet',
    initial: 'M',
  },
  {
    quote:
      'The Aerostar aviation academy certificate and real-life training experience is helping me a lot in standing out from other candidates. The training helped me get prepared for the aviation industry from start, which is why i could successfully achieve my goal faster.',
    name: 'Ashok Sen',
    role: 'Ahmedabad International Airport',
    initial: 'A',
  },
]

export const placements: PlacementStory[] = [
  { name: 'Sameer Rana', role: 'Ahmedabad International Airport' },
  { name: 'Stuti upadhyay', role: 'Ahmedabad International Airport' },
  { name: 'Mausin Sharfi', role: 'Ahmedabad International Airport' },
  { name: 'Ashok Sen', role: 'Ahmedabad International Airport' },
]

export const faqs: FaqItem[] = [
  {
    question: 'What courses does Aerostar Aviation Academy offer?',
    answer:
      'Aerostar offers vocational training in Aviation, Hospitality, and Tours & Travel including Cabin Crew & Hospitality Management, Aviation & Airport Management, and Tours & Travel Management.',
  },
  {
    question: 'What is the duration of the courses?',
    answer: 'Most programmes are 6 months long with classes 5 days a week.',
  },
  {
    question: 'Does Aerostar provide placement assistance?',
    answer:
      'Yes. Aerostar provides internship and job placement support with 500+ hiring partners across airlines, aviation, hospitality and tours & travel.',
  },
  {
    question: 'Where are Aerostar centres located?',
    answer: 'Centres: Ahmedabad · Baroda · Surat · Rajkot',
  },
]

export const branches: Branch[] = [
  {
    city: 'Chandkheda — Ahmedabad',
    address: 'Sun Grace 505, 5th Floor, Above Westside, Near Visat Circle, Chandkheda, Ahmedabad — 382424',
    phone: '+91 95120 24092',
  },
  {
    city: 'Maninagar — Ahmedabad',
    address: 'Prism Rudra 306, 3rd Floor, Shah Alam Road, Maninagar, Ahmedabad — 380008',
    phone: '+91 97274 88828',
  },
  {
    city: 'Baroda',
    address: 'K P Infinity 402, 4th Floor, Near Natubhai Circle, Race Course, Vadodara — 390007',
    phone: '+91 99790 71119',
  },
  {
    city: 'Rajkot',
    address: 'The Emporia 26/27, 2nd Floor, AG Chowk, Kalawad Road, Rajkot — 360005',
    phone: '+91 94265 17033',
  },
  {
    city: 'Surat',
    address: 'Om Arcade 201, 2nd Floor, Nr Varachha Circle, Surat — 395006',
    phone: '+91 99798 55568',
  },
]

export const curriculumModules = [
  'Language Enhancement',
  'Accent Neutralization',
  'Introduction to Grammar',
  'Advanced Grammar',
  'Role-plays & Extempore',
  'Emotional Intelligence',
  'The Grooming Process',
  'Skin Care',
] as const

export function getCourseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id)
}

export function getCourseCountByCategory(category: 'all' | CourseCategory): number {
  if (category === 'all') return courses.length
  return courses.filter((course) => course.categories.includes(category)).length
}

export function getBlogById(id: string) {
  return blogPosts.find((post) => post.id === id)
}

export const blogPosts = [
  {
    id: '1',
    title: 'How to Prepare for a Cabin Crew Interview',
    excerpt: 'Essential tips and strategies for aspiring cabin crew professionals.',
    date: 'March 15, 2026',
  },
  {
    id: '2',
    title: 'Career Opportunities in Aviation Management',
    excerpt: 'Explore the diverse career paths available in the aviation industry.',
    date: 'March 10, 2026',
  },
  {
    id: '3',
    title: 'The Importance of Grooming in Hospitality',
    excerpt: 'Why professional grooming matters in aviation and hospitality careers.',
    date: 'March 5, 2026',
  },
] as const
