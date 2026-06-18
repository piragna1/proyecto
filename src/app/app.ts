import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from "./shared/components/toast/toast";
import { Footer } from "./shared/components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto');
}
