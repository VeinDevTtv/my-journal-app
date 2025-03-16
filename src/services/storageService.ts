import { JournalEntry } from "../types/JournalEntry";
import { Transaction } from "../types/Transaction";
import { Goal } from "../types/Goal";

const JOURNAL_STORAGE_KEY = "journal_entries";
const TRANSACTION_STORAGE_KEY = "transactions";
const GOAL_STORAGE_KEY = "goals";

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

  // Goals methods
  getGoals(): Goal[] {
    const data = localStorage.getItem(GOAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveGoals(goals: Goal[]) {
    localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(goals));
  },
  addGoal(goal: Goal) {
    const goals = this.getGoals();
    goals.push(goal);
    this.saveGoals(goals);
  },
  updateGoal(updatedGoal: Goal) {
    const goals = this.getGoals().map(goal =>
      goal.id === updatedGoal.id ? updatedGoal : goal
    );
    this.saveGoals(goals);
  },
  deleteGoal(id: string) {
    const goals = this.getGoals().filter(goal => goal.id !== id);
    this.saveGoals(goals);
  },
};
