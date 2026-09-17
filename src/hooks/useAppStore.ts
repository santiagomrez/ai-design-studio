import { useEffect, useSyncExternalStore } from "react";
import {
  getServerState,
  getState,
  hydrateStore,
  subscribe,
  type AppState,
} from "@/lib/store";

export function useAppStore<T>(selector: (state: AppState) => T): T {
  useEffect(() => {
    hydrateStore();
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => selector(getServerState()),
  );
}

export function useProjects() {
  return useAppStore((s) => s.projects);
}

export function useProject(projectId: string | undefined) {
  return useAppStore((s) => s.projects.find((p) => p.id === projectId));
}

export function useActivity() {
  return useAppStore((s) => s.activity);
}

export function useAssets() {
  return useAppStore((s) => s.assets);
}

export function useUploadedReferences() {
  return useAppStore((s) => s.uploadedReferences);
}
