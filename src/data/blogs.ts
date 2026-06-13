export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'faq'; items: { question: string; answer: string }[] }

export type BlogPost = {
  slug: string
  title: string
  date: string
  excerpt: string
  image: string
  imageAlt: string
  blocks: BlogBlock[]
}

const blogFallback = {
  image: '/assets/about.png',
  imageAlt: 'Aerostar Aviation Academy blog',
} as const

const blogImagesBySlug: Record<string, { image: string; imageAlt: string }> = {
  'air-hostess-training-institutes-in-ahmedabad-build-your-career-in-aviation': {
    image: '/assets/blogs/blog-air-hostess-ahmedabad.jpg',
    imageAlt: 'Air hostess courses in Ahmedabad — Aerostar Aviation Academy',
  },
  'tours-travelling-course-in-ahmedabad-build-a-career-in-the-travel-and-tourism-industry': {
    image: '/assets/blogs/blog-tours-travel-courses.jpg',
    imageAlt: 'Tours and travel courses — gateway to a global career in travel and tourism',
  },
  'build-your-future-with-the-top-tours-travel-management-institute-in-ahmedabad': {
    image: '/assets/blogs/blog-tours-travel-management-institute.jpg',
    imageAlt: 'Top tours and travel management institute in Ahmedabad',
  },
  'bright-career-in-hospitality': {
    image: '/assets/blogs/blog-hotel-management-ahmedabad.jpg',
    imageAlt: 'Hotel management course in Ahmedabad — build a career in hospitality',
  },
  'complete-guide-to-choosing-the-best-fashion-interior-designing-course-in-ahmedabad': {
    image: '/assets/blogs/blog-fashion-interior-design-guide.jpg',
    imageAlt: 'Complete guide to choosing the best fashion and interior designing course',
  },
  'start-your-cabin-crew-career': {
    image: '/assets/blogs/blog-cabin-crew-career.jpg',
    imageAlt: 'Airhostess and cabin crew training — gateway to an aviation career',
  },
  'the-best-hospitality-and-travel-management-courses-for-a-dream-career': {
    image: '/assets/blogs/blog-hospitality-travel-management.jpg',
    imageAlt: 'Hospitality and travel management courses for a dream career',
  },
  'everything-you-need-to-know-about-the-private-pilot-license-course-in-india': {
    image: '/assets/blogs/blog-private-pilot-license.jpg',
    imageAlt: 'Private Pilot License course in India — aviation training guide',
  },
  'welcome-to-aerostar-aviation-academy-learn-expertise-and-fly-high': {
    image: '/assets/blogs/blog-welcome-aerostar-academy.jpg',
    imageAlt: 'Welcome to Aerostar Aviation Academy — learn, expertise, and fly high',
  },
  'personality-industry-hospitality-tours-travel-industry': {
    image: '/assets/blogs/blog-personality-development.jpg',
    imageAlt: 'Personality development for hospitality, tours and travel careers',
  },
  'get-ready-with-the-best-cabin-crew-training-institution': {
    image: '/assets/blogs/blog-cabin-crew-training-institution.jpg',
    imageAlt: 'Best cabin crew training institution — get placement-ready',
  },
}

function firstParagraph(blocks: BlogBlock[]) {
  const paragraph = blocks.find((block) => block.type === 'paragraph')
  return paragraph?.text ?? ''
}

