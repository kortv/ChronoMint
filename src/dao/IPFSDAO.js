import IPFS from 'ipfs-mini'

class IPFSDAO {
  init (stores) {
    return new Promise((resolve, reject) => {
      const infura = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
      resolve(infura)
      this.node = infura
      // const ipfs = new IPFS({
      //   SignalServer: 'star-signal.cloud.ipfs.team' // IPFS dev server
      // })
      // ipfs.on('ready', () => {
      //   console.log(`IPFS Ready. PeerId ${ipfs.PeerId} GatewayAddress ${ipfs.GatewayAddress}`)
      //   this.node = ipfs
      //   resolve(ipfs)
      // })
    })
  }

  getNode () {
    if (!this.node) {
      throw new Error('Node is undefined. Please use init() to initialize it.')
    }
    return this.node
  }

  goOffline () {
    return new Promise(resolve => {
      this.getNode().goOffline(() => {
        resolve(true)
      })
    })
  }
}

export default new IPFSDAO()
