"use server";

import type {
  AdminThesis,
  CreateThesisRequest,
  UpdateThesisRequest,
  PremadeThesis,
} from "@/types/admin";
import { simulateDelay, generateId, now } from "@/lib/admin/mock-utils";
import { mockTheses, mockPremadeThesesPool } from "@/lib/admin/mock-data";

// In-memory store for mutations
let theses = [...mockTheses];

export async function mockGetTheses(
  electionId: number,
): Promise<AdminThesis[]> {
  await simulateDelay(300);
  return theses
    .filter((t) => t.electionId === electionId)
    .sort((a, b) => a.order - b.order);
}

export async function mockGetThesis(id: string): Promise<AdminThesis | null> {
  await simulateDelay(200);
  return theses.find((t) => t.id === id) || null;
}

export async function mockCreateThesis(
  data: CreateThesisRequest,
): Promise<AdminThesis> {
  await simulateDelay(400);

  const electionTheses = theses.filter((t) => t.electionId === data.electionId);
  const maxOrder = Math.max(0, ...electionTheses.map((t) => t.order));

  const newThesis: AdminThesis = {
    ...data,
    id: generateId(),
    order: maxOrder + 1,
    isLocked: false,
    createdAt: now(),
    updatedAt: now(),
  };

  theses = [...theses, newThesis];
  return newThesis;
}

export async function mockUpdateThesis(
  id: string,
  data: UpdateThesisRequest,
): Promise<AdminThesis | null> {
  await simulateDelay(300);

  const index = theses.findIndex((t) => t.id === id);
  if (index === -1) return null;

  // Check if thesis is locked
  if (theses[index].isLocked) {
    throw new Error("Cannot update a locked thesis");
  }

  const updated: AdminThesis = {
    ...theses[index],
    ...data,
    updatedAt: now(),
  };

  theses = [...theses.slice(0, index), updated, ...theses.slice(index + 1)];
  return updated;
}

export async function mockDeleteThesis(id: string): Promise<boolean> {
  await simulateDelay(200);

  const index = theses.findIndex((t) => t.id === id);
  if (index === -1) return false;

  // Check if thesis is locked
  if (theses[index].isLocked) {
    throw new Error("Cannot delete a locked thesis");
  }

  theses = [...theses.slice(0, index), ...theses.slice(index + 1)];
  return true;
}

export async function mockReorderTheses(
  electionId: number,
  orderedIds: string[],
): Promise<boolean> {
  await simulateDelay(300);

  // Update order for each thesis
  orderedIds.forEach((id, index) => {
    const thesisIndex = theses.findIndex(
      (t) => t.id === id && t.electionId === electionId,
    );
    if (thesisIndex !== -1) {
      theses[thesisIndex] = {
        ...theses[thesisIndex],
        order: index + 1,
        updatedAt: now(),
      };
    }
  });

  return true;
}

export async function mockLockTheses(electionId: number): Promise<boolean> {
  await simulateDelay(300);

  theses = theses.map((t) =>
    t.electionId === electionId
      ? { ...t, isLocked: true, updatedAt: now() }
      : t,
  );

  return true;
}

export async function mockGetPremadeThesesPool(
  category?: string,
): Promise<PremadeThesis[]> {
  await simulateDelay(400);

  if (category) {
    return mockPremadeThesesPool.filter((t) => t.category === category);
  }

  return mockPremadeThesesPool;
}

export async function mockGetThesisCategories(): Promise<string[]> {
  await simulateDelay(200);

  const categories = new Set(mockPremadeThesesPool.map((t) => t.category));
  return Array.from(categories);
}

export async function mockImportFromPool(
  electionId: number,
  thesisIds: string[],
): Promise<AdminThesis[]> {
  await simulateDelay(500);

  const electionTheses = theses.filter((t) => t.electionId === electionId);
  let maxOrder = Math.max(0, ...electionTheses.map((t) => t.order));

  const newTheses: AdminThesis[] = [];

  for (const poolId of thesisIds) {
    const poolThesis = mockPremadeThesesPool.find((t) => t.id === poolId);
    if (poolThesis) {
      maxOrder += 1;
      const newThesis: AdminThesis = {
        id: generateId(),
        electionId,
        order: maxOrder,
        category: poolThesis.category,
        translations: poolThesis.translations.map((t) => ({
          ...t,
          id: generateId(),
        })),
        explanations: [],
        isLocked: false,
        createdAt: now(),
        updatedAt: now(),
        derivedFromPoolId: poolId,
      };
      newTheses.push(newThesis);
    }
  }

  theses = [...theses, ...newTheses];
  return newTheses;
}
