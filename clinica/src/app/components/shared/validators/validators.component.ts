import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-validators',
  imports: [CommonModule],
  templateUrl: './validators.component.html',
  styleUrl: './validators.component.css'
})
export class ValidatorsComponent {
  @Input() control!: AbstractControl;

  /**
   * Validador personalizado para campos numéricos de 10 dígitos
   * Retorna errores específicos para mejor UX
   */
  static numericTenDigits(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const value = control.value.toString();
    
    // Verificar si contiene solo números
    if (!/^\d+$/.test(value)) {
      return { 'onlyNumbers': true };
    }
    
    // Verificar si tiene exactamente 10 dígitos
    if (value.length !== 10) {
      return { 'tenDigits': true };
    }
    
    return null;
  }

  /**
   * Validador personalizado para campos numéricos con longitud específica
   * @param length - Longitud requerida
   */
  static numericLength(length: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value.toString();
      
      // Verificar si contiene solo números
      if (!/^\d+$/.test(value)) {
        return { 'onlyNumbers': true };
      }
      
      // Verificar si tiene la longitud exacta
      if (value.length !== length) {
        return { 'exactLength': { requiredLength: length, actualLength: value.length } };
      }
      
      return null;
    };
  }

  /**
   * Validador para solo números (sin restricción de longitud)
   */
  static onlyNumbers(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const value = control.value.toString();
    
    if (!/^\d+$/.test(value)) {
      return { 'onlyNumbers': true };
    }
    
    return null;
  }
}
