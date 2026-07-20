import { roomsPart1 } from './curriculumPart1';
import { roomsPart2 } from './curriculumPart2';
import { roomsPart3 } from './curriculumPart3';

export interface PlacardContent {
  narrative: string;
  rigor: string;
  history: string;
  exercises: string;
}

export interface RoomData {
  id: number;
  nameEn: string;
  nameJa: string;
  thesisEn: string;
  thesisJa: string;
  image?: string;
  imageAlt?: string;
  en: PlacardContent;
  ja: PlacardContent;
}

export const roomsData: Record<number, RoomData> = {
  ...roomsPart1,
  ...roomsPart2,
  ...roomsPart3,
};
