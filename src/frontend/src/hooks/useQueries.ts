import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ThozhiContact,
  ThozhiDietEntry,
  ThozhiFirstAidEntry,
  ThozhiLocalService,
  ThozhiUserProfile,
  ThozhiWorkoutEntry,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── Emergency Contacts ──────────────────────────────────────────────────────

export function useContacts() {
  const { actor, isFetching } = useActor();
  return useQuery<ThozhiContact[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContacts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      phone,
      relation,
    }: {
      name: string;
      phone: string;
      relation: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addContact(name, phone, relation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

// ─── Diet ─────────────────────────────────────────────────────────────────────

export function useDietEntries(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ThozhiDietEntry[]>({
    queryKey: ["diet", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDietEntriesByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDietEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      category,
      title,
      description,
    }: {
      category: string;
      title: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createDietEntry(category, title, description, false, null);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["diet", variables.category] });
    },
  });
}

export function useAddDietEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      category,
      title,
      description,
    }: {
      category: string;
      title: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addDietEntry(category, title, description);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["diet", variables.category] });
    },
  });
}

// ─── First Aid ────────────────────────────────────────────────────────────────

export function useFirstAidEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<ThozhiFirstAidEntry[]>({
    queryKey: ["firstaid"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFirstAidEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateFirstAidEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      situation,
      steps,
    }: {
      situation: string;
      steps: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createFirstAidEntry(situation, steps, false, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firstaid"] });
    },
  });
}

export function useAddFirstAidEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      situation,
      steps,
    }: { situation: string; steps: string[] }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addFirstAidEntry(situation, steps);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firstaid"] });
    },
  });
}

// ─── Workouts ─────────────────────────────────────────────────────────────────

export function useWorkouts(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ThozhiWorkoutEntry[]>({
    queryKey: ["workouts", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkoutsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Local Services ───────────────────────────────────────────────────────────

export function useLocalServices(type: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ThozhiLocalService[]>({
    queryKey: ["services", type],
    queryFn: async () => {
      if (!actor) return [];
      if (type === "all") {
        const [hospitals, healthCenters, police] = await Promise.all([
          actor.getServicesByType("hospital"),
          actor.getServicesByType("health_center"),
          actor.getServicesByType("police"),
        ]);
        return [...hospitals, ...healthCenters, ...police].sort((a, b) =>
          a.id < b.id ? -1 : a.id > b.id ? 1 : 0,
        );
      }
      return actor.getServicesByType(type);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddLocalService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      type,
      address,
      phone,
      district,
    }: {
      name: string;
      type: string;
      address: string;
      phone: string;
      district: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addLocalService(name, type, address, phone, district);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["services", variables.type] });
      queryClient.invalidateQueries({ queryKey: ["services", "all"] });
    },
  });
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<ThozhiUserProfile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      age,
      healthCondition,
    }: {
      name: string;
      age: bigint;
      healthCondition: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateUserProfile(name, age, healthCondition);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// ─── Initialize ───────────────────────────────────────────────────────────────

export function useInitialize() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.initialize();
    },
  });
}
