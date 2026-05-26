import { Component, Input, Output, EventEmitter, ElementRef, HostListener, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-select.html',
  styleUrl: './custom-select.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelect),
      multi: true
    }
  ]
})
export class CustomSelect implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Sélectionner...';
  @Input() disabled: boolean = false;
  @Input() set value(val: any) {
    this.writeValue(val);
  }
  @Output() valueChange = new EventEmitter<any>();

  isOpen = signal(false);
  selectedOption = signal<SelectOption | null>(null);
  highlightedIndex = signal(0);
  dropdownPosition = signal({ top: 0, left: 0, width: 0 });

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private elementRef: ElementRef) {}

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      const option = this.options.find(opt => opt.value === value);
      this.selectedOption.set(option || null);
    } else {
      this.selectedOption.set(null);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(): void {
    if (this.disabled) return;
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      // Reset highlighted index to selected option or first option
      const selectedIndex = this.options.findIndex(opt => opt.value === this.selectedOption()?.value);
      this.highlightedIndex.set(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }

  selectOption(option: SelectOption): void {
    this.selectedOption.set(option);
    this.isOpen.set(false);
    this.onChange(option.value);
    this.onTouched();
    this.valueChange.emit(option.value);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        } else {
          const option = this.options[this.highlightedIndex()];
          if (option) {
            this.selectOption(option);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.isOpen.set(false);
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        } else {
          this.highlightedIndex.update(idx =>
            idx < this.options.length - 1 ? idx + 1 : idx
          );
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen()) {
          this.highlightedIndex.update(idx => idx > 0 ? idx - 1 : idx);
        }
        break;

      case 'Tab':
        this.isOpen.set(false);
        break;
    }
  }

  getDisplayText(): string {
    return this.selectedOption()?.label || this.placeholder;
  }

  isPlaceholder(): boolean {
    return !this.selectedOption();
  }
}
