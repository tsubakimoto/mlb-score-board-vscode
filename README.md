# MLB Score Board for VS Code

This Visual Studio Code extension allows you to view Major League Baseball (MLB) game scores for today directly within your development environment.

## Features

- **Daily MLB Scores**: View all MLB games scheduled for today
- **Live Data**: Fetches real-time data from the official MLB Stats API
- **Clean Display**: Shows scores in an easy-to-read format (e.g., "NYY 10 - 5 BOS")
- **Game Status**: Displays current status of each game (Final, In Progress, Scheduled, etc.)
- **One-Click Refresh**: Reload button to get the latest scores
- **VS Code Integration**: Seamlessly integrates with your VS Code theme and interface

## Installation

1. Install the extension from the VS Code marketplace
2. The extension will be automatically activated

## Usage

1. Open the Command Palette (`Ctrl+Shift+P` on Windows/Linux, `Cmd+Shift+P` on macOS)
2. Type "Show MLB Scores" and select the command
3. A new panel will open displaying today's MLB games and scores
4. Click the "Reload" button to refresh the data

## Score Format

Games are displayed in the following format:
```
AWAY_TEAM AWAY_SCORE - HOME_SCORE HOME_TEAM    [STATUS]
```

For example:
```
NYY 10 - 5 BOS                                [Final]
CHC 4 - 7 CIN                                [Final]
SEA 4 - 0 HOU                                [In Progress]
```

## Technical Details

- **Data Source**: MLB Stats API (https://statsapi.mlb.com)
- **Timezone**: Uses Pacific Standard Time (PST) for date calculation
- **Refresh**: Manual refresh available via the "Reload" button
- **Theme Support**: Automatically adapts to your VS Code color theme

## Development

### Prerequisites
- Node.js 20+
- npm

### Setup
```bash
npm install
```

### Testing
```bash
npm test
```

### Building
```bash
npm run package
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- MLB Stats API for providing the game data
- VS Code extension API for the development platform
