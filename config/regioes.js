/**
 * 📍 Regiões Administrativas de Brasília
 * Lista oficial das 33 RAs do Distrito Federal
 */

module.exports = {
  // Array com todas as RAs
  REGIOES_ADMINISTRATIVAS: [
    'Plano Piloto',
    'Asa Sul',
    'Asa Norte',
    'Lago Sul',
    'Lago Norte',
    'Taguatinga',
    'Brazlândia',
    'Sobradinho',
    'Planaltina',
    'Paranoá',
    'Núcleo Bandeirante',
    'Ceilândia',
    'Guará',
    'Cruzeiro',
    'Samambaia',
    'Santa Maria',
    'São Sebastião',
    'Recanto das Emas',
    'Riacho Fundo',
    'Riacho Fundo II',
    'Sudoeste/Octogonal',
    'Varjão',
    'Park Way',
    'SCIA (Estrutural)',
    'Sobradinho II',
    'Jardim Botânico',
    'Itapoã',
    'SIA',
    'Vincúlus',
    'Fercal',
    'Arapoanga',
    'Águas Claras',
    'Arniqueira'
  ],

  // Mapa de coordenadas centrais aproximadas de cada RA
  COORDENADAS_RAS: {
    'Plano Piloto': { latitude: -15.7942, longitude: -47.8822 },
    'Asa Sul': { latitude: -15.8267, longitude: -47.8761 },
    'Asa Norte': { latitude: -15.7617, longitude: -47.8761 },
    'Lago Sul': { latitude: -15.8614, longitude: -47.8858 },
    'Lago Norte': { latitude: -15.7350, longitude: -47.8858 },
    'Taguatinga': { latitude: -15.7975, longitude: -48.0397 },
    'Brazlândia': { latitude: -15.5661, longitude: -48.2089 },
    'Sobradinho': { latitude: -15.6550, longitude: -47.8014 },
    'Planaltina': { latitude: -15.6330, longitude: -47.6500 },
    'Paranoá': { latitude: -15.8614, longitude: -47.6089 },
    'Núcleo Bandeirante': { latitude: -15.8861, longitude: -48.0042 },
    'Ceilândia': { latitude: -15.8197, longitude: -48.1139 },
    'Guará': { latitude: -15.8983, longitude: -47.9222 },
    'Cruzeiro': { latitude: -15.7639, longitude: -47.9181 },
    'Samambaia': { latitude: -15.8964, longitude: -48.0592 },
    'Santa Maria': { latitude: -15.9378, longitude: -48.0117 },
    'São Sebastião': { latitude: -15.9456, longitude: -47.8247 },
    'Recanto das Emas': { latitude: -15.9783, longitude: -47.9750 },
    'Riacho Fundo': { latitude: -15.9378, longitude: -47.9294 },
    'Riacho Fundo II': { latitude: -15.9764, longitude: -47.8864 },
    'Sudoeste/Octogonal': { latitude: -15.8047, longitude: -47.8397 },
    'Varjão': { latitude: -15.7133, longitude: -47.9300 },
    'Park Way': { latitude: -15.8556, longitude: -47.9756 },
    'SCIA (Estrutural)': { latitude: -15.9864, longitude: -48.0678 },
    'Sobradinho II': { latitude: -15.6883, longitude: -47.7889 },
    'Jardim Botânico': { latitude: -15.8831, longitude: -47.8503 },
    'Itapoã': { latitude: -15.7642, longitude: -47.7067 },
    'SIA': { latitude: -15.9089, longitude: -47.9464 },
    'Vincúlus': { latitude: -15.6667, longitude: -47.8131 },
    'Fercal': { latitude: -15.4939, longitude: -47.9306 },
    'Arapoanga': { latitude: -15.5533, longitude: -47.8633 },
    'Águas Claras': { latitude: -15.7897, longitude: -48.0022 },
    'Arniqueira': { latitude: -15.8256, longitude: -48.0656 }
  },

  // Método para validar RA
  validarRA: function(ra) {
    return this.REGIOES_ADMINISTRATIVAS.includes(ra);
  },

  // Método para obter coordenadas de uma RA
  obterCoordenadas: function(ra) {
    return this.COORDENADAS_RAS[ra] || null;
  },

  // Método para buscar RAs por termo
  buscarRAs: function(termo) {
    const termoMinusculo = termo.toLowerCase();
    return this.REGIOES_ADMINISTRATIVAS.filter(ra =>
      ra.toLowerCase().includes(termoMinusculo)
    );
  }
};
