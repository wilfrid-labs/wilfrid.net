export const site = {
  name: 'wilfrid.net',
  fullName: 'Wilfrid Girard',
  url: 'https://wilfrid.net',
  title: 'Wilfrid Girard — Software engineering, graphics & AI',
  description: 'Wilfrid Girard, software engineer working across C++, real-time graphics, and low-level systems. Exploring GPU computing, machine learning, and AI engineering.',
  github: 'https://github.com/wilfrid-labs',
  linkedin: 'https://www.linkedin.com/in/wilfrid',
};

export const projects = [
  {
    name: 'RgbToSpectrum',
    year: '2014',
    profile: 'wip-',
    profileUrl: 'https://github.com/wip-',
    category: 'Color & light',
    description: 'A C# tool for visualizing Brian Smits’ RGB-to-spectrum algorithm, with spectral power distribution filtering.',
    tags: ['C#', 'Color science'],
    url: 'https://github.com/wip-/RgbToSpectrum',
    visual: 'spectrum',
  },
  {
    name: 'MSAA sample patterns',
    year: '2020',
    profile: 'Wilfrid-Unity',
    profileUrl: 'https://github.com/Wilfrid-Unity',
    category: 'Real-time rendering',
    description: 'A Unity project implementing an MSAA sample pattern detector. A closer look at how pixels are sampled.',
    tags: ['Unity', 'Anti-aliasing'],
    url: 'https://github.com/Wilfrid-Unity/unity-msaa-pattern',
    visual: 'samples',
  },
] as const;
