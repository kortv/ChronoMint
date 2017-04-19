// import OrbitDB from 'orbit-db'

/**
 * OrbitDB data access object
 * @link https://github.com/haadcode/orbit-db
 */
class OrbitDAO {
  init (ipfsNode) {
    if (ipfsNode) {
      this.db = ipfsNode || null
      console.log(this.db)
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
    return new Promise(resolve => {
      this.db.addJSON(value, (err, result) => {
        console.log(err, result)
        resolve(result)
      })
      // resolve(value ? (value.hash === hash ? value.payload.value : null) : null)
    })
  }

  /**
   * @param hash
   * @return {Promise.<any|null>}
   */
  get (hash) {
    console.log(hash)
    if (!this.db) {
      return this._mockGet(hash)
    }
    return new Promise((resolve, reject) => {
      if (hash === 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh52' ||
        hash === 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51') {
        resolve(null)
      } else {
        this.db.catJSON(hash, (err, result) => {
          console.log(err, result)
          if (err) {
            reject(new Error(err))
          } else resolve(result)
        })
      }
      // resolve(value ? (value.hash === hash ? value.payload.value : null) : null)
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
