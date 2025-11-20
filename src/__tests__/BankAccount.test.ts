import { BankAccountImpl } from "../domain/entities/BankAccountImpl";
import { InsufficientFundsError } from "../domain/errors/InsufficientFundsError";
import { InvalidAmountError } from "../domain/errors/InvalidAmountError";
import { InMemoryAccountRepository } from "../domain/repositories/AccountRepository";
import { Money } from "../domain/value-objects/Money";
import { ConsoleStatementPrinter } from "../presentation/printers/ConsoleStatementPrinter";
import { MockClock } from "./mocks/MockClock";

describe("BankAccount", () => {
    let repository: InMemoryAccountRepository;
    let clock: MockClock;
    let printer: ConsoleStatementPrinter;
    let account: BankAccountImpl;
    let tableSpy: jest.SpyInstance;

    beforeEach(() => {
        repository = new InMemoryAccountRepository();
        clock = new MockClock(new Date("2024-01-01"));
        printer = new ConsoleStatementPrinter();
        account = new BankAccountImpl(repository, clock, printer);
        tableSpy = jest.spyOn(console, "table").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("deposit", () => {
        it("should accept positive amounts", () => {
            expect(() => account.deposit(Money.from(1000))).not.toThrow();
        });

        it("should reject zero amount with explicit error message", () => {
            expect(() => account.deposit(Money.from(0))).toThrow(InvalidAmountError);
        });

        it("should reject negative amounts with explicit error message", () => {
            expect(() => account.deposit(Money.from(-100))).toThrow(InvalidAmountError);
        });

        it("should handle decimal amounts correctly", () => {
            account.deposit(Money.from("1000.50"));
            account.deposit(Money.from("500.25"));

            const currentBalance = repository.getCurrentBalance();
            const expectedBalance = Money.from("1500.75");

            expect(currentBalance.equals(expectedBalance)).toBe(true);
        });

        it("should handle very large amounts", () => {
            const largeAmount = Number.MAX_SAFE_INTEGER;
            expect(() => account.deposit(Money.from(largeAmount))).not.toThrow();
            expect(repository.getCurrentBalance().equals(Money.from(largeAmount))).toBe(true);
        });
    });

    describe("withdraw", () => {
        it("should accept withdrawal when sufficient balance", () => {
            account.deposit(Money.from(1000));
            expect(() => account.withdraw(Money.from(500))).not.toThrow();
        });

        it("should reject zero amount with explicit error message", () => {
            expect(() => account.withdraw(Money.from(0))).toThrow(InvalidAmountError);
        });

        it("should reject negative amounts with explicit error message", () => {
            expect(() => account.withdraw(Money.from(-100))).toThrow(InvalidAmountError);
        });

        it("should reject withdrawal exceeding balance with explicit error message", () => {
            account.deposit(Money.from(1000));
            expect(() => account.withdraw(Money.from(1500))).toThrow(InsufficientFundsError);
        });

        it("should reject withdrawal when balance is zero", () => {
            expect(() => account.withdraw(Money.from(100))).toThrow(InsufficientFundsError);
        });

        it("should handle decimal amounts correctly", () => {
            account.deposit(Money.from("1000.75"));
            account.withdraw(Money.from("500.25"));

            const currentBalance = repository.getCurrentBalance();
            const expectedBalance = Money.from("500.50");

            expect(currentBalance.equals(expectedBalance)).toBe(true);
        });

        it("should allow withdrawing exact balance amount", () => {
            account.deposit(Money.from(1000));
            expect(() => account.withdraw(Money.from(1000))).not.toThrow();
            expect(repository.getCurrentBalance().equals(Money.ZERO)).toBe(true);
        });
    });

    describe("printStatement", () => {
        it("should print empty statement for new account", () => {
            account.printStatement();

            expect(tableSpy).toHaveBeenCalledTimes(1);
            expect(tableSpy).toHaveBeenCalledWith([
                {
                    Date: "",
                    Amount: "",
                    Balance: "",
                },
            ]);
        });

        it("should print statement with single deposit", () => {
            const dateStr = "2024-01-01";

            clock.setDate(new Date(dateStr));
            account.deposit(Money.from(1000));
            account.printStatement();

            expect(tableSpy).toHaveBeenCalledTimes(1);
            expect(tableSpy).toHaveBeenCalledWith([
                {
                    Date: dateStr,
                    Amount: "1000.00",
                    Balance: "1000.00",
                },
            ]);
        });

        it("should calculate the cumulative balance correctly across multiple transactions", () => {
            account.deposit(Money.from(2000));
            expect(repository.getCurrentBalance().equals(Money.from(2000))).toBe(true);

            account.deposit(Money.from(1000));
            expect(repository.getCurrentBalance().equals(Money.from(3000))).toBe(true);

            account.withdraw(Money.from(500));
            expect(repository.getCurrentBalance().equals(Money.from(2500))).toBe(true);
        });

        it("should sort transactions in reverse chronological order (most recent first)", () => {
            clock.setDate(new Date("2024-01-10"));
            account.deposit(Money.from(1000));
            clock.setDate(new Date("2024-01-13"));
            account.deposit(Money.from(2000));
            clock.setDate(new Date("2024-01-14"));
            account.withdraw(Money.from(500));

            account.printStatement();

            const payload = tableSpy.mock.calls[0][0];
            expect(payload[0].Date).toBe("2024-01-14");
            expect(payload[1].Date).toBe("2024-01-13");
            expect(payload[2].Date).toBe("2024-01-10");
        });
    });

    describe("complex scenarios", () => {
        it("should print statement with multiple transactions", () => {
            clock.setDate(new Date("2024-01-10"));
            account.deposit(Money.from(1000));
            clock.setDate(new Date("2024-01-13"));
            account.deposit(Money.from(2000));
            clock.setDate(new Date("2024-01-14"));
            account.withdraw(Money.from(500));

            account.printStatement();

            expect(tableSpy).toHaveBeenCalledTimes(1);
            expect(tableSpy).toHaveBeenCalledWith([
                { Date: "2024-01-14", Amount: "-500.00", Balance: "2500.00" },
                { Date: "2024-01-13", Amount: "2000.00", Balance: "3000.00" },
                { Date: "2024-01-10", Amount: "1000.00", Balance: "1000.00" },
            ]);
        });
    });

    describe("edge cases", () => {
        it("should maintain immutable transaction records", () => {
            clock.setDate(new Date("2024-01-01"));
            account.deposit(Money.from(1000));

            const transactions = repository.getAllTransactions();
            const firstTransaction = transactions[0]!;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect(() => ((firstTransaction as any).amount = Money.from(500))).toThrow();
        });

        it("should handle multiple transactions on the same date", () => {
            const sameDate = new Date("2024-01-15");
            clock.setDate(sameDate);

            account.deposit(Money.from(1000));
            account.deposit(Money.from(500));
            account.withdraw(Money.from(200));

            const transactions = repository.getAllTransactions();
            expect(transactions.length).toBe(3);
            expect(transactions.every((t) => t.date.toISOString() === sameDate.toISOString())).toBe(
                true,
            );
        });

        it("should handle balance returning to zero", () => {
            account.deposit(Money.from(1000));
            account.withdraw(Money.from(500));
            account.withdraw(Money.from(500));

            expect(repository.getCurrentBalance().equals(Money.ZERO)).toBe(true);
        });

        it("should maintain transaction traceability with metadata", () => {
            clock.setDate(new Date("2024-01-10"));
            account.deposit(Money.from(1000));

            const transactions = repository.getAllTransactions();
            const transaction = transactions[0]!;

            expect(transaction).toHaveProperty("date");
            expect(transaction).toHaveProperty("amount");
            expect(transaction.date).toBeInstanceOf(Date);
            expect(transaction.amount).toBeInstanceOf(Money);
        });

        it("should display negative amounts with minus sign in statement", () => {
            clock.setDate(new Date("2024-01-10"));
            account.deposit(Money.from(1000));
            clock.setDate(new Date("2024-01-11"));
            account.withdraw(Money.from(500));

            account.printStatement();

            const payload = tableSpy.mock.calls[0][0];
            expect(payload[0].Amount).toContain("-");
            expect(payload[0].Amount).toBe("-500.00");
        });

        it("should format decimal amounts consistently in statement", () => {
            clock.setDate(new Date("2024-01-10"));
            account.deposit(Money.from("1000.5"));

            account.printStatement();

            const payload = tableSpy.mock.calls[0][0];
            expect(payload[0].Amount).toMatch(/^\d+\.\d{2}$/);
            expect(payload[0].Balance).toMatch(/^\d+\.\d{2}$/);
        });
    });

    describe("repository isolation", () => {
        it("should not interfere with other account instances", () => {
            const repository2 = new InMemoryAccountRepository();
            const account2 = new BankAccountImpl(repository2, clock, printer);

            account.deposit(Money.from(1000));
            account2.deposit(Money.from(500));

            expect(repository.getCurrentBalance().equals(Money.from(1000))).toBe(true);
            expect(repository2.getCurrentBalance().equals(Money.from(500))).toBe(true);
        });
    });
});
