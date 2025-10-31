/**
 * Usage examples for HighScoreService
 * 
 * This file demonstrates how to use the HighScoreService
 * for managing game high scores.
 */

const HighScoreService = require('./highscore.service');

// Create an instance of the service
const highScoreService = new HighScoreService();

// Example 1: Add a new high score
async function submitScore(playerName, score, level, duration) {
  try {
    const newScore = await highScoreService.addHighScore({
      playerName,
      score,
      level,
      duration,
    });
    
    console.log('High score added:', newScore);
    console.log(`ID: ${newScore.id}`);
    console.log(`Date: ${newScore.date}`);
    
    return newScore;
  } catch (error) {
    console.error('Failed to add high score:', error.message);
    return null;
  }
}

// Example 2: Check if a score qualifies for the leaderboard
async function checkIfHighScore(score) {
  try {
    const qualifies = await highScoreService.isHighScore(score);
    
    if (qualifies) {
      console.log(`🎉 Score ${score} qualifies for the high score table!`);
      return true;
    } else {
      console.log(`Score ${score} does not make the top 100.`);
      return false;
    }
  } catch (error) {
    console.error('Failed to check high score:', error.message);
    return false;
  }
}

// Example 3: Display top 10 high scores
async function displayTopTen() {
  try {
    const topScores = await highScoreService.getTopScores(10);
    
    console.log('=== TOP 10 HIGH SCORES ===');
    topScores.forEach((score, index) => {
      console.log(`${index + 1}. ${score.playerName}: ${score.score} (Level ${score.level})`);
    });
    
    return topScores;
  } catch (error) {
    console.error('Failed to get top scores:', error.message);
    return [];
  }
}

// Example 4: Get all high scores for display
async function getAllScores() {
  try {
    const allScores = await highScoreService.getAllHighScores();
    
    console.log(`Total high scores: ${allScores.length}`);
    
    return allScores;
  } catch (error) {
    console.error('Failed to get all scores:', error.message);
    return [];
  }
}

// Example 5: Game over flow - check and submit score
async function handleGameOver(playerName, finalScore, levelReached, gameDuration) {
  try {
    // First check if it's a high score
    const qualifies = await highScoreService.isHighScore(finalScore);
    
    if (qualifies) {
      console.log('🎊 Congratulations! You got a high score!');
      
      // Prompt for name if needed (in real game)
      const name = playerName || 'Player';
      
      // Submit the score
      const newScore = await highScoreService.addHighScore({
        playerName: name,
        score: finalScore,
        level: levelReached,
        duration: gameDuration,
      });
      
      console.log(`Your score has been saved with ID: ${newScore.id}`);
      
      // Show updated leaderboard
      await displayTopTen();
      
      return newScore;
    } else {
      console.log('Better luck next time!');
      return null;
    }
  } catch (error) {
    console.error('Error handling game over:', error.message);
    return null;
  }
}

// Example 6: Display leaderboard with rankings
async function showLeaderboard(limit = 10) {
  try {
    const topScores = await highScoreService.getTopScores(limit);
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║         HIGH SCORE LEADERBOARD         ║');
    console.log('╠════════════════════════════════════════╣');
    
    topScores.forEach((score, index) => {
      const rank = (index + 1).toString().padStart(2, ' ');
      const name = score.playerName.padEnd(15, ' ');
      const points = score.score.toString().padStart(8, ' ');
      const level = score.level.toString().padStart(3, ' ');
      
      console.log(`║ ${rank}. ${name} ${points} pts (Lv ${level}) ║`);
    });
    
    console.log('╚════════════════════════════════════════╝\n');
    
    return topScores;
  } catch (error) {
    console.error('Failed to show leaderboard:', error.message);
    return [];
  }
}

// Example 7: Get player's best score
async function getPlayerBestScore(playerName) {
  try {
    const allScores = await highScoreService.getAllHighScores();
    
    const playerScores = allScores.filter(
      score => score.playerName.toLowerCase() === playerName.toLowerCase()
    );
    
    if (playerScores.length === 0) {
      console.log(`No scores found for ${playerName}`);
      return null;
    }
    
    const bestScore = playerScores[0]; // Already sorted by score descending
    console.log(`${playerName}'s best: ${bestScore.score} (Level ${bestScore.level})`);
    
    return bestScore;
  } catch (error) {
    console.error('Failed to get player best score:', error.message);
    return null;
  }
}

// Example 8: Validate score data before submission
async function validateAndSubmitScore(scoreData) {
  try {
    // Manual validation checks
    if (!scoreData.playerName || scoreData.playerName.length === 0) {
      throw new Error('Player name is required');
    }
    
    if (scoreData.playerName.length > 20) {
      throw new Error('Player name is too long (max 20 characters)');
    }
    
    if (scoreData.score < 0) {
      throw new Error('Score cannot be negative');
    }
    
    if (scoreData.level < 1) {
      throw new Error('Level must be at least 1');
    }
    
    // Submit the score (service will validate again)
    const result = await highScoreService.addHighScore(scoreData);
    console.log('Score validated and submitted successfully');
    
    return result;
  } catch (error) {
    console.error('Validation failed:', error.message);
    throw error;
  }
}

// Example 9: Get score statistics
async function getScoreStatistics() {
  try {
    const allScores = await highScoreService.getAllHighScores();
    
    if (allScores.length === 0) {
      console.log('No scores yet');
      return null;
    }
    
    const scores = allScores.map(s => s.score);
    const total = scores.reduce((a, b) => a + b, 0);
    const average = Math.round(total / scores.length);
    const highest = scores[0]; // Already sorted
    const lowest = scores[scores.length - 1];
    
    const stats = {
      totalScores: allScores.length,
      highest,
      lowest,
      average,
    };
    
    console.log('=== SCORE STATISTICS ===');
    console.log(`Total Scores: ${stats.totalScores}`);
    console.log(`Highest: ${stats.highest}`);
    console.log(`Lowest: ${stats.lowest}`);
    console.log(`Average: ${stats.average}`);
    
    return stats;
  } catch (error) {
    console.error('Failed to calculate statistics:', error.message);
    return null;
  }
}

// Example 10: Clear scores (for testing/reset)
async function resetLeaderboard() {
  try {
    await highScoreService.clearAllScores();
    console.log('✓ Leaderboard has been reset');
    
    const scores = await highScoreService.getAllHighScores();
    console.log(`Current score count: ${scores.length}`);
  } catch (error) {
    console.error('Failed to reset leaderboard:', error.message);
  }
}

// Export examples for use in other modules
module.exports = {
  submitScore,
  checkIfHighScore,
  displayTopTen,
  getAllScores,
  handleGameOver,
  showLeaderboard,
  getPlayerBestScore,
  validateAndSubmitScore,
  getScoreStatistics,
  resetLeaderboard,
};

// Uncomment to run examples
// (async () => {
//   await submitScore('Alice', 15000, 10, 450);
//   await submitScore('Bob', 12000, 8, 380);
//   await submitScore('Charlie', 18000, 12, 520);
//   await showLeaderboard(10);
//   await getScoreStatistics();
// })();
