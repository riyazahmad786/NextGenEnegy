import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastMessage, ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit {
  toastMessages: ToastMessage[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toastState.subscribe((message: ToastMessage) => {
      this.toastMessages.push(message);
      setTimeout(() => this.removeToast(message), 3000);
    });
  }

  removeToast(message: ToastMessage) {
    this.toastMessages = this.toastMessages.filter((m) => m !== message);
  }
}
