import { JournalEntry } from "../types/JournalEntry";
import { Transaction } from "../types/Transaction";

const JOURNAL_STORAGE_KEY = "journal_entries";
const TRANSACTION_STORAGE_KEY = "transactions";

export const StorageService = {
  // Journal methods
  getJournalEntries(): JournalEntry[] {
    const data = localStorage.getItem(JOURNAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveJournalEntries(entries: JournalEntry[]) {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
  },
  addJournalEntry(entry: JournalEntry) {
    const entries = this.getJournalEntries();
    entries.push(entry);
    this.saveJournalEntries(entries);
  },
  updateJournalEntry(updatedEntry: JournalEntry) {
    const entries = this.getJournalEntries().map(entry =>
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    this.saveJournalEntries(entries);
  },
  deleteJournalEntry(id: string) {
    const entries = this.getJournalEntries().filter(entry => entry.id !== id);
    this.saveJournalEntries(entries);
  },

  // Transaction methods
  getTransactions(): Transaction[] {
    const data = localStorage.getItem(TRANSACTION_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveTransactions(transactions: Transaction[]) {
    localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transactions));
  },
  addTransaction(transaction: Transaction) {
    const transactions = this.getTransactions();
    transactions.push(transaction);
    this.saveTransactions(transactions);
  },
  updateTransaction(updatedTransaction: Transaction) {
    const transactions = this.getTransactions().map(tx =>
      tx.id === updatedTransaction.id ? updatedTransaction : tx
    );
    this.saveTransactions(transactions);
  },
  deleteTransaction(id: string) {
    const transactions = this.getTransactions().filter(tx => tx.id !== id);
    this.saveTransactions(transactions);
  },
};
