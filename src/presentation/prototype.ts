/* eslint-disable no-console */
import { BankAccountPrototype } from '../domain/entities/BankAccountPrototype';
import { InMemoryAccountRepository } from '../domain/repositories/InMemoryAccountRepository';
import { Money } from '../domain/value-objects/Money';
import { SystemClock } from '../infrastructure/providers/SystemClock';
import { ConsoleStatementPrinter } from './printers/ConsoleStatementPrinter';

const repository = new InMemoryAccountRepository();
const clock = new SystemClock();
const printer = new ConsoleStatementPrinter();
const account = new BankAccountPrototype(repository, clock, printer);

console.log('=== Banking System Prototype ===\n');

console.log('Depositing 1000...');
account.deposit(Money.from(1000));
console.log(`Current balance: ${repository.getCurrentBalance().toFixed(2)}\n`);

console.log('Depositing 2000...');
account.deposit(Money.from(2000));
console.log(`Current balance: ${repository.getCurrentBalance().toFixed(2)}\n`);

console.log('Withdrawing 500...');
account.withdraw(Money.from(500));
console.log(`Current balance: ${repository.getCurrentBalance().toFixed(2)}\n`);

console.log('Printing statement:');
account.printStatement();

console.log('\nTrying to withdraw more than balance...');
try {
    account.withdraw(Money.from(5000));
} catch (error) {
    console.log(`Error: ${error instanceof Error ? error.message : String(error)}`);
}

console.log('\nTrying to deposit zero...');
try {
    account.deposit(Money.from(0));
} catch (error) {
    console.log(`Error: ${error instanceof Error ? error.message : String(error)}`);
}

console.log('\nTrying to deposit negative amount...');
try {
    account.deposit(Money.from(-100));
} catch (error) {
    console.log(`Error: ${error instanceof Error ? error.message : String(error)}`);
}

console.log('\n=== End of Prototype ===');
