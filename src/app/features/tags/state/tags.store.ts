import { Injectable, signal, computed } from '@angular/core';
import { Tag } from '../../../core/models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagsStore {
  // State
  private readonly _tags = signal<Tag[]>([
    { id: '1', name: 'tag_1', color: '#60a5fa' }
  ]);

  // Computed
  readonly tags = this._tags.asReadonly();
  
  readonly rootTags = computed(() => 
    this._tags().filter(tag => !tag.parentId)
  );

  // Actions
  addTag(tag: Omit<Tag, 'id'>) {
    const id = crypto.randomUUID();
    const newTag: Tag = { ...tag, id };
    
    this._tags.update(tags => {
      let updatedTags = [...tags, newTag];
      
      // If HAS parent, update the parent's subTagIds
      if (tag.parentId) {
        updatedTags = updatedTags.map(t => {
          if (t.id === tag.parentId) {
            return {
              ...t,
              subTagIds: [...(t.subTagIds || []), id]
            };
          }
          return t;
        });
      }
      
      return updatedTags;
    });
  }

  getChildren(parentId: string): Tag[] {
    return this._tags().filter(tag => tag.parentId === parentId);
  }

  updateTag(id: string, updates: Partial<Tag>) {
    this._tags.update(tags => 
      tags.map(tag => 
        tag.id === id ? { ...tag, ...updates } : tag
      )
    );
  }

  deleteTag(id: string) {
    this._tags.update(tags => {
      const tagToDelete = tags.find(t => t.id === id);
      let updatedTags = tags.filter(tag => tag.id !== id);
      
      // If it was a child, remove from parent's subTagIds
      if (tagToDelete?.parentId) {
        updatedTags = updatedTags.map(t => {
          if (t.id === tagToDelete.parentId) {
            return {
              ...t,
              subTagIds: t.subTagIds?.filter(childId => childId !== id)
            };
          }
          return t;
        });
      }
      
      // If it was a parent, orphan the children (or delete them - TickTick usually orphans or deletes)
      // User didn't specify, so I'll orphan them for now.
      updatedTags = updatedTags.map(t => {
        if (t.parentId === id) {
          return { ...t, parentId: undefined };
        }
        return t;
      });

      return updatedTags;
    });
  }
}
