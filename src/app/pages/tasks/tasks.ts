import { Component, computed, effect, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { I18n } from '../../i18n';
import { RichTextDirective } from './rich-text.directive';

export type NewItemType = 'task' | 'note';

export interface TaskNode {
  id: string;
  title: string;
  done: boolean;
  isNote: boolean;
  text: string;
  date: string;
  content: TaskNode[];
}

interface FlatEntry {
  readonly node: TaskNode;
  readonly depth: number;
}

interface CardView {
  readonly card: TaskNode;
  readonly entries: FlatEntry[];
  readonly doneCount: number;
  readonly totalCount: number;
}

interface DayCell {
  readonly iso: string;
  readonly day: number;
  readonly inMonth: boolean;
  readonly isToday: boolean;
  readonly isSelected: boolean;
}

export const STORAGE_KEY = 'daycove-tasks';

@Component({
  selector: 'app-tasks',
  imports: [LucideAngularModule, RichTextDirective],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class TasksPage {
  protected readonly i18n = inject(I18n);

  protected readonly newType = signal<NewItemType>('task');
  protected readonly newInput = signal('');
  protected readonly addingParent = signal<string | null>(null);
  protected readonly addingInput = signal('');
  protected readonly dateEditing = signal<string | null>(null);
  protected readonly pickerMonth = signal<Date>(TasksPage.startOfMonth(new Date()));

  protected readonly cards = signal<TaskNode[]>(TasksPage.load());

  protected readonly sortedCards = computed(() => TasksPage.sortContent(this.cards()));

  protected readonly cardViews = computed(() =>
    this.sortedCards().map((card) => {
      const entries: FlatEntry[] = [];
      TasksPage.flatten(card.content, 1, entries);
      let doneCount = 0;
      for (const entry of entries) {
        if (entry.node.done) {
          doneCount++;
        }
      }
      return { card, entries, doneCount, totalCount: entries.length };
    }),
  );

  constructor() {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sortedCards())));
  }

  protected preventEditorBlur(event: MouseEvent): void {
    event.preventDefault();
  }

  protected addNew(): void {
    const title = this.newInput().trim();
    if (!title) {
      return;
    }
    this.cards.update((list) => [...list, TasksPage.createNode(title, this.newType())]);
    this.newInput.set('');
  }

  protected toggle(id: string): void {
    this.cards.update((list) => TasksPage.propagateDone(TasksPage.mapNode(list, id, (node) => ({ ...node, done: !node.done }))));
  }

  protected beginAdd(parent: string): void {
    this.addingParent.set(parent);
    this.addingInput.set('');
  }

  protected cancelAdd(): void {
    this.addingParent.set(null);
  }

  protected addContent(): void {
    const parent = this.addingParent();
    const title = this.addingInput().trim();
    if (!parent || !title) {
      this.cancelAdd();
      return;
    }
    this.cards.update((list) => TasksPage.addChild(list, parent, TasksPage.createNode(title, 'task')));
    this.cancelAdd();
  }

  protected setNoteText(id: string, text: string): void {
    this.cards.update((list) => TasksPage.mapNode(list, id, (node) => ({ ...node, text })));
  }

  protected toggleDateEditor(id: string): void {
    const opening = this.dateEditing() !== id;
    this.dateEditing.set(opening ? id : null);
    if (opening) {
      const node = TasksPage.findNode(this.cards(), id);
      this.pickerMonth.set(node?.date ? new Date(`${node.date}T00:00:00`) : new Date());
    }
  }

  protected pickerDays = computed(() => this.buildPickerDays(this.pickerMonth(), this.editingDateValue()));
  protected pickerMonthLabel = computed(() =>
    TasksPage.capitalize(
      new Intl.DateTimeFormat(this.i18n.localeTag(), { month: 'long', year: 'numeric' }).format(this.pickerMonth()),
    ),
  );
  protected weekdayLabels = computed(() => TasksPage.buildWeekdayLabels(this.i18n.localeTag()));

  protected shiftPickerMonth(offset: number): void {
    this.pickerMonth.update((m) => {
      const next = new Date(m);
      next.setMonth(next.getMonth() + offset);
      return next;
    });
  }

  private editingDateValue(): string | null {
    const id = this.dateEditing();
    if (!id) {
      return null;
    }
    return TasksPage.findNode(this.cards(), id)?.date ?? null;
  }

  private buildPickerDays(month: Date, selectedDate: string | null): DayCell[] {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = TasksPage.addDays(first, -((first.getDay() + 6) % 7));
    const today = new Date();
    const todayIso = TasksPage.toISODate(today);
    return Array.from({ length: 42 }, (_, i) => {
      const day = TasksPage.addDays(start, i);
      const iso = TasksPage.toISODate(day);
      return {
        iso,
        day: day.getDate(),
        inMonth: day.getMonth() === month.getMonth(),
        isToday: iso === todayIso,
        isSelected: iso === selectedDate,
      };
    });
  }

  protected setDate(id: string, value: string): void {
    this.cards.update((list) => TasksPage.mapNode(list, id, (node) => ({ ...node, date: value })));
    this.dateEditing.set(null);
  }

  protected formatDate(value: string): string {
    if (!value) {
      return '';
    }
    return new Intl.DateTimeFormat(this.i18n.localeTag(), { day: 'numeric', month: 'short' }).format(
      new Date(`${value}T00:00:00`),
    );
  }

  protected remove(id: string): void {
    this.cards.update((list) => TasksPage.removeNode(list, id));
  }

  private static addDays(date: Date, jours: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + jours);
    return result;
  }

  private static startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private static toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private static capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private static buildWeekdayLabels(localeTag: string): string[] {
    const fmt = new Intl.DateTimeFormat(localeTag, { weekday: 'short' });
    const monday = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (_, i) => fmt.format(TasksPage.addDays(monday, i)).replace('.', ''));
  }

  private static findNode<T extends TaskNode>(nodes: readonly T[], id: string): T | undefined {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      const found = TasksPage.findNode<T>(node.content as T[], id);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  private static createNode(title: string, type: NewItemType): TaskNode {
    return {
      id: crypto.randomUUID(),
      title,
      done: false,
      isNote: type === 'note',
      text: '',
      date: '',
      content: [],
    };
  }

  private static propagateDone(nodes: TaskNode[]): TaskNode[] {
    return nodes.map((node) => {
      const content = TasksPage.propagateDone(node.content);
      const done = content.length > 0 ? content.every((child) => child.done) : node.done;
      return { ...node, content, done };
    });
  }

  private static sortContent(nodes: TaskNode[]): TaskNode[] {
    const pending = nodes.filter((node) => !node.done).map((node) => ({ ...node, content: TasksPage.sortContent(node.content) }));
    const done = nodes.filter((node) => node.done).map((node) => ({ ...node, content: TasksPage.sortContent(node.content) }));
    return [...pending, ...done];
  }

  private static flatten(nodes: readonly TaskNode[], depth = 0, out: FlatEntry[] = []): FlatEntry[] {
    for (const node of nodes) {
      out.push({ node, depth });
      if (node.content.length > 0) {
        TasksPage.flatten(node.content, depth + 1, out);
      }
    }
    return out;
  }

  private static mapNode(nodes: TaskNode[], id: string, fn: (node: TaskNode) => TaskNode): TaskNode[] {
    return nodes.map((node) => {
      if (node.id === id) {
        return fn(node);
      }
      if (node.content.length > 0) {
        return { ...node, content: TasksPage.mapNode(node.content, id, fn) };
      }
      return node;
    });
  }

  private static addChild(nodes: TaskNode[], id: string, child: TaskNode): TaskNode[] {
    return TasksPage.mapNode(nodes, id, (node) => ({ ...node, content: [...node.content, child] }));
  }

  private static removeNode(nodes: TaskNode[], id: string): TaskNode[] {
    return nodes.flatMap((node) => {
      if (node.id === id) {
        return [];
      }
      return [{ ...node, content: TasksPage.removeNode(node.content, id) }];
    });
  }

  static load(): TaskNode[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? TasksPage.propagateDone(TasksPage.normalize(parsed)) : [];
    } catch {
      return [];
    }
  }

  private static normalize(nodes: unknown): TaskNode[] {
    if (!Array.isArray(nodes)) {
      return [];
    }
    return nodes
      .map((node) => {
        const item = node as {
          id?: unknown;
          title?: unknown;
          text?: unknown;
          done?: unknown;
          isNote?: unknown;
          date?: unknown;
          content?: unknown;
          children?: unknown;
        };
        const title = typeof item.title === 'string' ? item.title : typeof item.text === 'string' ? item.text : '';
        const isNote = item.isNote === true;
        return {
          id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
          title,
          done: item.done === true,
          isNote,
          text: isNote ? (typeof item.text === 'string' ? item.text : '') : '',
          date: typeof item.date === 'string' ? item.date : '',
          content: isNote
            ? []
            : TasksPage.normalize(
                Array.isArray(item.content) ? item.content : Array.isArray(item.children) ? item.children : [],
              ),
        };
      })
      .filter((node) => node.title.length > 0);
  }
}