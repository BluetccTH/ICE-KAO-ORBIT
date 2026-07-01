export interface CompatibilityData {
  harmonyPercentage: number;
  compatibilityTitle: string;
  commonGrounds: string[];
  traitSymmetry: string;
  stargazingStory: string;
  futureForecast: string;
  poeticSummary: string;
}

export interface LoveStoryCard {
  id: number;
  title: string;
  content: string;
  emoji: string;
  bgGradient: string;
}

export interface LoveStory {
  title: string;
  cards: LoveStoryCard[];
  quote: string;
}

export interface MalaRecipe {
  recipeName: string;
  ingredients: string[];
  steps: string[];
  chefNote: string;
}

export interface CosmicFortune {
  luckyTheme: string;
  compatibilityTip: string;
  prediction: string;
  starRating: number;
}

export interface LoveNote {
  id: string;
  sender: "Kao" | "Ice" | "Other";
  message: string;
  createdAt: string;
  sticker: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  funFact: string;
}
