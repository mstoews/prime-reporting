import { Injectable, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

import { filter } from 'rxjs/operators';

interface Shortcut {
  key: string;
  callback: (event: KeyboardEvent) => void;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Hotkeys implements OnDestroy {
  private shortcuts: Map<string, Shortcut> = new Map();
  private subscriptions: Subscription[] = [];

  constructor() {
    this.subscriptions.push(
      fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(
          filter((event) => {
            const key = this.getKeyCombination(event);
            return this.shortcuts.has(key);
          })
        )
        .subscribe((event) => {
          const key = this.getKeyCombination(event);
          const shortcut = this.shortcuts.get(key);
          if (shortcut) {
            event.preventDefault(); // Prevent default browser behavior
            shortcut.callback(event);
          }
        })
    );
  }

  addShortcut(key: string, callback: (event: KeyboardEvent) => void, description?: string): void {
    this.shortcuts.set(key, { key, callback, description });
  }

  removeShortcut(key: string): void {
    this.shortcuts.delete(key);
  }

  getShortcuts(): Shortcut[] {
    return Array.from(this.shortcuts.values());
  }

  private getKeyCombination(event: KeyboardEvent): string {
    const keys: string[] = [];
    if (event.ctrlKey) keys.push('control');
    if (event.shiftKey) keys.push('shift');
    if (event.altKey) keys.push('alt');
    if (event.metaKey) keys.push('meta'); // For Cmd on Mac
    keys.push(event.key.toLowerCase());
    return keys.join('.');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
