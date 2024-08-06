import {
  Directive,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appPress]',
})
export class PressDirective implements OnInit {
  @Output() press = new EventEmitter();
  pressGesture = {
    name: 'press',
    enabled: false,
    interval: 251,
  };
  pressTimeout!: any;
  isPressing: boolean = false;
  lastTap = 0;
  tapCount = 0;
  tapTimeout!: any;

  ngOnInit() {
    this.pressGesture.enabled = true;
  }
  
  @HostListener('mousedown', ['$event'])
  @HostListener('document:mouseup', ['$event'])
  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  onPress(e: any) {
    if (!this.pressGesture.enabled) return;
    this.handlePressing(e.type);
  }

  private handlePressing(type: any) {
    if (type == 'touchstart' || type == 'mousedown') {
      this.pressTimeout = setTimeout(() => {
        this.isPressing = true;
        this.press.emit('start');
      }, this.pressGesture.interval);
    } else if (type == 'touchend' || type == 'mouseup') {
      clearTimeout(this.pressTimeout);
      if (this.isPressing) {
        this.press.emit('end');
        this.resetTaps();
      }
      setTimeout(() => (this.isPressing = false), 50);
    }
  }

  private resetTaps() {
    clearTimeout(this.tapTimeout);
    this.tapCount = 0;
    this.tapTimeout = null;
    this.lastTap = 0;
  }
}
