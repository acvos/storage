import { Dictionary, Service, EventLog } from '@navarik/types'
import { SchemaRegistryAdapter, CanonicalSchema, ValidationResponse, FormattedEntity } from '@navarik/core-ddl'

export type Timestamp = string
export type UUID = string

export interface CanonicalEntity<B extends object, M extends object> {
  id: UUID
  version_id: UUID
  previous_version_id: UUID|null
  created_by: UUID
  created_at: Timestamp
  modified_by: UUID
  modified_at: Timestamp
  type: string
  body: B
  meta: M
  schema: UUID
}

export type EntityData<B extends object, M extends object> = Partial<CanonicalEntity<B, M>> & {
  type: string
  body: B
}

export type EntityPatch<B extends object, M extends object> = Partial<CanonicalEntity<B, M>> & {
  id: UUID
  body: B
  version_id: UUID
}

export type ActionType = 'create'|'update'|'delete'

export interface ChangeEvent<B extends object, M extends object> {
  action: ActionType
  user: UUID
  timestamp: Timestamp
  message: string
  entity: CanonicalEntity<B, M>
  schema: CanonicalSchema|undefined
  parent: CanonicalEntity<B, M>|undefined
}

export type AccessType = 'read'|'write'

export type AccessGrant = {
  subject: UUID
  access: AccessType
}

export type AccessControlQueryTerms = {
  dac: Array<AccessGrant>
  mac: Array<UUID>
}

export type AccessControlDecision = {
  granted: boolean
  explanation: string
}

export interface AccessControlAdapter<B extends object, M extends object> {
  check(subject: UUID, action: AccessType, object: CanonicalEntity<B, M>): Promise<AccessControlDecision>
  attachTerms(entity: CanonicalEntity<B, M>): Promise<CanonicalEntity<B, M>>
  getQuery(subject: UUID, access: AccessType): Promise<SearchQuery>
}

export type Observer<B extends object, M extends object> = (event: ChangeEvent<B, M>) => void|Promise<void>

export interface Changelog<B extends object, M extends object> extends EventLog<ChangeEvent<B, M>> {}

export interface State<B extends object, M extends object> extends Service {
  put(document: CanonicalEntity<B, M>): Promise<void>
  get(id: string): Promise<CanonicalEntity<B, M>>
  delete(id: string): Promise<void>
  stats(): Promise<object>
}

export type SearchQuery = Dictionary<string|object|number|boolean>
export type SearchOptions = {
  limit?: number
  offset?: number
  sort?: string|Array<string>
}

export interface SearchIndex<B extends object, M extends object> extends Service {
  update(action: ActionType, document: CanonicalEntity<B, M>, schema?: CanonicalSchema, metaSchema?: CanonicalSchema): Promise<void>
  find(query: SearchQuery, options: SearchOptions): Promise<Array<CanonicalEntity<B, M>>>
  count(query: SearchQuery): Promise<number>
  isClean(): Promise<boolean>
}

export { SchemaRegistryAdapter, CanonicalSchema, ValidationResponse, FormattedEntity }
