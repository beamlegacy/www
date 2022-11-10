const Language = require('./../common/Language')

class en extends Language {

  metas = {
    title: "Meet the bright web – beam",
    description: "Browse. Capture. Write. Publish – Coming soon to macOS. Join the beta now.",
    ogTitle: "Meet the bright web – beam",
    ogUrl: process.env.CANONICAL_HOST,
    ogImage: `${process.env.CANONICAL_HOST}/assets/social/unfurl.jpg`,
    ogDescription: "Browse. Capture. Write. Publish – Coming soon to macOS. Join the beta now.",
    twitterSite: "getonbeam",
    twitterTitle: "Meet the bright web – beam",
    twitterImage: `${process.env.CANONICAL_HOST}/assets/social/unfurl.jpg`
  }

  header = {
    downloadBeam: "Download beam",
    nav: [
      {
        title: "Features",
        url: '/',
        classes: "is-mobile",
      },
      {
        title: "About",
        url: '/about.html'
      },
      {
        title: "Sign in",
        url: "https://app.beamapp.co",
        classes: "is-desktop"
      },
      {
        title: "Jobs",
        url: "https://angel.co/company/beam-app-1/jobs",
        classes: "is-mobile",
        target: "_blank",
      },
      {
        title: "Terms",
        url: "https://beamapp.co/tos",
        classes: "is-mobile",
        target: "_blank",
      },
      {
        title: "Policy",
        url: "https://beamapp.co/privacy",
        classes: "is-mobile",
        target: "_blank",
      }
    ]
  }

  footer = {
    year: new Date().getFullYear(),
    jobsUrl: "https://angel.co/company/beam-app-1/jobs",
    jobs: "Jobs",
    whyUrl: "https://public.beamapp.co/beam/note/c5ef3f23-5864-45ad-943e-b75b093555e1/Bright-Paper",
    why: "Why beam?",
    supportUrl: "https://beamapp.canny.io",
    support: "Support",
    privacyPolicyUrl: "https://beamapp.co/privacy",
    privacyPolicy: "Privacy",
    tosUrl: "https://beamapp.co/tos",
    tos: "Terms of service",
  }

  social = [
    {
      name: "Twitter",
      url: "https://twitter.com/getonbeam",
      icon: require('./../assets/svg/social/twitter.ts')
    }
  ]

  team = [
    {
      name: "Dom Leca",
      title: "CEO",
      image: "team-dom.jpg"
    },
    {
      name: "Sebastien Metrot",
      title: "CTO",
      image: "team-sebastien.jpg"
    },
    {
      name: "Fabien Penso",
      title: "Principal Engineer",
      image: "team-fabien.jpg"
    },
    {
      name: "Olivier Charavel",
      title: "Senior Designer",
      image: "team-olivier.jpg"
    },
    {
      name: "Jean-Louis Darmon",
      title: "macOS/iOS Engineer",
      image: "team-jeanlouis.jpg"
    },
    {
      name: "Remi Santos",
      title: "Senior macOS/iOS Engineer",
      image: "team-remi.jpg"
    },
    {
      name: "Paul Lefkopoulos",
      title: "Data Scientist",
      image: "team-paul.jpg"
    },
    {
      name: "Julien Plu",
      title: "Senior ML/NLP Engineer",
      image: "team-julien.jpg"
    },
    {
      name: "Ludovic Ollagnier",
      title: "Senior macOS/iOS Engineer",
      image: "team-ludovic.jpg"
    },
    {
      name: "Mathieu Jouhet",
      title: "Senior Front-End Web Engineer",
      image: "team-mathieu.jpg"
    },
    {
      name: "Andrii Vasyliev",
      title: "Senior QA Engineer",
      image: "team-andrii.jpg"
    },
    {
      name: "Stef Kors",
      title: "Web Engineer",
      image: "team-stef.jpg"
    },
    {
      name: "Wilfried de Kerchove de Denterghem",
      title: "Head of Engineering",
      image: "team-wilfried.jpg"
    },
    {
      name: "Quentin Valero",
      title: "Senior QA Engineer",
      image: "team-quentin.jpg"
    },
    {
      name: "Jerome Blondon",
      title: "Senior Backend Engineer",
      image: "team-jblondon.jpg"
    },
    {
      name: "Adam Viaud",
      title: "Software Engineer",
      image: "team-adam.jpg"
    },
    {
      name: "Adrian Tofan",
      title: "Senior Backend Engineer",
      image: "team-adrian.jpg"
    },
    {
      name: "Thomas Clement",
      title: "Senior macOS/iOS Engineer",
      image: ""
    },
    {
      name: "Gabriele Venturi",
      title: "Web Developer",
      image: "team-gabriele.jpg"
    }
  ]

  investors = [
    {
      name: "Bijan Sabet",
      company: "Spark Capital",
      title: "",
      image: "investor-bijan.jpg",
      logo: "investor-spark_logo.png",
      logoWidth: "140px"
    },
    {
      name: "Jordan Cooper",
      company: "PACE",
      title: "",
      image: "investor-jordan.jpg",
      logo: "investor-pace_logo.png",
      logoWidth: "60px"
    },
    {
      name: "François Meteyer",
      company: "Alven Capital",
      title: "",
      image: "investor-francois.jpg",
      logo: ""
    },
    {
      name: "Pascal Cagni",
      company: "C4 Ventures",
      title: "Apple SVP EMEA",
      image: "investor-pascal.jpg",
      logo: ""
    },
    {
      name: "Patrick  Murphy",
      company: "Amaranthine",
      title: "",
      image: "investor-patrick.jpg",
      logo: ""
    },
    {
      name: "Harry Stebbings",
      company: "20VC",
      title: "",
      image: "investor-harry.jpg",
      logo: ""
    },
    {
      name: "Andrew Wilkinson",
      company: "Tiny Ventures",
      title: "",
      image: "investor-andrew.jpg",
      logo: ""
    },
    {
      name: "Albert Wenger",
      company: "Eutopia - USV",
      title: "",
      image: "investor-albert.jpg",
      logo: ""
    },
    {
      name: "Christian Reber",
      company: "Pitch",
      title: "",
      image: "investor-christian.jpg",
      logo: ""
    },
    {
      name: "Antoine Martin",
      company: "Zenly",
      title: "",
      image: "investor-antoine.jpg",
      logo: ""
    },
    {
      name: "Nicolas Cohen",
      company: "Ankor Store",
      title: "",
      image: "investor-nicolas.jpg",
      logo: ""
    },
    {
      name: "Simon Dawlat",
      company: "Baatch",
      title: "",
      image: "investor-simon.jpg",
      logo: ""
    }
  ]
}

module.exports = en;
