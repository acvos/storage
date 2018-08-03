import map from 'poly-map'

class EntityModel {
  constructor(config) {
    this.changeLog = config.changeLog
    this.state = config.state
    this.schemaRegistry = config.schemaRegistry

    this.changeLog.onChange(async (entity) => {
      await this.state.set(entity)
      return entity
    })
  }

  async init() {
    this.state.reset()

    const types = this.schemaRegistry.listUserTypes()
    await Promise.all(types.map(type =>
      this.changeLog
        .reconstruct(type)
        .then(map((entity) => { this.state.set({ ...entity, type }) }))
    ))
  }

  // Commands
  async create(type, body) {
    const entity = this.schemaRegistry.format(type, body)
    const transaction = this.changeLog.registerNew(type, entity)

    return transaction
  }

  async update(id, body) {
    if (!this.state.exists(id)) {
      throw new Error(`[Storage] Attempting to update entity that doesn't exist: ${id}.`)
    }

    const previous = this.state.get(id)
    const next = this.schemaRegistry.format(previous.type, body)
    const transaction = this.changeLog.registerUpdate(previous.type, previous, next)

    return transaction
  }
}

export default EntityModel
