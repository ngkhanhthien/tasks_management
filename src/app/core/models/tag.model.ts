export interface Tag {
  id: string;
  name: string;
  color: string;
  parentId?: string;
  subTagIds?: string[];
}