export const blogPosts = [
  {
    "slug": "tours-travelling-course-in-ahmedabad-build-a-career-in-the-travel-and-tourism-industry",
    "title": "Tours & Travelling Course in Ahmedabad: Build a Career in the Travel and Tourism Industry",
    "date": "May 21, 2026",
    "blocks": [
      {
        "type": "paragraph",
        "text": "The travel and tourism industry is one of the fastest-growing sectors that creates exciting career opportunities for students and professionals. With increasing domestic and international travel demand, the need for skilled tourism and travel professionals continues to grow. A professional Tours & Travelling course helps students develop the knowledge and practical skills required to work in airlines, travel agencies, tourism companies, hospitality sectors, and customer service industries."
      },
      {
        "type": "heading",
        "text": "What is a Tours & Travelling Course?"
      },
      {
        "type": "paragraph",
        "text": "A Tours & Travelling course is designed to provide students with knowledge about tourism management, travel operations, ticketing procedures, customer service, and hospitality management. The program helps students understand how the travel industry functions and prepares them for real-world job roles. The course focuses on developing both technical knowledge and professional skills required in the travel industry."
      },
      {
        "type": "heading",
        "text": "Training Generally Includes"
      },
      {
        "type": "list",
        "items": [
          "Tourism and Travel Industry Fundamentals — basic concepts, structure, functions, and different sectors at national and international levels.",
          "Domestic and International Travel Procedures — travel documentation, passport and visa procedures, travel regulations, airport processes.",
          "Ticketing and Reservation Systems — airline ticketing procedures, reservation systems, fare calculations, and travel booking processes.",
          "Customer Service Management — customer handling techniques, service quality standards, and managing customer interactions professionally.",
          "Communication and Soft Skills Development — verbal communication, interpersonal skills, public speaking, and professional interaction."
        ]
      },
      {
        "type": "heading",
        "text": "Why Choose Tours & Travelling as a Career?"
      },
      {
        "type": "list",
        "items": [
          "Growing Industry Opportunities — tourism continues to expand, creating employment in different domestic and international sectors.",
          "Dynamic Work Environment — exciting environments with diverse people and regular new challenges.",
          "Career Growth Opportunities — multiple career paths in travel agencies, airlines, hospitality companies, and tourism organisations.",
          "Global Exposure — learn about cultures, destinations, and international travel systems.",
          "Attractive Career Opportunities — roles in airlines, travel companies, hotels, tourism agencies, and customer service."
        ]
      },
      {
        "type": "heading",
        "text": "Why Students Choose Aerostarjet?"
      },
      {
        "type": "paragraph",
        "text": "Aerostarjet focuses on providing industry-oriented training designed to prepare students for successful careers in travel, tourism, aviation, and hospitality sectors. Training programs combine classroom learning with practical exposure, helping students understand industry standards and workplace expectations."
      },
      {
        "type": "heading",
        "text": "Frequently Asked Questions"
      },
      {
        "type": "faq",
        "items": [
          {
            "question": "1. What is a Tours & Travelling course?",
            "answer": "A course providing knowledge about tourism management, ticketing systems, travel operations, customer service, hospitality, and tour planning to prepare students for careers in the travel industry."
          },
          {
            "question": "2. Who can apply?",
            "answer": "Students who have completed their educational qualifications according to course requirements. Eligibility may vary depending on the institute and training program."
          },
          {
            "question": "3. What skills are important?",
            "answer": "Communication abilities, customer handling, teamwork, problem-solving, confidence, organisational abilities, and professional presentation."
          },
          {
            "question": "4. What career opportunities are available?",
            "answer": "Travel Consultants, Tour Executives, Ticketing Executives, Travel Coordinators, Airport Customer Service Executives, Hospitality Professionals, and Tourism Managers."
          },
          {
            "question": "5. Does Aerostarjet provide placement assistance?",
            "answer": "Yes — interview preparation support, personality development sessions, career guidance, and placement assistance opportunities."
          }
        ]
      }
    ]
  },
  {
    "slug": "air-hostess-training-institutes-in-ahmedabad-build-your-career-in-aviation",
    "title": "Air Hostess Training Institutes in Ahmedabad: Build Your Career in Aviation",
    "date": "May 15, 2026",
    "blocks": [
      {
        "type": "paragraph",
        "text": "The aviation industry continues to grow rapidly and offers exciting career opportunities for individuals who dream of working in airlines and the hospitality sector. Becoming an air hostess is one of the most popular career choices among students looking for a professional, dynamic, and rewarding career. Choosing the right Air Hostess Training Institute is the first step toward building a successful career."
      },
      {
        "type": "heading",
        "text": "What is an Air Hostess Training Program?"
      },
      {
        "type": "paragraph",
        "text": "An Air Hostess Training Program is designed to prepare students for careers in airlines, covering passenger safety, in-flight service, grooming, communication skills, personality development, and emergency handling. Students also learn about airline operations, customer service, and interview preparation."
      },
      {
        "type": "heading",
        "text": "Key Training Areas"
      },
      {
        "type": "list",
        "items": [
          "Cabin crew safety and emergency procedures",
          "Passenger handling and in-flight service",
          "Grooming, appearance standards, and professional etiquette",
          "Communication skills and personality development",
          "Airline operations and customer service protocols",
          "Interview preparation and career guidance"
        ]
      },
      {
        "type": "heading",
        "text": "Why Choose Aerostarjet for Air Hostess Training?"
      },
      {
        "type": "paragraph",
        "text": "Aerostarjet offers professional training programs combining practical learning, personality development, and job-ready skills. The institute focuses on grooming, communication training, mock interviews, and placement assistance with leading airlines and aviation companies."
      }
    ]
  },
  {
    "slug": "bright-career-in-hospitality",
    "title": "Hotel Management Courses: Build a Bright Career in Hospitality with Aerostar Jet",
    "date": "Apr 22, 2026",
    "blocks": [
      {
        "type": "paragraph",
        "text": "The hospitality industry is one of the fastest-growing sectors globally, offering a wide range of career opportunities in hotels, resorts, travel agencies, and service industries. Hotel management courses provide students with the knowledge and skills required to succeed in this dynamic field."
      },
      {
        "type": "heading",
        "text": "What Do Hotel Management Courses Cover?"
      },
      {
        "type": "list",
        "items": [
          "Front office operations and guest management",
          "Food and beverage service",
          "Housekeeping and accommodation management",
          "Customer service excellence and communication",
          "Hospitality industry operations and management",
          "Career development and personality training"
        ]
      },
      {
        "type": "heading",
        "text": "Career Opportunities in Hospitality"
      },
      {
        "type": "paragraph",
        "text": "Graduates can pursue roles as Front Office Executives, Guest Relations Officers, Travel Consultants, Hotel Management Trainees, Customer Service Executives, and Tourism Coordinators across domestic and international hospitality organisations."
      },
      {
        "type": "heading",
        "text": "Why Aerostar Jet?"
      },
      {
        "type": "paragraph",
        "text": "Aerostar Jet provides industry-focused hotel management training in Ahmedabad with experienced faculty, practical learning modules, personality development sessions, and placement assistance. The training is designed to prepare students for real-world hospitality environments."
      }
    ]
  },
  {
    "slug": "start-your-cabin-crew-career",
    "title": "Airhostess & Cabin Crew Course: Your Gateway to a Glamorous Aviation Career",
    "date": "Apr 12, 2026",
    "blocks": [
      {
        "type": "paragraph",
        "text": "The aviation industry is growing fast, and the demand for trained professionals is increasing every year. An Airhostess & Cabin Crew Course is a professional training program that prepares students for careers in the aviation industry, covering passenger safety, in-flight service, grooming, communication skills, personality development, and emergency handling."
      },
      {
        "type": "heading",
        "text": "Why Choose Airhostess & Cabin Crew as a Career?"
      },
      {
        "type": "list",
        "items": [
          "Attractive Salary Packages — competitive salaries with extra benefits and travel allowances.",
          "Travel Nationally and Internationally — explore new cities and countries with leading airlines.",
          "Professional Work Environment — disciplined, modern industry with global standards.",
          "Career Growth — grow into senior cabin crew, trainer, or management roles.",
          "Personality Development & Confidence Building — improve communication, grooming, body language.",
          "Meet People from Different Cultures — global exposure through interaction with passengers worldwide."
        ]
      },
      {
        "type": "heading",
        "text": "Why Choose Aerostar Jet?"
      },
      {
        "type": "list",
        "items": [
          "Experienced Trainers — industry experts with real aviation knowledge.",
          "Professional Training Programs — structured courses for Airhostess, Cabin Crew, Ground Staff.",
          "Grooming & Personality Development — confidence, communication, etiquette, and presentation.",
          "Interview Preparation Support — mock interviews and guidance sessions.",
          "Modern Learning Environment — professional classroom setup with updated learning methods.",
          "Placement Assistance — career support with leading airlines and aviation companies."
        ]
      }
    ]
  },
  {
    "slug": "build-your-future-with-the-top-tours-travel-management-institute-in-ahmedabad",
    "title": "Build Your Future with the Top Tours & Travel Management Institute in Ahmedabad",
    "date": "Mar 25, 2026",
    "blocks": [
      {
        "type": "paragraph",
        "text": "The travel and tourism industry has become one of the most dynamic and rapidly expanding sectors globally. With increasing connectivity, digital booking platforms and growing interest in leisure and business travel, the need for trained professionals in travel management is higher than ever before. Ahmedabad is emerging as a strong educational and commercial hub in Gujarat, creating new career opportunities in tourism and travel management."
      },
      {
        "type": "heading",
        "text": "Understanding Tours & Travel Management Education"
      },
      {
        "type": "paragraph",
        "text": "Tours and travel management education focuses on how the tourism industry functions from planning to execution — including tour package creation, travel documentation, ticketing systems, itinerary preparation, and customer relationship management. Training also covers international tourism trends, airline procedures, visa requirements, and travel regulations."
      },
      {
        "type": "heading",
        "text": "Key Components of the Course"
      },
      {
        "type": "list",
        "items": [
          "Airline ticketing and reservation systems",
          "Domestic and international tour planning",
          "Travel documentation and visa procedures",
          "Customer service and communication training",
          "Tourism marketing and digital booking platforms"
        ]
      },
      {
        "type": "heading",
        "text": "Why Choose Aerostarjet?"
      },
      {
        "type": "paragraph",
        "text": "Aerostarjet offers career-oriented training programs focusing on practical exposure, industry-relevant curriculum, and skill development. The institute is committed to preparing students for real-world challenges in national and international travel sectors."
      }
    ]
  },
  {
    "slug": "complete-guide-to-choosing-the-best-fashion-interior-designing-course-in-ahmedabad",
    "title": "Complete Guide to Choosing the Best Fashion & Interior Designing Course in Ahmedabad",
    "date": "Mar 13, 2026",
    "blocks": [
      {
        "type": "paragraph",
        "text": "The creative industry is growing rapidly as businesses and individuals focus more on aesthetics, branding, and functional design. Fashion and interior designing courses are designed to develop artistic vision, technical understanding, and practical skills required in the modern design world. Ahmedabad has become an emerging hub for creative education and professional training."
      },
      {
        "type": "heading",
        "text": "Why Choose Fashion Designing as a Career?"
      },
      {
        "type": "list",
        "items": [
          "Learn garment construction, textile knowledge, and fashion illustration",
          "Understand global fashion trends and styling techniques",
          "Develop skills in pattern making, draping, and digital design",
          "Opportunities with fashion brands, boutiques, or start your own label",
          "Growing demand in e-commerce, fashion marketing, and personal styling"
        ]
      },
      {
        "type": "heading",
        "text": "Why Interior Designing is a Smart Career Choice"
      },
      {
        "type": "paragraph",
        "text": "Interior designing has become one of the most promising and creative career options. With rapid urban development, changing lifestyle trends, and growing demand for well-designed residential and commercial spaces, skilled interior designers are highly valued across industries."
      },
      {
        "type": "heading",
        "text": "Why Choose Aerostarjet?"
      },
      {
        "type": "paragraph",
        "text": "Aerostarjet focuses on skill-based learning and career-oriented training. Students receive expert mentorship, practical project work, portfolio development, and career support for entering the fashion and interior design industries."
      }
    ]
  },
  {
    "slug": "the-best-hospitality-and-travel-management-courses-for-a-dream-career",
    "title": "The Best Hospitality and Travel Management Courses for a Dream Career",
    "date": "Feb 21, 2026",
    "blocks": [
      {
        "type": "paragraph",
        "text": "If you love meeting new people, discovering new cultures, and making someone's day brighter, then Hospitality and Travel Management Courses might be the perfect path for you. The hospitality and travel industry offers diverse, exciting, and well-paying career opportunities for trained professionals worldwide."
      },
      {
        "type": "heading",
        "text": "What These Courses Cover"
      },
      {
        "type": "list",
        "items": [
          "Hotel and resort operations management",
          "Travel agency operations and tour planning",
          "Ticketing and reservation systems",
          "Customer service and guest relations",
          "Communication, grooming, and personality development",
          "Career placement and interview preparation"
        ]
      },
      {
        "type": "heading",
        "text": "Career Paths Available"
      },
      {
        "type": "paragraph",
        "text": "Graduates can work in hotels and resorts, airlines, travel agencies, cruise lines, tourism departments, event management companies, and hospitality consulting firms both domestically and internationally."
      },
      {
        "type": "heading",
        "text": "Aerostarjet's Approach"
      },
      {
        "type": "paragraph",
        "text": "Aerostarjet combines industry knowledge with practical training to prepare students for successful careers. The institute offers placement support, personality development, communication training, and guidance throughout the learning journey."
      }
    ]
  },
  {
    "slug": "everything-you-need-to-know-about-the-private-pilot-license-course-in-india",
    "title": "Everything You Need to Know About the Private Pilot License Course in India",
    "date": "Feb 18, 2026",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Getting your wings is one of the most exciting things a person can do. A Private Pilot License (PPL) is a qualification that permits the holder to act as a hobby pilot of an aircraft. PPL holders cannot be paid for their work but can fly for personal pleasure and recreation."
      },
      {
        "type": "heading",
        "text": "Course Details"
      },
      {
        "type": "list",
        "items": [
          "Duration: 6 Months",
          "Flying Hours: 40 hours in Single Engine + 10 hours in Simulator (Total approx 50 hours)",
          "Solo Flying: Minimum 20 hours",
          "Aircraft: Cessna 172",
          "Eligibility: A pass in Class 10 STD",
          "Medical: Class II Medicals",
          "Language: The student should be proficient in English"
        ]
      },
      {
        "type": "heading",
        "text": "Ground Subjects (DGCA Examinations)"
      },
      {
        "type": "list",
        "items": [
          "Air Regulations — Aerodrome Search & Rescue, Rules & Regulations, Customs & Health, Communication and Navigational Facilities.",
          "Air Navigation — Theoretical and Practical Navigation.",
          "Aviation Meteorology — Weather Codes & Plotting, Synoptic Meteorology, Weather Charts interpretation.",
          "Technical General (Aircraft and Engines) — Design, Construction, Maintenance, Operation of Aircraft, Fuel, Loading, Weight Distribution.",
          "Specific Paper (Cessna-172) — Limitations, Aircraft Engines, Systems, Weight & Balance Performance."
        ]
      },
      {
        "type": "heading",
        "text": "Why Get a PPL?"
      },
      {
        "type": "paragraph",
        "text": "A PPL is the foundation for all further pilot training. Many students pursue a PPL as a stepping stone toward a Commercial Pilot License (CPL). Flying is also a valuable personal skill and hobby that opens up opportunities for air sports, private travel, and aviation enthusiast communities."
      }
    ]
  },
  {
    "slug": "welcome-to-aerostar-aviation-academy-learn-expertise-and-fly-high",
    "title": "Welcome to Aerostar Aviation Academy: Learn, Expertise, and Fly High",
    "date": "Mar 17, 2025",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Aerostar Aviation Academy is a premier institution dedicated to providing professional training in aviation, hospitality, tours & travel, and fashion & interior designing. The academy is committed to shaping the careers of students through industry-relevant curriculum, experienced faculty, and practical training environments."
      },
      {
        "type": "heading",
        "text": "What Aerostar Offers"
      },
      {
        "type": "list",
        "items": [
          "Professional aviation and hospitality courses",
          "Highly qualified and experienced faculty",
          "Mock aircraft training environment",
          "Grooming rooms and computer labs with latest technology",
          "Galileo reservation system training",
          "Free placement assistance upon course completion",
          "Centers in Ahmedabad, Baroda, Surat, and Rajkot"
        ]
      },
      {
        "type": "heading",
        "text": "The Aerostar Difference"
      },
      {
        "type": "paragraph",
        "text": "Aerostar combines practical and theoretical learning to create industry-ready professionals. The academy has achieved the highest placement records across airlines, airports, and hotel industries. Alumni are active across aviation and hospitality industries globally and continue to support the development of the institution."
      }
    ]
  },
  {
    "slug": "personality-industry-hospitality-tours-travel-industry",
    "title": "Personality Industry, Hospitality, Tours & Travel Industry",
    "date": "Feb 24, 2025",
    "blocks": [
      {
        "type": "paragraph",
        "text": "Personality development is a crucial component of success in the aviation, hospitality, and tours & travel industries. These sectors require professionals who can communicate effectively, present themselves confidently, and handle customer interactions with grace and professionalism."
      },
      {
        "type": "heading",
        "text": "Why Personality Development Matters"
      },
      {
        "type": "list",
        "items": [
          "First impressions are critical in hospitality and aviation careers",
          "Communication skills directly affect customer satisfaction",
          "Grooming and presentation reflect on the brand you represent",
          "Confidence helps in handling difficult situations professionally",
          "Soft skills differentiate candidates during airline recruitment"
        ]
      },
      {
        "type": "heading",
        "text": "What Aerostar Focuses On"
      },
      {
        "type": "list",
        "items": [
          "Spoken English and accent neutralisation",
          "Body language and professional demeanour",
          "Art of makeup, formal and casual looks, elegant dressing",
          "Interview handling and confidence building",
          "Workplace and corporate etiquette",
          "Emotional intelligence development"
        ]
      },
      {
        "type": "paragraph",
        "text": "The result of comprehensive personality training at Aerostar is that students are not just technically qualified — they are confident, well-presented, and communication-ready for any customer-facing role in aviation, hospitality, or travel."
      }
    ]
  },
  {
    "slug": "get-ready-with-the-best-cabin-crew-training-institution",
    "title": "Get Ready With the Best Cabin Crew Training Institution",
    "date": "Jan 23, 2025",
    "blocks": [
      {
        "type": "paragraph",
        "text": "The cabin crew profession is one of the most sought-after careers in aviation. It combines travel, customer service, safety, and professional excellence. Choosing the right cabin crew training institution is critical to building a successful career in the airline industry."
      },
      {
        "type": "heading",
        "text": "What to Look for in a Cabin Crew Training Institution"
      },
      {
        "type": "list",
        "items": [
          "Industry-experienced faculty with real aviation backgrounds",
          "Comprehensive curriculum covering safety, grooming, and service",
          "Mock aircraft training facilities",
          "Personality development and communication modules",
          "Placement assistance and airline recruitment support",
          "Recognised certifications valued by leading airlines"
        ]
      },
      {
        "type": "heading",
        "text": "Aerostar's Cabin Crew Training"
      },
      {
        "type": "paragraph",
        "text": "Aerostar Aviation Academy provides structured cabin crew training covering in-flight safety, passenger handling, hospitality protocols, crisis management, grooming, and communication. The academy's placement cell actively connects graduates with domestic and international airlines, airports, and hospitality organisations."
      },
      {
        "type": "heading",
        "text": "Career Roles After Training"
      },
      {
        "type": "list",
        "items": [
          "Cabin Crew / Air Hostess — domestic and international airlines",
          "Ground Staff — airports and airline services",
          "Airport Customer Service Executive",
          "Travel & Tourism Consultant",
          "Hospitality Executive — hotels, resorts, cruise lines"
        ]
      }
    ]
  }
].map((post) => ({
  ...post,
  blocks: post.blocks as BlogBlock[],
  excerpt: firstParagraph(post.blocks as BlogBlock[]),
  image: blogImagesBySlug[post.slug]?.image ?? blogFallback.image,
  imageAlt: blogImagesBySlug[post.slug]?.imageAlt ?? post.title,
})) as BlogPost[]

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getBlogListingPosts(): BlogPost[] {
  return blogPosts
}
