App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Por favor, conecta MetaMask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */ })
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */ })
    }
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },
  loadAccount: async () => {
    App.account = web3.eth.accounts[0]
    // console.log(App.account)
  },

  loadContract: async () => {
    const medida = await $.getJSON('Medidor.json')
    App.contracts.Medidor = TruffleContract(medida)
    App.contracts.Medidor.setProvider(App.web3Provider)
    //console.log(medida)
    App.medida = await App.contracts.Medidor.deployed()
  },

  render: async () => {
    if (App.loading) {
      return
    }
    App.setLoading(true)
    $('#account').html(App.account)
    await App.renderMedidas()
    App.setLoading(false)
  },

  renderMedidas: async () => {
    const contMedición = await App.medida.contMedicion()
    const $medidaTemplate = $('.medidaTemplate')
    for (var i = 1; i <= contMedición; i++) {
      const medida = await App.medida.medidas(i)
      const medidaId = medida[0].toNumber()
      const medidaContent = medida[1]
      const medidaCompleta = medida[2]

      const $newMedidaTemplate = $medidaTemplate.clone()
      $newMedidaTemplate.find('.content').html(medidaContent)
      $newMedidaTemplate.find('input')
        .prop('name', medidaId)
        .prop('checked', medidaCompleta)
      //.on('click', App.toggleCompleted)

      if (medidaCompleta) {
        $('#medidaProcesadaList').append($newMedidaTemplate)
      } else {
        $('#medidaList').append($newMedidaTemplate)
      }

      $newMedidaTemplate.show()
    }
  },

  crearMedida: async () => {
    App.setLoading(true)
    const content = $('#medidaNueva').val()
    await App.medida.crearMedida(content)
    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
