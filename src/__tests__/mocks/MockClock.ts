import type { IClock } from "../../domain/services/IClock";

export class MockClock implements IClock {
    private date: Date;

    constructor(initialDate: Date = new Date()) {
        this.date = initialDate;
    }

    public now(): Date {
        return this.date;
    }

    public setDate(newDate: Date): void {
        if (newDate < this.date) {
            throw new Error("Cannot set clock to a past date. Time can only move forward.");
        }
        this.date = newDate;
    }
}
