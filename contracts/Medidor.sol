pragma solidity ^0.5.0;

contract Medidor {
  uint public contMedicion = 0;

  struct Medida {
    uint id;
    string valor;
    bool medido;
  }

  mapping(uint => Medida) public medidas;

  event MedidaCreada(
    uint id,
    string valor, 
    bool medido
  );

  constructor() public {
    crearMedida("435");
  }

  function crearMedida(string memory _valor) public {
    contMedicion ++;
    medidas[contMedicion] = Medida(contMedicion, _valor, true);
    emit MedidaCreada(contMedicion, _valor, true);
  }
}