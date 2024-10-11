import { Component, OnInit } from '@angular/core';
import { Usuario } from './models/Usuarios.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = { id: 0, nombre: '', email: '', empresa: '' };
  usuarioSeleccionado: Usuario | null = null;
  private idCounter: number = 1;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe(data => {
        this.usuarios = data.map(user => ({
          id: user.id,
          nombre: user.name,
          email: user.email,
          empresa: user.company.name
        }));
        this.idCounter = this.usuarios.length + 1;
      });
  }

  agregarOmodificarUsuario() {
    if (this.usuarioSeleccionado && this.usuarioSeleccionado.id) {
      this.modificarUsuario(this.usuarioSeleccionado.id);
    } else {
      this.agregarUsuario();
    }
  }

  agregarUsuario() {
    const body = {
      name: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      company: {
        name: this.nuevoUsuario.empresa
      }
    };

    this.usuarios.push({ ...this.nuevoUsuario, id: this.idCounter });
    console.log('Usuario agregado:', this.nuevoUsuario);
    this.idCounter++;
    this.nuevoUsuario = { id: 0, nombre: '', email: '', empresa: '' };
  }

  seleccionarUsuario(usuario: Usuario) {
    this.usuarioSeleccionado = { ...usuario };
    this.nuevoUsuario = { ...usuario };
  }

  modificarUsuario(id: number) {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      this.usuarios[index] = { ...this.nuevoUsuario, id };
    }
    
    console.log('Usuario modificado:', this.nuevoUsuario);
    this.nuevoUsuario = { id: 0, nombre: '', email: '', empresa: '' };
    this.usuarioSeleccionado = null;
  }

  eliminarUsuario(id: number) {
    this.http.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .subscribe(response => {
        console.log('Usuario eliminado:', response);
        this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
      });
  }
}
