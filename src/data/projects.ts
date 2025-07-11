export interface ProjectMeta {
  /** URL segment & folder name */
  slug: string;
  /** Display title */
  title: string;
  /** Short marketing copy (preferred) */
  tagline: string;
  /** Legacy field still referenced by ProjectPreview */
  summary?: string;
  /** 1 × 1 thumbnail shown on grids/cards */
  thumbnail: string;
  /** 16 × 9 hero image on the detail page */
  hero: string;
}

export const projects: ProjectMeta[] = [
  {
    slug: "cleanmydesktop-pro",
    title: "CleanMyDesktop Pro",
    tagline: "One-click organizer for chaotic desktops.",
    summary: "One-click organizer for chaotic desktops.", // legacy alias
    thumbnail: "/assets/projects/cleanmydesktop-pro/thumb@1x1.jpg",
    hero: "/assets/projects/cleanmydesktop-pro/hero@16x9.jpg",
  },
  {
    slug: "habit-tracker",
    title: "Habit Tracker",
    tagline: "Track habits, moods & streaks.",
    summary: "Track habits, moods & streaks.", // legacy alias
    thumbnail: "/assets/projects/habit-tracker/thumb@1x1.jpg",
    hero: "/assets/projects/habit-tracker/hero@16x9.jpg",
  },
];
