import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

interface Shortcut {
  keys: string;
  callback: (event: KeyboardEvent) => void;
}

@Injectable({
  providedIn: 'root',
})
export class HotkeysService implements OnDestroy {
  private shortcuts: Map<string, Shortcut> = new Map();
  private destroy$ = new Subject<void>();

  constructor() {
    fromEvent(document, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: Event) => this.handleKeydown(event as KeyboardEvent));
  }

  addShortcut(keys: string, callback: (event: KeyboardEvent) => void): void {
    this.shortcuts.set(keys, { keys, callback });
  }

  removeShortcut(keys: string): void {
    this.shortcuts.delete(keys);
  }

  private handleKeydown(event: KeyboardEvent): void {
    // Implement logic to match event.key and event.ctrlKey, etc.
    // with registered shortcuts and call the corresponding callback.
    // Example: if (event.ctrlKey && event.key === 's') { /* call save callback */ }
    this.shortcuts.forEach(shortcut => {
      // Simplistic example, real implementation needs more robust key parsing
      if (shortcut.keys === event.key && event.ctrlKey) { // Adjust for modifiers
        event.preventDefault(); // Prevent default browser action
        shortcut.callback(event);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}