// Example content for the preview on the home page. Not saved anywhere.
const sampleResume = {
    name: 'Example',
    username: 'Andromeda',
    city: 'New York City',
    state: 'New York',
    country: 'US',
    pincode: '10001',
    phonenum: '',
    email: 'andromeda@gmail.none',
    email2: '',
    header_urls: [
        { name: 'LinkedIn', url: 'https://www.linkedin.com' },
        { name: 'GitHub', url: 'https://github.com' },
    ],
    resumesummary: 'The term Andromeda most commonly refers to the Andromeda Galaxy, our nearest major galactic neighbor, but it also has prominent meanings in Greek mythology and Indian business.',
    education: [
        {
            institution: 'New York University, New York',
            qualifications: [
                { name: 'Bachelors in Beauty', description: '', start: '2019-08-01T00:00:00.000Z', end: '2023-05-01T00:00:00.000Z', ongoing: false, grades: 'CGPA: 8.7', extras: [] },
            ],
        },
    ],
    experience: [
        {
            organization: 'Universe',
            urls: [],
            extras: ['Galaxy II', 'Sky'],
            roles: [
                {
                    rolename: 'Existing',
                    rolesummary: 'Merchant spaceship to an exoplanet',
                    start: '2023-07-01T00:00:00.000Z',
                    end: '2025-01-01T00:00:00.000Z',
                    ongoing: true,
                    points: [
                        'Rebuilt the checkout form in React with inline validation, reducing drop-off by 18%.',
                        'Introduced a shared component library used by four product teams.',
                        'Brought the dashboard to WCAG 2.1 AA and added keyboard support to every table.',
                    ],
                    extras: ['Full-time'],
                    urls: [],
                },
            ],
        },
    ],
    projects: [
        {
            projectname: 'Bus Pass Renewal App',
            projectsummary: 'A mobile-first web app for renewing student bus passes.',
            start: '1970-01-01T00:00:00.000Z',
            end: '2022-12-01T00:00:00.000Z',
            ongoing: true,
            stack: { head: 'Built with', content: 'React, Node.js, Express, MongoDB' },
            urls: [],
            points: ['Used by 1,400 students in its first term.', 'Cut renewal time at the counter from 20 minutes to 3.'],
            extras: [],
        },
    ],
    skills: [
        { head: 'Languages', content: 'JavaScript, TypeScript, HTML, CSS, SQL' },
        { head: 'Frameworks & Tools', content: 'React, Next.js, Tailwind CSS, Jest, Playwright, Git, Figma' },
    ],
    extraSections: [
        {
            sectionName: 'Achievements',
            subsections: [
                { title: 'Smart India Hackathon 2022', summary: 'Winner in the software edition, transport track.', start: '2022-08-01T00:00:00.000Z', end: '2022-08-01T00:00:00.000Z', ongoing: false, points: [], urls: [], extras: [] },
            ],
        },
    ],
}

export default sampleResume
