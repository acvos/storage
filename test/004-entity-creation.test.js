import expect from 'expect.js'
import createStorage from '../src'
import schemata from './fixtures/schemata/schemata.json'
import fixtures from './fixtures/data/data.json'
import { expectEntity } from './steps/checks'
import { forAll, forNone } from './steps/generic'

const storage = createStorage({
  queue: 'default',
  index: 'default'
})

// const { canCreate, canFind, canUpdate, cannotUpdate } = createSteps(storage)

export const cannotCreate = (type, payload) => (done) => {
  storage.entity.create(type, payload)
    .then(() => done("Expected error didn't happen"))
    .catch(() => done())
}

export const canCreate = (type, payload) => async () => {
  const response = await storage.entity.create(type, payload)
  expectEntity(response)
  expect(response.type).to.eql(type)
  expect(response.version).to.eql(1)
  expect(response.payload).to.eql(payload)
}

describe("Entity creation flow", () => {
  before(() => storage.init().then(() => Promise.all(schemata.map(storage.schema.create))))

  it("can't create entity of unknown type", cannotCreate('wow.doge', {}))
  it("can't create empty entity", cannotCreate('profile.user', {}))
  it("can't create malformatted entity", cannotCreate('profile.user', {
    role: 100500,
    last_name: ["Lisa"],
    first_name: false,
    company: "Alpha Oil Co",
    email: "lking@test.abc"
  }))

  it("can create properly structured entity", canCreate('profile.user', {
    role: "Doge",
    last_name: "Such",
    first_name: "Much",
    company: "Alpha Oil Co",
    email: "lking@test.abc"
  }))
})

// // describe("", () => {
// //   before(() => storage.init())

// //   it("doesn't have entities before they are created", isEmpty)
// //   it("correctly creates new entities", forAll(fixtures, canCreate))
// //   it("can find created entities", forAll(fixtures, canFindOnlyOne))

// //   it("correct number of entities has been created", async function () {
// //     const response = await entity.find()
// //     expect(response).to.be.an('array')
// //     expect(response).to.have.length(fixtures.length)
// //   })
// // })
