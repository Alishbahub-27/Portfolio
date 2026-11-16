import ExperienceImg from "../images/experience-section-img.svg";

const Experience = () => {
  const experiences = [
    {
      role: "WordPress Web Developer",
      company: "INFINITY Protection Inc [Florida,US]",
      duration: "Aug 2025 — Present (Full-Time)",
      description:
        "Working as a Full Stack WordPress Developer handling frontend and backend, including theme customization, plugin integration, responsive UI development, SEO optimization, and website performance improvements.",
    },
    {
      role: "Senior Web Developer",
      company: "CostVisory [New Jersey , United States ]",
      duration: "Aug 2026 — Present",
      location: "Teaneck, US",
      description:
        "Developing and maintaining responsive WordPress websites, landing pages, and custom web solutions. Handling UI/UX design, technical SEO, website optimization, and performance improvements. Building custom CRM systems, lead management solutions, and automated business workflows for lead generation, customer onboarding, email notifications, and operations. Managing third-party integrations, APIs, forms, hosting, domains, and technical infrastructure.",
    },

    {
      role: "WordPress Developer & SEO Specialist",
      company: "Nexora Global BPO [United States]",
      duration: "Oct 2026 — Present (Part-Time)",
      description:
        "Developing and optimizing telecom websites, including BroadbandsNow.com, using WordPress, Elementor, and responsive web technologies. Managing end-to-end SEO strategies, including on-page, off-page, and technical SEO, keyword research, competitor analysis, backlink building, and content optimization using SEMrush, Ahrefs, Google Search Console, and Google Analytics. Focused on improving search rankings, organic traffic, website performance, and lead generation.",
    },
    {
      role: "Senior WordPress Developer",
      company: "Ithon Technology [United States]",
      duration: "Jun 2025 — June 2026 (Full-Time)",
      description:
        "Leading end-to-end WordPress development for client websites, including custom Elementor builds, responsive marketing pages, SEO optimization, and performance improvements. Develop and maintain operational portals with PHP and MySQL databases, handle website migrations, configure CPTs and ACF, and integrate third-party tools, APIs, forms, payment gateways, and automation workflows.",
    },

    {
      role: "Web Developer Intern",
      company: "WebDevSoft - Web & Software Solutions [Bihar,India]",
      duration: "Oct 2025 — December 2025 (Part-Time)",
      description:
        "Contributing to live projects by building reusable components, fixing UI issues, and improving front-end functionality. Collaborating with senior developers to enhance UX and maintain coding best practices.",
    },
    {
      role: "Freelance Frontend Developer",
      company: "Remote",
      duration: "2022 — Present",
      description:
        "Developing modern, responsive, and high-performing websites for clients worldwide. Focused on clean UI, optimized performance, and delivering pixel-perfect results using HTML, SCSS, JavaScript, and React.",
    },
    {
      role: "Freelance WordPress Developer",
      company: "Remote",
      duration: "2022 — Present",
      description:
        "Developing responsive and scalable WordPress websites for clients worldwide. Focused on Themes customization, plugin integration, clean UI structure, performance optimization, and delivering reliable, client-ready solutions.",
    },
  ];

  return (
    <section className="experience-section" id="experience">
      <div className="container">
        <h2 className="section-heading text-center">EXPERIENCE</h2>

        <div className="row align-items-center gy-4">
          <div className="col-md-5">
            <div className="experience-image">
              <img src={ExperienceImg} alt="Experience" />
            </div>
          </div>

          <div className="col-md-7">
            <div className="timeline">
              {experiences.map((exp, index) => (
                <div className="timeline-item" key={index}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3>{exp.role}</h3>
                    <h4>{exp.company}</h4>
                    <span className="duration">{exp.duration}</span>
                    <p>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
