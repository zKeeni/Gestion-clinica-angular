import { Component,  OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InLogin } from '../../modelos/InLogin';
import { AuthService } from '../../servicios/authservicio.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-componenteloging',
    imports: [ReactiveFormsModule],
    templateUrl: './componentelogin.component.html',
    styleUrl: './componentelogin.component.css'
})
export class ComponenteloginComponent implements OnInit {

  formLogin: FormGroup; 
  constructor(
    private formBuilder :FormBuilder,
    private authservicio: AuthService,
    private router :Router
  ){
      this.formLogin= formBuilder.group({
        usuario : ['',Validators.required],
        password: ['',Validators.required]
        
      });
  }
  ngOnInit(): void { 
  }

  Login(): void {

    const usuarioLogin: InLogin = {
      nombre_usuario: this.formLogin.value.usuario,
      contrasenia: this.formLogin.value.password
    };

    console.log(usuarioLogin);

    this.authservicio.login(usuarioLogin).subscribe(
      {
        next : res=>{
          
          const token = res.token;
          this.authservicio.guardarToken(token);
          console.log(this.authservicio.getToken());
          this.router.navigate(['home/dashboard']);
  
        },error:err =>{
  
          alert('Hubo un problema con la autenticación '+ err.error.message);
        }
      }
    );
    }
    
  }





