/**
 * Tiny localStorage-backed application store.
 *
 * Deliberately dependency free and framework agnostic so it can be replaced by
 * a real backend later without touching component code (components only use
 * the hooks in `src/hooks/useAppStore.ts`).
 */

import type {
  ActivityEntry,
  ActivityKind,
  AssetItem,
  Project,
  ProjectStatus,
  ReferenceImage,
} from "@/types/design";

const STORAGE_KEY = "design-ai:state:v1";

export interface AppState {
  projects: Project[];
  activity: ActivityEntry[];
  assets: AssetItem[];
  /** References uploaded by the team (demo library lives in src/data). */
  uploadedReferences: ReferenceImage[];
}

const emptyState: AppState = {
  projects: [],
  activity: [],
  assets: [],
  uploadedReferences: [],
};

let state: AppState = emptyState;
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — the prototype keeps working in memory.
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function setState(next: AppState) {
  state = next;
  persist();
  emit();
}

export function hydrateStore() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      state = { ...emptyState, ...parsed };
      emit();
    }
  } catch {
    state = emptyState;
  }
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState(): AppState {
  return state;
}

export function getServerState(): AppState {
  return emptyState;
}

/* -------------------------------------------------------------- mutations */

function id(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function logActivity(kind: ActivityKind, target: string) {
  const entry: ActivityEntry = {
    id: id("act"),
    kind,
    target,
    at: new Date().toISOString(),
  };
  setState({ ...state, activity: [entry, ...state.activity].slice(0, 30) });
}

export function saveProject(project: Project) {
  const existing = state.projects.findIndex((p) => p.id === project.id);
  const projects = [...state.projects];
  if (existing >= 0) projects[existing] = project;
  else projects.unshift(project);
  setState({ ...state, projects });
}

export function updateProject(projectId: string, patch: Partial<Project>) {
  const projects = state.projects.map((p) =>
    p.id === projectId ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p,
  );
  setState({ ...state, projects });
}

export function deleteProject(projectId: string) {
  setState({ ...state, projects: state.projects.filter((p) => p.id !== projectId) });
}

export function setProjectStatus(projectId: string, status: ProjectStatus) {
  updateProject(projectId, { status });
}

export function addAsset(asset: AssetItem) {
  setState({ ...state, assets: [asset, ...state.assets] });
}

export function removeAsset(assetId: string) {
  setState({ ...state, assets: state.assets.filter((a) => a.id !== assetId) });
}

export function addUploadedReference(reference: ReferenceImage) {
  setState({
    ...state,
    uploadedReferences: [reference, ...state.uploadedReferences].slice(0, 12),
  });
}

export function newId(prefix: string) {
  return id(prefix);
}
