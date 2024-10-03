import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'

import { Nullable } from '@libs/core'

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  readonly createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  readonly updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, type: 'timestamptz' })
  readonly deletedAt: Nullable<Date>
}
