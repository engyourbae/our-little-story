export type ExprId = 'senang' | 'tertawa' | 'malu' | 'cemberut' | 'terkejut' | 'manja' | 'jahil' | 'sedih' | 'lembut';
export type Who = 'boy' | 'inda' | 'narrator';
export type Pose = 'stand' | 'sit' | 'hug';
export type Anim = 'wave' | 'hop' | null;
export type MusicMood = 'garden' | 'soft' | 'romantic' | 'emotional' | 'off';
export type ChapterId = 'c0' | 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'final';
export type SceneId = 'menu' | 'invitation' | 'garden' | 'house' | 'secret' | 'final';
export type Quality = 'low' | 'medium' | 'high';

export interface Choice { label: string; reply: DialogueLine[] }
export interface DialogueLine {
  who: Who;
  text: string;
  boy?: ExprId;
  inda?: ExprId;
  hold?: number;
  choices?: Choice[];
  mood?: MusicMood;
  fx?: string[];
}
export interface StageSpec {
  cam: string;
  boy?: { x: number; z: number; y?: number; pose?: Pose; visible?: boolean };
  inda?: { x: number; z: number; y?: number; pose?: Pose };
  bloom?: number;
  glow?: number;
  mood?: MusicMood;
}
export interface ChapterDef {
  id: ChapterId;
  title: string;
  subtitle: string;
  scene: SceneId;
  lines: DialogueLine[];
  parts?: Record<string, DialogueLine[]>;
  stage: StageSpec;
}
export interface Settings {
  music: number;
  sfx: number;
  muted: boolean;
  playing: boolean;
  quality: Quality;
  textSpeed: 'slow' | 'normal' | 'fast';
}
export interface SaveData {
  v: 1;
  started: boolean;
  chapters: Partial<Record<ChapterId, boolean>>;
  c3seen: string[];
  hasKey: boolean;
  hiddenDone: boolean;
  hearts: string[];
  mini: Record<string, boolean>;
  lastScene: SceneId;
  letterRead: boolean;
  notes: number[];
  settings: Settings;
}
