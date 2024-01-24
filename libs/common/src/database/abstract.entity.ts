import { PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;

  constructor(entity: Partial<T>) {
    if (entity !== null) {
      Object.assign(this, entity);
    }
  }
}
