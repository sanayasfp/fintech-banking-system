import { Decimal } from "decimal.js";

export class Money {
    private readonly value: Decimal;

    private constructor(value: number | string | Decimal) {
        this.value = new Decimal(value);
    }

    public static from(value: number | string): Money {
        try {
            const decimalValue = new Decimal(value);
            if (decimalValue.isNaN()) {
                throw new Error("Invalid number provided to create Money.");
            }
            return new Money(decimalValue);
        } catch {
            throw new Error(`Could not create Money from value: ${value}`);
        }
    }

    public static get ZERO(): Money {
        return this.from(0);
    }

    public add(other: Money): Money {
        return new Money(this.value.plus(other.value));
    }

    public subtract(other: Money): Money {
        return new Money(this.value.minus(other.value));
    }

    public isLessThan(other: Money): boolean {
        return this.value.lessThan(other.value);
    }

    public isZero(): boolean {
        return this.value.isZero();
    }

    public isPositive(): boolean {
        return this.value.isPositive();
    }

    public isNegative(): boolean {
        return this.value.isNegative();
    }

    public negated(): Money {
        return new Money(this.value.negated());
    }

    public toFixed(decimalPlaces: number): string {
        return this.value.toFixed(decimalPlaces);
    }

    public equals(other: Money): boolean {
        if (!(other instanceof Money)) {
            return false;
        }

        return this.value.equals(other.value);
    }
}
