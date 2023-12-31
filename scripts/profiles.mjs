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
      },
      "[vue]": {
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
  }, {
    displayName: 'ESLint',
    identifier: {
      id: 'dbaeumer.vscode-eslint',
      uuid: '583b2b34-2c1e-4634-8c0b-0b82e283ea3a'
    }
  }, {
    displayName: 'DotENV',
    identifier: {
      id: 'mikestead.dotenv',
      uuid: '532533c9-a894-4a58-9eee-bbfbe7c06f71'
    }
  }, {
    displayName: 'Vue Language Features (Volar)',
    identifier: {
      id: 'vue.volar',
      uuid: 'a5223b43-8621-4351-a14e-3d560f85f277'
    }
  }, {
    displayName: 'TypeScript Vue Plugin (Volar)',
    identifier: {
      id: 'vue.vscode-typescript-vue-plugin',
      uuid: '78d16c76-388b-44e4-8470-6790d6c3d2d1'
    }
  }, {
    displayName: 'GitLens — Git supercharged',
    identifier: {
      id: 'eamodio.gitlens',
      uuid: '4de763bd-505d-4978-9575-2b7696ecf94e'
    }
  }, {
    displayName: 'i18n Ally',
    identifier: {
      id: 'lokalise.i18n-ally',
      uuid: '8ab81d13-c812-4a2f-8f19-c32e3655e53c'
    }
  }]
}


fs.writeFileSync('profiles.code-profile', JSON.stringify({
  ...profiles,
  extensions: JSON.stringify(profiles.extensions)
}), 'utf8')
