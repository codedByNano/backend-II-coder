class UserDTO {
  constructor(user) {
    this.nombre = user.nombre;
    this.apellido = user.apellido;
    this.email = user.email;
    this.role = user.role;
    this.cart = user.cart;
  }
}

export default UserDTO;
