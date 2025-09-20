# MLB Score Board VS Code Extension Specification

## Overview
This VS Code extension provides users with the ability to view Major League Baseball (MLB) game scores for the current day within their development environment.

## Features

### Core Functionality
- **Daily MLB Scores**: Displays all MLB games scheduled for today
- **Real-time Data**: Fetches live data from the official MLB API
- **Score Format**: Shows scores in the format "AWAY ## - ## HOME" (e.g., "NYY 10 - 5 BOS")
- **Game Status**: Displays current game status (Final, In Progress, Scheduled, etc.)
- **Reload Function**: Manual refresh button to get the latest scores

### User Interface
- **Webview Panel**: Dedicated panel within VS Code to display scores
- **VS Code Theme Integration**: Automatically adapts to the user's VS Code theme
- **Responsive Design**: Clean, readable layout that fits within VS Code's interface
- **Error Handling**: User-friendly error messages when data cannot be loaded

## Technical Specifications

### API Integration
- **Data Source**: MLB Stats API (`https://statsapi.mlb.com/api/v1/schedule/games/`)
- **Query Parameters**: 
  - `sportId=1` (MLB)
  - `date=MM/DD/YYYY` (current date in PST timezone)
- **Timezone**: Pacific Standard Time (PST) for date calculation
- **Data Format**: JSON response containing game schedules and scores

### Architecture

#### Main Components
1. **Extension Entry Point** (`extension.js`)
   - Registers the command to show MLB scores
   - Handles extension activation and deactivation

2. **Score Board Provider** (`mlbScoreBoardProvider.js`)
   - Manages the webview panel
   - Handles user interactions (reload button)
   - Generates HTML content for display
   - Converts team names to standard abbreviations

3. **API Service** (`mlbApiService.js`)
   - Handles HTTP requests to MLB API
   - Manages date formatting for PST timezone
   - Processes and returns game data

#### Team Abbreviations
The extension includes a comprehensive mapping of MLB team names to their standard abbreviations:
- New York Yankees → NYY
- Boston Red Sox → BOS
- Chicago Cubs → CHC
- And all other MLB teams...

### Error Handling
- **Network Errors**: Graceful handling of API connection failures
- **HTTP Errors**: Proper error messages for API response errors
- **Empty Data**: Displays appropriate message when no games are scheduled
- **Fallback Display**: Error page with retry functionality

### Testing
- **Unit Tests**: Comprehensive test coverage using Vitest
- **API Mocking**: Mock external API calls for reliable testing
- **Component Testing**: Tests for HTML generation and team abbreviations
- **Error Testing**: Verification of error handling scenarios

## User Workflow

### Installation and Activation
1. Install the extension in VS Code
2. Extension activates automatically when installed

### Using the Extension
1. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Type "Show MLB Scores" and select the command
3. View scores in the dedicated panel
4. Click "Reload" button to refresh data as needed

### Display Format
Each game is displayed as:
```
AWAY_TEAM AWAY_SCORE - HOME_SCORE HOME_TEAM    [STATUS]
```

Example:
```
NYY 10 - 5 BOS                                [Final]
CHC 4 - 7 CIN                                [Final]
SEA 4 - 0 HOU                                [In Progress]
```

## Configuration
- No user configuration required
- Extension uses built-in PST timezone calculation
- Automatically adapts to VS Code's color theme

## Browser Compatibility
- Requires VS Code version 1.74.0 or higher
- Uses modern JavaScript features (ES2022)
- Leverages VS Code's webview API for display

## Security Considerations
- Only makes requests to official MLB API
- No user data collection or storage
- Uses VS Code's secure webview environment
- No external dependencies for runtime operation