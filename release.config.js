module.exports = {
  plugins: [
    ["@semantic-release/commit-analyzer"],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          issueUrlFormat: "https://jira.com/browse/BBECOM-{{id}}",
          issuePrefixes: ['#', 'BBECOM-', '#BBECOM-', 'bbecom-'],
        }
      }
    ],
    ["@semantic-release/changelog"],
    ["@semantic-release/github"],
    ['@semantic-release/git']
  ]
};
