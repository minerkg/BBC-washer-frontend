import { TimeSlot } from "./timeSlot.model";

export interface Washer {
    id: number;
    name: string;
    capacity: number;
    status: string;
    timeSlot: TimeSlot;
}