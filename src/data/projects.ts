export interface ProjectMeta {
  slug: string;
  title: string;
  summary: string;
  thumbnail: string;
  hero: string;
}

export const projects: ProjectMeta[] = [
  {
    slug: 'cleanmydesktop-pro',
    title: 'CleanMyDesktop Pro',
    summary: 'One-click organizer for chaotic desktops.',
    thumbnail: '/assets/projects/cleanmydesktop-pro/thumb@1x1.jpg',
    hero: '/assets/projects/cleanmydesktop-pro/hero@16x9.jpg',
  },
  {
    slug: 'habit-tracker',
    title: 'Habit Tracker',
    summary: 'Track daily habits with ease.',
    thumbnail: '/assets/projects/habit-tracker/thumb@1x1.jpg',
    hero: '/assets/projects/habit-tracker/hero@16x9.jpg',
  },
];
