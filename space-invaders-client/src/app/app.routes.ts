import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/menu/main-menu.component').then(m => m.MainMenuComponent)
  },
  {
    path: 'menu',
    loadComponent: () => import('./features/menu/main-menu.component').then(m => m.MainMenuComponent)
  },
  {
    path: 'high-scores',
    loadComponent: () => import('./features/menu/high-scores.component').then(m => m.HighScoresComponent)
  },
  {
    path: 'game',
    loadComponent: () => import('./features/game/game-container/game-container.component').then(m => m.GameContainerComponent)
  },
  {
    path: 'game-over',
    loadComponent: () => import('./features/game-over/game-over.component').then(m => m.GameOverComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

