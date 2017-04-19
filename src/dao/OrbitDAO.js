import OrbitDB from 'orbit-db'

/**
 * OrbitDB data access object
 * @link https://github.com/haadcode/orbit-db
 */
class OrbitDAO {
  init (ipfsNode) {
    if (ipfsNode) {
      this.db = ipfsNode ? new OrbitDB(ipfsNode).feed('ChronoMint.data') : null

      this.db.load(100).then((loaded) => {
        console.log(`data has loaded: ${loaded}`)
        this._logAll()
      })

      this.db.events.on('ready', (dbname) => {
        console.log(`OrbitDb Ready [${dbname}].`)
        this._logAll()
      })

      this.db.events.on('error', (e) => {
        console.log('OrbitDb Error.' + e)
      })

      this.db.events.on('write', (dbname, hash, entry) => {
        console.log(`OrbitDb write: [${dbname}, ${hash}, ${JSON.stringify(entry)}]`)
      })

      this.db.events.on('load.progress', (dbname) => {
        console.log(`OrbitDb load.progress: [${dbname}]`)
      })

      this.db.events.on('synced', () => {
        console.log('OrbitDb synced')
        this._logAll()
      })
    }

    this.mockStore = {}
  }

  _logAll () {
    const all = this.db.iterator({ limit: -1 })
      .collect()
      .map((e) => e.payload.value)
    console.log(all)
  }

  /**
   * @param value that you want to put
   * @return {Promise.<String>} hash of added value
   */
  put (value) {
    if (!this.db) {
      return this._mockPut(value)
    }
    const ans = this.db.add(value)
    this.db.load()
    return ans
  }

  /**
   * @param hash
   * @return {Promise.<any|null>}
   */
  get (hash) {
    if (!this.db) {
      return this._mockGet(hash)
    }
    return new Promise(resolve => {
      this.db.load(100)
      const value = this.db.get(hash)
      resolve(value ? (value.hash === hash ? value.payload.value : null) : null)
    })
  }

  /**
   * @param value
   * @return {Promise.<String>} simulated hash of added value
   * @private
   */
  _mockPut (value) {
    let newHash = 'QmT'
    const possible = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    for (let i = 0; i < 43; i++) {
      newHash += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    this.mockStore[newHash] = value
    return new Promise(resolve => resolve(newHash))
  }

  /**
   * @param hash
   * @return {Promise.<any|null>}
   * @private
   */
  _mockGet (hash) {
    return new Promise(resolve => {
      resolve(this.mockStore.hasOwnProperty(hash) ? this.mockStore[hash] : null)
    })
  }
}

export default new OrbitDAO()
