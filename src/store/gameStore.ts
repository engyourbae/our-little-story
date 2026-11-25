import { create } from 'zustand';
import type { Anim, ChapterId, DialogueLine, ExprId, Pose, SaveData, SceneId, Who } from '../config/types';
import { loadSave, writeSave, defaultSave } from '../systems/SaveManager';
import { buildConfig, type GameConfig } from '../config/gameConfig';
import { loadOverrides } from '../utils/configStore';
import { currentMission } from '../systems/MissionManager';

export type Modal =
  | null | 'menu' | 'settings' | 'chapters' | 'memories' | 'letters' | 'about' | 'editor' | 'arcade' | 'missions' | 'lock'
  | 'keyFound' | 'calendar' | 'letter' | 'openLetter' | 'game:memory' | 'game:puzzle' | 'game:hearts' | 'game:hidden'
  | 'hiddenWin' | 'confirmNew' | 'confirmReset';

export interface DialogueState {
  queue: DialogueLine[];
  index: number;
  log: { who: Who; text: string }[];
  onDone?: () => void;
  chapter?: ChapterId;
  hold: boolean;
}
export interface ActorState { visible: boolean; x: number; z: number; y: number; pose: Pose }
export interface HiddenItem { type: 'star' | 'heart' | 'flower'; spot: number; found: boolean }

export interface GameState {
  config: GameConfig;
  save: SaveData;
  hasSave: boolean;
  scene: SceneId;
  fading: boolean;
  busy: boolean;
  modal: Modal;
  toast: string | null;
  dialogue: DialogueState | null;
  stage: { boy: ExprId; inda: ExprId; talking: Who | null };
  boy: ActorState;
  indaPose: Pose;
  indaY: number;
  fxAnim: { boy: Anim; inda: Anim };
  cam: string;
  camSnap: number;
  bloom: number;
  glow: number;
  lamps: number;
  hover: string | null;
  markerId: string | null;
  hidden: { active: boolean; items: HiddenItem[] };
  finalPhase: 'none' | 'cinema' | 'title' | 'free';
  letterIntro: boolean;
  letterWhich: 'main' | 'secret';
  memTab: 'surat' | 'album' | 'musik' | 'catatan';
  installEvt: (Event & { prompt?: () => Promise<void> }) | null;
  patchSave: (fn: (s: SaveData) => SaveData) => void;
  showToast: (m: string, ms?: number) => void;
  openModal: (m: Modal) => void;
  closeModal: () => void;
  refreshMission: () => void;
  setConfig: (c: GameConfig) => void;
}

let toastTimer: number | undefined;
const initial = loadSave();

export const useGame = create<GameState>((set, get) => ({
  config: buildConfig(loadOverrides()),
  save: initial ?? defaultSave(),
  hasSave: !!initial?.started,
  scene: 'menu',
  fading: false,
  busy: false,
  modal: null,
  toast: null,
  dialogue: null,
  stage: { boy: 'lembut', inda: 'lembut', talking: null },
  boy: { visible: false, x: -6, z: 2, y: 0, pose: 'stand' },
  indaPose: 'stand',
  indaY: 0,
  fxAnim: { boy: null, inda: null },
  cam: 'invite',
  camSnap: 0,
  bloom: initial?.chapters.c2 ? 1 : 0,
  glow: initial?.chapters.c5 ? 1 : 0,
  lamps: 0,
  hover: null,
  markerId: null,
  hidden: { active: false, items: [] },
  finalPhase: 'none',
  letterIntro: false,
  letterWhich: 'main',
  memTab: 'surat',
  installEvt: null,
  patchSave: (fn) => {
    const next = fn(get().save);
    writeSave(next);
    set({ save: next, hasSave: next.started });
    get().refreshMission();
  },
  showToast: (m, ms = 3200) => {
    set({ toast: m });
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => set({ toast: null }), ms);
  },
  openModal: (m) => set({ modal: m, hover: null }),
  closeModal: () => set({ modal: null }),
  refreshMission: () => {
    const s = get();
    const m = currentMission(s.save, s.scene);
    set({ markerId: s.dialogue ? null : (m?.target ?? null) });
  },
  setConfig: (c) => set({ config: c })
}));
