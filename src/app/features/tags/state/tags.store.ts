import { Injectable, signal } from '@angular/core';
import { Tag } from '../../../core/models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagsStore {
  // State
  private readonly _tags = signal<Tag[]>([
    { id: '1', name: 'tag_1', color: '#60a5fa' } // Mock initial tag as seen in sidebar
  ]);

  // Computed
  readonly tags = this._tags.asReadonly();

  // Actions
  addTag(tag: Omit<Tag, 'id'>) {
    const newTag: Tag = {
      ...tag,
      id: crypto.randomUUID()
    };
    this._tags.update(tags => [...tags, newTag]);
  }

  updateTag(id: string, updates: Partial<Tag>) {
    this._tags.update(tags => 
      tags.map(tag => 
        tag.id === id ? { ...tag, ...updates } : tag
      )
    );
  }

  deleteTag(id: string) {
    this._tags.update(tags => tags.filter(tag => tag.id !== id));
  }
}
