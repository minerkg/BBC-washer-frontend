import { TimeSlot } from "./timeSlot.model";
import { Washer } from "./washer.mode";

export interface BookableUnitDTO {
    id: number;
    washer: Washer;
    timeSlot: TimeSlot;
    available: boolean;
}