import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appTwoDecimal]'
})
export class TwoDecimalDirective {

 @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Allow only numbers and up to two decimal places
    if (value && !/^\d*\.?\d{0,2}$/.test(value)) {
      value = value.slice(0, -1); // remove last invalid character
      input.value = value;
      // Trigger Angular model update
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      nativeInputValueSetter?.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
