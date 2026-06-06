import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * Instruction Section Interface
 */
interface InstructionSection {
  title: string;
  content: string;
  icon?: string;
}

/**
 * Instructions Dialog Component
 * Displays game instructions with expandable sections
 */
@Component({
  selector: 'app-instructions-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './instructions-dialog.component.html',
  styleUrl: './instructions-dialog.component.scss'
})
export class InstructionsDialogComponent {
  /**
   * Instruction sections organized by category
   */
  sections: InstructionSection[] = [
    {
      title: 'Controls',
      icon: 'keyboard',
      content: `
        <h4>Keyboard Controls</h4>
        <ul>
          <li><strong>Arrow Keys</strong> or <strong>WASD</strong> - Move your spaceship left and right</li>
          <li><strong>Space</strong> - Fire projectiles at enemies</li>
          <li><strong>P</strong> - Pause the game</li>
          <li><strong>ESC</strong> - Return to menu (when paused)</li>
        </ul>
        
        <h4>Mouse Controls</h4>
        <ul>
          <li><strong>Mouse Move</strong> - Move your spaceship horizontally</li>
          <li><strong>Left Click</strong> - Fire projectiles</li>
        </ul>
        
        <h4>Mobile Controls</h4>
        <ul>
          <li><strong>On-screen buttons</strong> - Automatically appear on touch devices</li>
          <li><strong>Left/Right arrows</strong> - Move your spaceship</li>
          <li><strong>Fire button</strong> - Shoot projectiles</li>
        </ul>
        
        <p class="note">💡 Controls automatically adapt to your device type.</p>
      `
    },
    {
      title: 'Gameplay',
      icon: 'videogame_asset',
      content: `
        <h4>Enemy Types</h4>
        <ul>
          <li><strong>Small Aliens</strong> - Fast moving, worth 30 points</li>
          <li><strong>Medium Aliens</strong> - Moderate speed, worth 20 points</li>
          <li><strong>Large Aliens</strong> - Slow moving, worth 10 points</li>
        </ul>
        
        <h4>Shield System</h4>
        <p>Four shields protect your spaceship from enemy fire. Each shield can absorb multiple hits before being destroyed. Use them strategically!</p>
        
        <h4>Lives System</h4>
        <p>You start with 3 lives. Lose a life when hit by enemy fire or when an enemy reaches the bottom. Game over when all lives are lost.</p>
        
        <h4>Wave Progression</h4>
        <p>Destroy all enemies to advance to the next wave. Each wave becomes progressively harder with faster enemies and more aggressive behavior.</p>
      `
    },
    {
      title: 'Scoring',
      icon: 'emoji_events',
      content: `
        <h4>Enemy Point Values</h4>
        <ul>
          <li><strong>Small Aliens</strong> - 30 points</li>
          <li><strong>Medium Aliens</strong> - 20 points</li>
          <li><strong>Large Aliens</strong> - 10 points</li>
        </ul>
        
        <h4>Bonus Points</h4>
        <ul>
          <li><strong>Wave Completion</strong> - 100 points per wave cleared</li>
          <li><strong>Shields Intact</strong> - 50 points per shield remaining at wave end</li>
          <li><strong>Accuracy Bonus</strong> - Up to 200 points for high accuracy</li>
        </ul>
        
        <h4>High Scores</h4>
        <p>Beat the top 100 scores to enter the Hall of Fame! Your name, score, wave reached, and play time are recorded.</p>
      `
    },
    {
      title: 'Tips',
      icon: 'lightbulb',
      content: `
        <ul>
          <li><strong>Stay Mobile</strong> - Keep moving to avoid enemy fire</li>
          <li><strong>Prioritize Threats</strong> - Focus on enemies closest to the bottom</li>
          <li><strong>Use Shields Wisely</strong> - Position yourself behind shields during heavy fire</li>
          <li><strong>Aim Carefully</strong> - Accuracy bonuses add up quickly</li>
          <li><strong>Watch Enemy Patterns</strong> - Enemies follow predictable movement patterns</li>
          <li><strong>Don't Waste Shots</strong> - Wait for clear shots to conserve ammo and improve accuracy</li>
          <li><strong>Practice Makes Perfect</strong> - Start on Easy difficulty to learn the mechanics</li>
        </ul>
      `
    }
  ];

  constructor(
    private dialogRef: MatDialogRef<InstructionsDialogComponent>
  ) {}

  /**
   * Close the dialog
   */
  close(): void {
    this.dialogRef.close();
  }
}
