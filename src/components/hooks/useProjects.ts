// src/hooks/useProjects.ts

import { Project, VNode } from "@/types/htmlBuilder.types";
import { useState, useCallback } from "react";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectName, setCurrentProjectName] = useState<string>(
    "Proyecto sin título",
  );

  /**
   * Guarda o actualiza un proyecto.
   * Si ya existe un proyecto con el mismo nombre, lo sobrescribe.
   */
  const saveProject = useCallback((name: string, tree: VNode) => {
    const project: Project = {
      name,
      tree: structuredClone(tree),
      timestamp: Date.now(),
      version: "1.0",
    };

    setProjects((prev) => {
      const existingIndex = prev.findIndex((p) => p.name === name);
      if (existingIndex >= 0) {
        // Actualizar existente
        const updated = [...prev];
        updated[existingIndex] = project;
        return updated;
      } else {
        // Agregar nuevo
        return [...prev, project];
      }
    });

    setCurrentProjectName(name);
  }, []);

  /**
   * Carga un proyecto por su nombre.
   * @returns El proyecto cargado o `null` si no se encuentra.
   */
  const loadProject = useCallback(
    (name: string): Project | null => {
      const project = projects.find((p) => p.name === name);
      if (project) {
        setCurrentProjectName(name);
      }
      return project || null;
    },
    [projects],
  );

  /**
   * Elimina un proyecto por nombre.
   */
  const deleteProject = useCallback(
    (name: string) => {
      setProjects((prev) => prev.filter((p) => p.name !== name));
      if (currentProjectName === name) {
        setCurrentProjectName("Proyecto sin título");
      }
    },
    [currentProjectName],
  );

  /**
   * Obtiene todos los proyectos guardados.
   */
  const getProjects = useCallback(() => {
    return projects;
  }, [projects]);

  return {
    projects,
    currentProjectName,
    setCurrentProjectName,
    saveProject,
    loadProject,
    deleteProject,
    getProjects,
  };
};
