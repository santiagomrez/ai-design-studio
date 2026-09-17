import { useCallback, useEffect, useRef, useState } from "react";
import { updateProject } from "@/lib/store";
import type { Design, DesignElement, DesignQA, Project } from "@/types/design";

export type SaveStatus = "saved" | "saving";

/**
 * Owns the editable design state: selection, history and autosave.
 * The design itself always stays structured JSON.
 */
export function useDesignEditor(project: Project) {
  const [design, setDesignState] = useState<Design>(project.design);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [qa, setQa] = useState<DesignQA | undefined>(project.qa);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const history = useRef<Design[]>([]);
  const isFirstRender = useRef(true);

  // Autosave to the store (localStorage) shortly after every change.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      updateProject(project.id, { design, name: design.name, qa });
      setSaveStatus("saved");
    }, 500);
    return () => clearTimeout(timer);
  }, [design, qa, project.id]);

  const commit = useCallback((next: Design, recordHistory = true) => {
    setDesignState((current) => {
      if (recordHistory) {
        history.current = [...history.current.slice(-19), current];
      }
      return { ...next, updatedAt: new Date().toISOString() };
    });
  }, []);

  const updateElement = useCallback(
    (elementId: string, patch: Partial<DesignElement>, recordHistory = false) => {
      setDesignState((current) => {
        if (recordHistory) history.current = [...history.current.slice(-19), current];
        return {
          ...current,
          updatedAt: new Date().toISOString(),
          elements: current.elements.map((el) =>
            el.id === elementId ? ({ ...el, ...patch } as DesignElement) : el,
          ),
        };
      });
    },
    [],
  );

  const removeElement = useCallback((elementId: string) => {
    setDesignState((current) => {
      history.current = [...history.current.slice(-19), current];
      return {
        ...current,
        elements: current.elements.filter((el) => el.id !== elementId),
        updatedAt: new Date().toISOString(),
      };
    });
    setSelectedId((id) => (id === elementId ? null : id));
  }, []);

  const addElement = useCallback((element: DesignElement) => {
    setDesignState((current) => {
      history.current = [...history.current.slice(-19), current];
      return {
        ...current,
        elements: [...current.elements, element],
        updatedAt: new Date().toISOString(),
      };
    });
    setSelectedId(element.id);
  }, []);

  const reorderElement = useCallback((elementId: string, direction: -1 | 1) => {
    setDesignState((current) => {
      const ordered = [...current.elements].sort((a, b) => a.zIndex - b.zIndex);
      const index = ordered.findIndex((el) => el.id === elementId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= ordered.length) return current;
      const swapped = [...ordered];
      [swapped[index], swapped[target]] = [swapped[target], swapped[index]];
      history.current = [...history.current.slice(-19), current];
      return {
        ...current,
        elements: swapped.map((el, i) => ({ ...el, zIndex: (i + 1) * 10 })),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const undo = useCallback(() => {
    const previous = history.current.pop();
    if (previous) setDesignState(previous);
    return Boolean(previous);
  }, []);

  const canUndo = history.current.length > 0;

  const selectedElement = design.elements.find((el) => el.id === selectedId) ?? null;

  return {
    design,
    commit,
    updateElement,
    removeElement,
    addElement,
    reorderElement,
    undo,
    canUndo,
    selectedId,
    setSelectedId,
    selectedElement,
    qa,
    setQa,
    saveStatus,
  };
}
