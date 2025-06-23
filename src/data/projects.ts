export interface ProjectMeta {
  /** URL segment & folder name */
  slug: string;
  /** Display title */
  title: string;
  /** Short marketing blurb */
  tagline: string;
  /** 1×1 thumbnail shown on grids/cards */
  thumbnail: string;
  /** 16×9 hero image on the detail page */
  hero: string;
}

export const projects: ProjectMeta[] = [
  {
    slug: "cleanmydesktop-pro",
    title: "CleanMyDesktop Pro",
    tagline: "One-click organizer for chaotic desktops.",
    thumbnail: "/assets/projects/cleanmydesktop-pro/thumb@1x1.jpg",
    hero: "/assets/projects/cleanmydesktop-pro/hero@16x9.jpg",
  },
  {
    slug: "habit-tracker",
    title: "Habit Tracker",
    tagline: "Track habits, moods & streaks.",
    thumbnail: "/assets/projects/habit-tracker/thumb@1x1.jpg",
    hero: "/assets/projects/habit-tracker/hero@16x9.jpg",
  },
];