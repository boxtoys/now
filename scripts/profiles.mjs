#!/usr/bin/env zx

const profiles = {
  name: 'Node',
  settings: JSON.stringify({
    settings: JSON.stringify({
      "[json]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[jsonc]": {
          "editor.defaultFormatter": "vscode.json-language-features"
      },
      "[javascript]": {
          "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[typescript]": {
          "editor.defaultFormatter": "esbenp.prettier-vscode"
      }
    })
  }),
  extensions: [{
    displayName: 'Prettier - Code formatter',
    identifier: {
      id: 'esbenp.prettier-vscode',
      uuid: '96fa4707-6983-4489-b7c5-d5ffdfdcce90'
    }
  }, {
    displayName: 'Pretty TypeScript Errors',
    identifier: {
      id: 'yoavbls.pretty-ts-errors',
      uuid: '1e149c89-8f97-447e-863d-1146f0ad1b70'
    }
  }]
}


fs.writeFileSync('profiles.code-profile', JSON.stringify({
  ...profiles,
  extensions: JSON.stringify(profiles.extensions)
}), 'utf8')
