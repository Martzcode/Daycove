import { Component, computed, effect, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { I18n } from '../../i18n';

export type NewItemType = 'task' | 'note';

export interface TaskNode {
  id: string;
  title: string;
  done: boolean;
  isNote: boolean;
  text: string;
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

const STORAGE_KEY = 'daycove-tasks';

@Component({
  selector: 'app-tasks',
  imports: [LucideAngularModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class TasksPage {
  protected readonly i18n = inject(I18n);

  protected readonly newType = signal<NewItemType>('task');
  protected readonly newInput = signal('');
  protected readonly addingParent = signal<string | null>(null);
  protected readonly addingInput = signal('');

  protected readonly cards = signal<TaskNode[]>(TasksPage.load());

  protected readonly cardViews = computed(() =>
    this.cards().map((card) => {
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
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cards())));
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
    this.cards.update((list) => TasksPage.mapNode(list, id, (node) => ({ ...node, done: !node.done })));
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

  protected remove(id: string): void {
    this.cards.update((list) => TasksPage.removeNode(list, id));
  }

  private static createNode(title: string, type: NewItemType): TaskNode {
    return {
      id: crypto.randomUUID(),
      title,
      done: false,
      isNote: type === 'note',
      text: '',
      content: [],
    };
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

  private static load(): TaskNode[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? TasksPage.normalize(parsed) : [];
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