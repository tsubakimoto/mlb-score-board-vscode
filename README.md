# MLB Score Board for VS Code

This Visual Studio Code extension allows you to view Major League Baseball (MLB) game scores for today directly within your development environment.

## Features

- **Sidebar Integration**: Displays scores directly in VS Code's Explorer sidebar
- **Daily MLB Scores**: View all MLB games scheduled for today
- **Custom Date Selection**: Optionally specify a custom game date in settings
- **Live Data**: Fetches real-time data from the official MLB Stats API
- **Clean Display**: Shows scores in an easy-to-read format (e.g., "NYY 10 - 5 BOS")
- **Game Status**: Displays current status of each game (Final, In Progress, Scheduled, etc.)
- **One-Click Refresh**: Refresh button in the tree view title to get the latest scores
- **Native Integration**: Seamlessly integrates with VS Code's native tree view interface

## Installation

1. Install the extension from the VS Code marketplace
2. The extension will be automatically activated

## Usage

1. After installation, the "MLB Scores" section will appear in your Explorer sidebar
2. Scores will load automatically when the extension activates
3. Click the refresh button (🔄) in the tree view title to update scores
4. Each game shows: "AWAY_TEAM AWAY_SCORE - HOME_SCORE HOME_TEAM" with status

### Viewing Games for a Specific Date

You can configure the extension to show games for a specific date:

1. Open VS Code Settings (File > Preferences > Settings)
2. Search for "MLB Score Board"
3. Set the "Game Date" field to a date in `MM/DD/YYYY` format (e.g., `12/25/2024`)
4. Leave the field empty to show today's games (default behavior)

The scores will automatically refresh when you change the date setting. When a custom date is configured, the date will be displayed in the view title (e.g., "MLB Scores - 12/25/2024").

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
- **Timezone**: Uses Pacific Standard Time (PST) for date calculation when no custom date is specified
- **Date Format**: MM/DD/YYYY for custom date configuration
- **Refresh**: Manual refresh available via the "Reload" button, automatic refresh on configuration change
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
