import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ThozhiLocalService {
    id: bigint;
    name: string;
    type: string;
    district: string;
    address: string;
    phone: string;
}
export interface ThozhiWorkoutEntry {
    id: bigint;
    title: string;
    duration: string;
    difficulty: string;
    description: string;
    category: string;
}
export interface ThozhiDietEntry {
    id: bigint;
    title: string;
    createdBy?: Principal;
    description: string;
    isPreloaded: boolean;
    category: string;
}
export interface ThozhiFirstAidEntry {
    id: bigint;
    createdBy?: Principal;
    isPreloaded: boolean;
    steps: Array<string>;
    situation: string;
}
export interface ThozhiUserProfile {
    age: bigint;
    name: string;
    healthCondition: string;
}
export interface ThozhiContact {
    id: bigint;
    relation: string;
    userId: Principal;
    name: string;
    isDefault: boolean;
    phone: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addContact(name: string, phone: string, relation: string): Promise<bigint>;
    addDietEntry(category: string, title: string, description: string): Promise<bigint>;
    addFirstAidEntry(situation: string, steps: Array<string>): Promise<bigint>;
    addLocalService(name: string, type: string, address: string, phone: string, district: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createDietEntry(category: string, title: string, description: string, isPreloaded: boolean, createdBy: Principal | null): Promise<bigint>;
    createFirstAidEntry(situation: string, steps: Array<string>, isPreloaded: boolean, createdBy: Principal | null): Promise<bigint>;
    createLocalService(name: string, type: string, address: string, phone: string, district: string): Promise<bigint>;
    createWorkoutEntry(category: string, title: string, description: string, duration: string, difficulty: string): Promise<bigint>;
    getCallerUserProfile(): Promise<ThozhiUserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContacts(): Promise<Array<ThozhiContact>>;
    getDietEntriesByCategory(category: string): Promise<Array<ThozhiDietEntry>>;
    getFirstAidEntries(): Promise<Array<ThozhiFirstAidEntry>>;
    getServicesByType(type: string): Promise<Array<ThozhiLocalService>>;
    getUserProfile(user: Principal): Promise<ThozhiUserProfile | null>;
    getWorkoutsByCategory(category: string): Promise<Array<ThozhiWorkoutEntry>>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: ThozhiUserProfile): Promise<void>;
    updateUserProfile(name: string, age: bigint, healthCondition: string): Promise<void>;
}
